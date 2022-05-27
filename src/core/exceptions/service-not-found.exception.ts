import { HttpException } from "@nestjs/common";

export class ServiceNotFoundException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(
      typeof message === "string"
        ? {
            message: message ?? "Service not found",
          }
        : message ?? { result: false },
      204
    );
  }
}
