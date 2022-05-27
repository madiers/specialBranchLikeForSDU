import { ProductIM, ServiceIM } from "@/core/schemas";
import { Module } from "@nestjs/common";
import { ServicesModule } from "../services/services.module";
import { ProductsController } from "./controllers/products.controller";
import { TestProductsController } from "./controllers/test-products.controller";
import { ProductsService } from "./services/products.service";
import { TestProductsService } from "./services/test-products.service";

@Module({
  imports: [ProductIM.getInjectionModel(), ServiceIM.getInjectionModel(), ServicesModule],
  controllers: [TestProductsController, ProductsController],
  providers: [TestProductsService, ProductsService],
})
export class ProductsModule {}
