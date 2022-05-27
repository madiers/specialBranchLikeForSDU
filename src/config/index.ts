import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";

const YAML_CONFIG_FILENAME =
  process.env.NODE_ENV === "production" ? "config.production.yaml" : "config.local.yaml";

export interface IConfigApp {
  isProduction: boolean;
  prefix: string;
  port: number;
}

export interface IConfigSms {
  expireTime?: number;
}

export interface IConfigRedis {
  port: number;
  host: string;
  password: string;
}

export interface IConfigMongodb {
  uri: string;
  username: string;
  password: string;
  db: string;
}

export interface IConfigAuth {
  tokenSecretKey: string;
  registrationTokenKey: string;
}

export interface IConfig {
  app: IConfigApp;
  sms: IConfigSms;
  redis: IConfigRedis;
  mongodb: IConfigMongodb;
  auth: IConfigAuth;
}

export const config = () => {
  return yaml.load(
    readFileSync(join(__dirname, "../../", YAML_CONFIG_FILENAME), "utf8")
  ) as IConfig;
};
