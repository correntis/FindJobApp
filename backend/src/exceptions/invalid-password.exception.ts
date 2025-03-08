import { HttpException, HttpStatus, Type } from "@nestjs/common";

export class InvalidPasswordException extends HttpException {
  constructor() {
    super(
      `Invalid password`,
      HttpStatus.BAD_REQUEST
    );
  }
}
