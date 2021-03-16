export interface ILogger {
  log(message: string, ...extra: unknown[]): void;
  info(message: string, ...extra: unknown[]): void;
  warn(message: string, ...extra: unknown[]): void;
  error(error: Error | string, ...extra: unknown[]): void;

  trace(message: string, ...extra: unknown[]): void;
  debug(message: string, ...extra: unknown[]): void;
}

export type LogLevel = keyof ILogger;

export interface ILoggerDriver {
  (level: LogLevel, prefix: string, message: string, ...data: unknown[]): void;
}

export interface IErrorReporter {
  (error: Error, ...extra: unknown[]): void;
}

export type Named = {
  name: string;
}

export interface ILoggerFactory {
  (name: string): ILogger;
  (ctor: Named): ILogger;
}
