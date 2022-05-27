import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseIntOptionalPipe implements PipeTransform {
  transform(value?: string) {
    if (!value) return value;

    const parsed = parseInt(value ?? "");
    if (isNaN(parsed)) throw new BadRequestException("Invalid number format");

    return parsed;
  }
}
