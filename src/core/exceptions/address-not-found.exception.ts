import { HttpException } from "@nestjs/common";

export class AddressNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      typeof message === "string"
        ? {
            message: message ?? "User address not found",
          }
        : message ?? { result: false },
      204
    );
  }
}
