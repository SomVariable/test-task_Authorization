import { PrismaService } from './../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserPostDto } from './dto/create-user-post.dto';
import { UpdateUserPostDto } from './dto/update-user-post.dto';
import { UserFileService } from '../user-file/user-file.service';
import { PostIDsType } from './types/user-post.types';

@Injectable()
export class UserPostService {
  constructor(
    private readonly userFileService: UserFileService,
    private readonly prismaService: PrismaService
  ) { }

  async create(IDs: PostIDsType, message: string, files?: Express.Multer.File[]) {
    const newPostData = await this.prismaService.userPost.create({
      data: {
        text: message,
        ...IDs
      }
    })

    await this.userFileService.createMany(files, {
      user_id: IDs.author_id, 
      user_post_id: newPostData.id
    })
    
    return newPostData;
  }

  async findAll(userId: number,) {
    const posts = await this.prismaService.userPost.findMany({
      where: {author_id: userId}
    })
    return posts;
  }

  async findOne(userId: number, id: number) {
    const post = await this.prismaService.userPost.findFirst({
      where: {author_id: userId, id}
    })
    return post;
  }

  async update(userId: number, id: number, {message}: UpdateUserPostDto, newFiles: Express.Multer.File[]) {
    await this.userFileService.removeMany({
      user_id: userId, 
      user_post_id: id
    })
    
    await this.userFileService.createMany(
      newFiles, 
      {
        user_id: userId, 
        user_post_id: id
      })

    const updatedData = await this.prismaService.userPost.update({
      data: {text: message},
      where: {id}
    })

    return updatedData;
  }

  async remove(userId: number, postId: number) {
    const deletedPost = await this.prismaService.userPost.delete({
      where: {id: postId}
    })

    await this.userFileService.removeMany({user_id: userId, user_post_id: postId})

    return deletedPost;
  }
}
