import { Role, User, UserProfile } from "@prisma/client";

export type jwtType = { email: string, sub: number, role: Role, iat: number, exp: number, sessionKey: string }


export type authUserReturnType = {
    user: User
    message?: string
}


export type authVerifyReturnType = {
    jwtToken: string,
    refreshToken: string,
    message?: string
}