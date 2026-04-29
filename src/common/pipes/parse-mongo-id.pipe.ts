import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('ID is required');
    }

    // Accept both MongoDB ObjectIds and shortids
    const isValidMongoId = isValidObjectId(value);
    const isValidShortId = /^[a-zA-Z0-9_-]{9,14}$/.test(value); // shortid pattern

    if (!isValidMongoId && !isValidShortId) {
      throw new BadRequestException(`Invalid ID format: ${value}`);
    }

    return value;
  }
}
