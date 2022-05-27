import { HttpException } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      typeof message === "string"
        ? {
            message: message ?? "User not found",
          }
        : message ?? { result: false },
      204
    );
  }
}
