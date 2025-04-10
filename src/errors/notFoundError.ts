import HttpStatus from '../utils/httpStatus';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
