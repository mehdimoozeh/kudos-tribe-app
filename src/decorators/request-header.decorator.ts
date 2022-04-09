import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const dto = plainToClass(value, headers);

    const errors: ValidationError[] = await validate(dto);
    if (errors.length > 0) {
      const validationErrors = errors.map((obj) =>
        Object.values(obj.constraints),
      );
      console.log(validationErrors);
      throw new HttpException(
        `Validation failed : ${validationErrors}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return dto;
  },
);
