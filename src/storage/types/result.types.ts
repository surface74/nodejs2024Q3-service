import { ErrorMessage } from './error-message.enum';

export interface Result {
  errorText?: ErrorMessage;
  data?: unknown;
}

export class DbResult implements Result {
  readonly errorText: ErrorMessage = ErrorMessage.OK;
  readonly data: unknown = null;

  constructor(param: Result) {
    if (param.errorText) this.errorText = param.errorText;
    if (param.data) this.data = param.data;
  }

  public isError = () => !!this.errorText;
}
