import { IConfig, IConfigApp } from "@/config";
import { CanActivate, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiTestGuard implements CanActivate {
  @Inject(ConfigService)
  private readonly config: ConfigService<IConfig>;

  public canActivate(): boolean {
    const appConfig = this.config.get<IConfigApp>("app")!;

    return !appConfig.isProduction;
  }
}
