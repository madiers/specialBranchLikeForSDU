import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IConfig, IConfigAuth } from "@/config";
import { parseToken } from "../utils/token";
import { UserRoles } from "@/@types";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RequireTokenGuard implements CanActivate {
  @Inject(ConfigService)
  private readonly config: ConfigService<IConfig>;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  public canActivate(context: ExecutionContext): boolean {
    const authConfig = this.config.get<IConfigAuth>("auth")!;
    const req = context.switchToHttp().getRequest();

    const pair = req.headers["authorization"]?.split(" ") || [];
    if (pair.length < 2 || pair[0] != "Bearer")
      throw new UnauthorizedException(
        "Invalid authorization format. 'Bearer <token>' required"
      );

    const token = pair[1];

    try {
      const payload = parseToken(token, authConfig.tokenSecretKey);

      const roles = this.reflector.get<UserRoles[]>("roles", context.getHandler()) || [];

      if (roles.length && !roles.includes(payload.role))
        throw { code: "invalid-role", role: payload.role };

      req.token = payload;
      return true;
    } catch (error) {
      if (error?.code === "invalid-role")
        throw new ForbiddenException(`Role '${error.role}' cannot access this resource`);
      return false;
    }
  }
}
