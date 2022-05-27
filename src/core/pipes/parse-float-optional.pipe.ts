import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseFloatOptionalPipe implements PipeTransform {
  transform(value?: string) {
    if (!value) return value;

    const parsed = parseFloat(value ?? "");
    if (isNaN(parsed)) throw new BadRequestException("Invalid number format");

    return parsed;
  }
}
