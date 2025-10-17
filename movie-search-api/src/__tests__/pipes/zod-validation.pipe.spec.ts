import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

describe('ZodValidationPipe', () => {
  const testSchema = z.object({
    name: z.string().min(1),
    age: z.number().min(0),
  });

  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(testSchema);
  });

  it('should pass validation with valid data', () => {
    const validData = { name: 'John', age: 30 };

    const result = pipe.transform(validData, { type: 'body' });

    expect(result).toEqual(validData);
  });

  it('should throw BadRequestException with invalid data', () => {
    const invalidData = { name: '', age: -1 };

    expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(
      BadRequestException,
    );
  });

  it('should provide detailed error messages', () => {
    const invalidData = { name: '', age: 'not a number' };

    try {
      pipe.transform(invalidData, { type: 'body' });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = error.getResponse() as any;
      expect(response.message).toBe('Validation failed');
      expect(response.errors).toBeInstanceOf(Array);
      expect(response.errors.length).toBeGreaterThan(0);
    }
  });

  it('should handle missing required fields', () => {
    const invalidData = {};

    expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow(
      BadRequestException,
    );
  });
});
