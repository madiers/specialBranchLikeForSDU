import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Model } from "mongoose";

import { OrderNotFoundException } from "@/core/exceptions/order-not-found.exception";
import {
  DeviceTokenDocument,
  DeviceTokenIM,
  DeviceTokenUserType,
  OrderDocument,
  OrderIM,
  OrderStatus,
} from "@/core/schemas";
import { SocketsGateway } from "@/core/sockets/sockets.gateway";
import { UsersService } from "@/modules/users/services/users.service";
import { ServicesService } from "@/modules/services/services/services.service";

import { CreateOrderDto } from "../entities/create-order.entity";

@Injectable()
export class OrdersService {
  @InjectModel(OrderIM.name)
  private readonly orderModel: Model<OrderDocument>;

  @InjectModel(DeviceTokenIM.name)
  private readonly deviceTokenModel: Model<DeviceTokenDocument>;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  @Inject(SocketsGateway)
  private readonly sockets: SocketsGateway;

  @InjectFirebaseAdmin()
  private readonly firebase: FirebaseAdmin;

  public async createOrder({ products, service, user, total }: CreateOrderDto) {
    const userDoc = await this.usersService.findUserById(user._id);
    const serviceDoc = await this.servicesService.findServiceById(service._id);

    const order = await this.orderModel.create({
      products,
      service: {
        ...service,
        phone: serviceDoc?.phone,
        name: serviceDoc?.name,
      },
      user: {
        ...user,
        phone: userDoc?.phone,
      },
      total,
      status: OrderStatus.PENDING,
    });

    const populatedOrder = await order
      .populate("products.product")
      .populate("user.address")
      .populate("service.address")
      .execPopulate();

    // Notify service
    this.sockets.server
      .to("orders.service: " + order.service.phone)
      .emit("newOrder", populatedOrder.toObject());

    const deviceToken = await this.deviceTokenModel.findOne({
      targetId: order.service._id,
      targetType: DeviceTokenUserType.SERVICE,
    });

    if (deviceToken) {
      await this.firebase.messaging.send({
        token: deviceToken.token,
        data: populatedOrder.toObject() as any,
        notification: {
          title: "Новый Заказ!",
          body: `У вас новый заказ, давайте его обработаем`,
        },
        topic: "new-order",
      });
    }
  }

  public async getCurrentUserOrders(userId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return this.orderModel
      .find({
        "user._id": userId,
        $or: [
          {
            status: {
              $in: [OrderStatus.PENDING, OrderStatus.DELIVERING],
            },
          },
          {
            status: {
              $in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
            },
            orderTime: {
              $gte: start,
              $lt: end,
            },
          },
        ],
      })
      .populate("products.product")
      .populate("user.address")
      .populate("service.address");
  }

  public async getCurrentServiceOrders(serviceId: string) {
    return this.orderModel
      .find({
        "service._id": serviceId,
        $or: [
          {
            status: {
              $in: [OrderStatus.PENDING, OrderStatus.DELIVERING],
            },
          },
        ],
      })
      .populate("products.product")
      .populate("user.address")
      .populate("service.address");
  }

  public async getUserHistory(userId: string, pageSize: number, page: number) {
    return this.orderModel
      .find({
        "user._id": userId,
        status: {
          $in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
        },
      })
      .skip(pageSize * page || 0)
      .limit(pageSize)
      .populate("products.product")
      .populate("user.address")
      .populate("service.address");
  }

  public async getServiceHistory(serviceId: string, pageSize: number, page: number) {
    return this.orderModel
      .find({
        "service._id": serviceId,
        status: {
          $in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
        },
      })
      .skip(pageSize * page || 0)
      .limit(pageSize)
      .populate("products.product")
      .populate("user.address")
      .populate("service.address");
  }

  public async updateOrderStatusFromUser(
    phone: string,
    orderId: string,
    status: OrderStatus,
  ) {
    const order = await this.orderModel.findOne({
      "user.phone": phone,
      _id: orderId,
    });

    if (!order) throw new OrderNotFoundException();

    if (status !== OrderStatus.CANCELLED)
      throw new HttpException(
        { result: false, message: "User can only cancel orders" },
        400,
      );

    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.PENDING)
      throw new HttpException(
        {
          result: false,
          message: "User can only cancel order on order.status = 'pending'",
        },
        400,
      );

    order.status = OrderStatus.CANCELLED;

    await order.save();

    // Notify service
    this.sockets.server
      .to("orders.service: " + order.service.phone)
      .emit("updateOrderStatus", {
        _id: order._id,
        status: order.status,
      });

    const deviceToken = await this.deviceTokenModel.findOne({
      targetId: order.service._id,
      targetType: DeviceTokenUserType.SERVICE,
    });

    if (deviceToken) {
      await this.firebase.messaging.send({
        token: deviceToken.token,
        data: {
          _id: order._id,
          status: order.status,
        },
        notification: {
          title: "Пользователь отменил заказ",
          body: `Перейдите в приложение для подробностей`,
        },
        topic: "order-user-cancelled",
      });
    }

    return {
      result: true,
    };
  }

  public async updateOrderStatusFromService(
    phone: string,
    orderId: string,
    status: OrderStatus,
  ) {
    const order = await this.orderModel.findOne({
      "service.phone": phone,
      _id: orderId,
    });

    if (!order) throw new OrderNotFoundException();

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status))
      throw new HttpException(
        { result: false, message: "Service can't change statuses of finished orders" },
        400,
      );

    order.status = status;
    await order.save();

    // Notify service
    this.sockets.server.to("orders.user: " + order.user.phone).emit("updateOrderStatus", {
      _id: order._id,
      status: order.status,
    });

    const deviceToken = await this.deviceTokenModel.findOne({
      targetId: order.service._id,
      targetType: DeviceTokenUserType.SERVICE,
    });

    if (deviceToken) {
      await this.firebase.messaging.send({
        token: deviceToken.token,
        data: {
          _id: order._id,
          status: order.status,
        },
        notification: {
          title: "Статус вашего заказа обновлен",
          body: `Перейдите в приложение для подробностей`,
        },
        topic: "order-user-cancelled",
      });
    }

    return {
      result: true,
    };
  }
}
