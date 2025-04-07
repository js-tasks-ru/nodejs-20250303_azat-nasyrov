import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId, Types } from "mongoose";

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  public transform(value: string): Types.ObjectId {
    if (!isValidObjectId(value)) {
      throw new BadRequestException("not a valid object id");
    }

    return new Types.ObjectId(value);
  }
}
