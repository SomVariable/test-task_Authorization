import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Cookies } from 'src/decorators/cookie.decorator';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  

}
