import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IConfig, IConfigAuth } from "@/config";
import { parseToken } from "../utils/token";
import { UserRoles } from "@/@types";
import { Reflector } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class RequireTokenWSGuard implements CanActivate {
  @Inject(ConfigService)
  private readonly config: ConfigService<IConfig>;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  public canActivate(context: ExecutionContext): boolean {
    const authConfig = this.config.get<IConfigAuth>("auth")!;
    const token = context.switchToWs().getData();

    try {
      const payload = parseToken(token, authConfig.tokenSecretKey);

      const roles = this.reflector.get<UserRoles[]>("roles", context.getHandler()) || [];

      if (roles.length && !roles.includes(payload.role))
        throw { code: "invalid-role", role: payload.role };

      return true;
    } catch (error) {
      if (error?.code === "invalid-role")
        throw new WsException(`Role '${error.role}' cannot access this resource`);
      return false;
    }
  }
}
