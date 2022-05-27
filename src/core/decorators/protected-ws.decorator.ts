import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";

import { UserRoles } from "@/@types";
import { RequireTokenWSGuard } from "../guards/require-token-ws.guard";

export const ProtectedWS = function(...roles: UserRoles[]) {
  return applyDecorators(SetMetadata("roles", roles), UseGuards(RequireTokenWSGuard));
};
