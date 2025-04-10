import HttpStatus from '../utils/httpStatus';

export default class BadRequest extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}
