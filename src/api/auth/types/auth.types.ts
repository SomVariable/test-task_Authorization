import { User,  } from "@prisma/client";



export type authUserReturnType = {
    user: User
    message?: string
}


export type authVerifyReturnType = {
    jwtToken: string,
    refreshToken: string,
    message?: string
}