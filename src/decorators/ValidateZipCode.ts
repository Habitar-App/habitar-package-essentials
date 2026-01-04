import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validateCep } from 'validations-br';

export function IsValidZipCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidZipCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validateCep(value);
        },
      },
    });
  };
}