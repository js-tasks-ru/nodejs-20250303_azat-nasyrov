import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform {
  public transform(value: string): number {
    const conversionValueToNumber = parseInt(value, 10);
    if (isNaN(conversionValueToNumber)) {
      throw new BadRequestException(`"${value}" не является числом`);
    }

    return conversionValueToNumber;
  }
}
