export interface ILogger {
  log(...message: any[]): void;
  info(...message: any[]): void;
  warn(...message: any[]): void;
  error(error: Error | string, ...extra: any[]): void;

  trace(...message: any[]): void;
  debug(...message: any[]): void;
}

export type LogLevel = keyof ILogger;

export interface ILoggerDriver {
  (level: LogLevel, ...data: string[]): void;
}

export interface IErrorReporter {
  (error: Error, ...extra: any[]): void;
}

export interface ILoggerFactory {
  (name: string): ILogger;
}
