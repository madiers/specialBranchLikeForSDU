export type UserRoles = "user" | "service" | "admin" | "unknown";

export interface TokenPayload {
  _id?: string;
  role: UserRoles;
  phone: string;
}
