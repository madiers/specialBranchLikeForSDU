import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ApiTestGuard } from "../guards/api-test.guard";

interface ApiTestOptions {
  tags?: string[];
}

export const ApiTest = ({ tags = [] }: ApiTestOptions = {}) =>
  applyDecorators(UseGuards(ApiTestGuard), ApiTags("test-routes", ...tags));
