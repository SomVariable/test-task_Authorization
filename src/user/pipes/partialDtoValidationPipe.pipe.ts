import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';


@Injectable()
export class PartialDtoValidationPipe implements PipeTransform<any> {
  constructor(private readonly property: string ){}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    if (typeof value !== 'object' || Object.keys(value).length === 0) {
      return value
    }

    const _value = plainToClass(CreateUserDto, value);
    const errors = await validate(_value);
    const error = errors.find(error => error.property === this.property)
    if(error){
      throw new BadRequestException(error.constraints);

    }

    return value;
  }
}