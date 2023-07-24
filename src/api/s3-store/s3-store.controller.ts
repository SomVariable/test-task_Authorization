import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { S3Service } from './s3-store.service';


@Controller('S3')
export class S3Controller {
  constructor(private readonly S3Service: S3Service) {}

}
