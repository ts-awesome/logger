import {IErrorReporter, ILogger, ILoggerDriver} from "./interfaces";

function getCtor(x): string {
  return (typeof x === 'object' && x && Object.getPrototypeOf(x).constructor?.name) + ':' ?? '';
}

export class Logger implements ILogger {

  constructor(
    private readonly name: string,
    private readonly driver: ILoggerDriver,
    private readonly reporter?: IErrorReporter,
  ) {
  }

  public log(message: string, ...extra: unknown[]): void {
    this.driver('log', this.name, message, ...extra);
  }

  public info(message: string, ...extra: unknown[]): void {
    this.driver('info', this.name, message, ...extra);
  }

  public warn(message: string, ...extra: unknown[]): void {
    this.driver('warn', this.name, message, ...extra);
  }

  public trace(message: string, ...extra: unknown[]): void {
    this.driver('trace', this.name, message, ...extra);
  }

  public debug(message: string, ...extra: unknown[]): void {
    this.driver('debug', this.name, message, ...extra);
  }

  public error(error: Error | string, ...extra: unknown[]): void {
    if (error instanceof Error) {
      const {message, stack} = error;
      this.driver('error', this.name, stack?.replace(/^Error:/, getCtor(error)) ?? message);
    } else {
      this.driver('error', this.name, error);
      error = new Error(error);
    }
    this.reporter?.(error, ...extra);
  }
}
