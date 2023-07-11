import { Role } from "@prisma/client";

export type jwtType = { email: string, sub: number, role: Role, iat: number, exp: number, sessionKey: string }