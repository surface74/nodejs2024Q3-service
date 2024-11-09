import { ErrorMessage } from './error-message.enum';

export interface IResult {
  isError?: boolean;
  errorText?: ErrorMessage;
  data?: unknown;
}

export class Result implements IResult {
  readonly isError: boolean;
  readonly errorText: ErrorMessage = ErrorMessage.OK;
  readonly data: unknown = null;

  constructor(param: IResult) {
    this.isError = param.isError ? true : false;
    this.errorText =
      param.errorText && param.isError ? param.errorText : ErrorMessage.OK;
    if (param.data) this.data = param.data;
  }
}
