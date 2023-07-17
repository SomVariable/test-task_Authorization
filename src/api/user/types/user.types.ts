import { User, UserProfile } from "@prisma/client";

export type userResponse = {
    user: User;
    message?: string;
    additionalInfo?: object;
}


export type userUnion = UserProfile & User
export type UserReturnType = Pick<User, "email"> & Pick<UserProfile, "login" | "birth_date" | "city" | "country">

export type usersResponse = {
    users: userUnion | userUnion[];
    totalCountUsers?: number;
    pagination?: number;
    page?: number;
    message?: string;
    additionalInfo?: object;
}