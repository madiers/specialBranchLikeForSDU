import { TokenPayload } from "@/@types";
import jwt from "jsonwebtoken";

export function signToken(payload: TokenPayload, secret: string): string {
  return jwt.sign(payload, secret);
}

export function parseToken(token: string, secret: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload {
  return (jwt.decode(token) as unknown) as TokenPayload;
}
