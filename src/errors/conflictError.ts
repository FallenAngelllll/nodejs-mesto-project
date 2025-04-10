import HttpStatus from '../utils/httpStatus';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.CONFLICT;
  }
}
