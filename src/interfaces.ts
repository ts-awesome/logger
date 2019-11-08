export interface ILogger {
  log(message: string, ...extra: any[]): void;
  info(message: string, ...extra: any[]): void;
  warn(message: string, ...extra: any[]): void;
  error(error: Error | string, ...extra: any[]): void;

  trace(message: string, ...extra: any[]): void;
  debug(message: string, ...extra: any[]): void;
}

export type LogLevel = keyof ILogger;

export interface ILoggerDriver {
  (level: LogLevel, ...data: string[]): void;
}

export interface IErrorReporter {
  (error: Error, ...extra: any[]): void;
}

export type Named = {
  name: string;
}

export interface ILoggerFactory {
  (name: string | Named): ILogger;
}
