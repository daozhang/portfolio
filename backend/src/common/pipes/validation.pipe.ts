import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      const property = error.property;
      const constraints = error.constraints;

      if (constraints) {
        formattedErrors[property] = Object.values(constraints);
      }

      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatNestedErrors(error.children, property);
        Object.assign(formattedErrors, nestedErrors);
      }
    });

    return formattedErrors;
  }

  private formatNestedErrors(
    children: any[],
    parentProperty: string,
  ): Record<string, string[]> {
    const nestedErrors: Record<string, string[]> = {};

    children.forEach((child) => {
      const property = `${parentProperty}.${child.property}`;
      const constraints = child.constraints;

      if (constraints) {
        nestedErrors[property] = Object.values(constraints);
      }

      if (child.children && child.children.length > 0) {
        const deepNestedErrors = this.formatNestedErrors(child.children, property);
        Object.assign(nestedErrors, deepNestedErrors);
      }
    });

    return nestedErrors;
  }
}