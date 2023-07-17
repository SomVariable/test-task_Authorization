import { CreateUserFileDto } from "../dto/create-user-file.dto"

export type pickPostProps = "user_id" | "user_post_id" | "profile_id"

export type IDsType = Pick<CreateUserFileDto, pickPostProps>
