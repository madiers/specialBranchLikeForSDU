import { HttpException } from "@nestjs/common";

export class OrderNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      typeof message === "string"
        ? {
            result: false,
            message: message ?? "Order not found",
          }
        : message ?? { result: false },
      204
    );
  }
}
