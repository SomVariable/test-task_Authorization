import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function StrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'strongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
          if (!passwordRegex.test(value)) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'password too weak';
        },
      },
    });
  };
}