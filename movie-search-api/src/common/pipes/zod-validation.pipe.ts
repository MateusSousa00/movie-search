import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map(
          (err) => `${err.path.join('.')}: ${err.message}`,
        );
        throw new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
