import { HttpException, HttpStatus, Type } from "@nestjs/common";

export class AlreadyExistException extends HttpException {
  constructor(type: Function) {
    super(
      `Entity with type ${type.name} already exist `,
      HttpStatus.CONFLICT
    );
  }
}
