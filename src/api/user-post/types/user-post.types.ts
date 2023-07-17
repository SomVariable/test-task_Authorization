import { CreateUserPostDto } from "../dto/create-user-post.dto"

export type pickPostProps = "author_id" | "channel_id" 


export type PostIDsType = {
    author_id: number,
    channel_id?: number
}
