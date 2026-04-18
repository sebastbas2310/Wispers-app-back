import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('ID is required');
    }

    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid MongoDB ID format: ${value}`);
    }

    return value;
  }
}
