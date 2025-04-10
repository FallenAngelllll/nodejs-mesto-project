import HttpStatus from '../utils/httpStatus';

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.FORBIDDEN;
  }
}
