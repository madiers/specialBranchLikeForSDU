import { PipeTransform, Injectable } from "@nestjs/common";
import { decodeToken } from "../utils/token";

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  transform(value: string) {
    return decodeToken(value);
  }
}
