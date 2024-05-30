import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { BadRequestError } from "@common/errors/CustomError";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const err = error.errors[0].message.split(" ");
      err[0] = error.errors[0].path[0];
      const str = err.join(" ");
      throw new BadRequestError(str);
    }
  }
}