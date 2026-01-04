import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validatePhone } from 'validations-br';

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validatePhone(value);
        },
      },
    });
  };
}