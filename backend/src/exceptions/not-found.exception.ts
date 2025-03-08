import { HttpException, HttpStatus, Type } from "@nestjs/common";

export class NotFoundException extends HttpException {
  constructor(type: Function) {
    super(
      `Entity with type ${type.name} not found `,
      HttpStatus.NOT_FOUND
    );
  }
}
