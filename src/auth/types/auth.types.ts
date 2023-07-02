import { Roles } from "@prisma/client";

export type jwtType = { email: string, sub: number, role: Roles, iat: number, exp: number }