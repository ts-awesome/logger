import {IErrorReporter, ILogger, ILoggerDriver} from "./interfaces";

export class Logger implements ILogger {

  private readonly prefix: string[];

  constructor(
    private readonly name: string,
    private readonly driver: ILoggerDriver,
    private readonly reporter: IErrorReporter,
  ) {
    this.prefix = [`${this.name}:`];
  }

  public log(...message: any[]): void {
    this.driver('log', ...this.prefix, ...message);
  }

  public info(...message: any[]): void {
    this.driver('info', ...this.prefix, ...message);
  }

  public warn(...message: any[]): void {
    this.driver('warn', ...this.prefix, ...message);
  }

  public trace(...message: any[]): void {
    this.driver('trace', ...this.prefix, ...message);
  }

  public debug(...message: any[]): void {
    this.driver('debug', ...this.prefix, ...message);
  }

  public error(error: Error | string, ...extra: any[]): void {
    if (error instanceof Error) {
      const {message, stack} = error;
      this.driver('error', ...this.prefix, message, JSON.stringify({stack}, null, 2));
    } else {
      this.driver('error', ...this.prefix, error);
      error = new Error(error);
    }
    this.reporter(error, ...extra);
  }
}
