import { BadRequestError } from '@common/errors/CustomError';
import { PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue: any = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const err = error.errors[0].message.split(' ');
      if (err.length === 1) err.push(err[0]); // if the message is only one word, we shift it so we don't lose it
      if (error.errors[0].path.length > 0) err[0] = error.errors[0].path[0];

      const str: string = err.join(' ');
      throw new BadRequestError(str.toLowerCase());
    }
  }
}
