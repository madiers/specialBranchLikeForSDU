import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { UserRoles } from "@/@types";
import { RequireTokenGuard } from "../guards/require-token.guard";

export const Protected = function(...roles: UserRoles[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(RequireTokenGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Не авторизован" })
  );
};
