import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 6);
    return hashedPassword;
  }
}