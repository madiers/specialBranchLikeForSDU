import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { TokenPayload } from "@/@types";

export const GetToken = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req.token as TokenPayload;
});
