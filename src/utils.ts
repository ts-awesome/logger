import {ConfigSymbol, ErrorReporterSymbol, LoggerDriverSymbol, LoggerFactorySymbol} from './symbols';
import {IErrorReporter, ILogger, ILoggerDriver, ILoggerFactory, LogLevel} from "./interfaces";
import {Logger} from "./logger";

export type ReporterType = null | '' | 'SENTRY' | 'NOOP' | string;
export type LoggerType = null | '' | 'CONSOLE' | 'FILE' | 'NOOP' | string;

import consoleFactory from './loggers/console';
import fileFactory from './loggers/file';
import sentryFactory from './reporters/sentry';

interface IConfig {
  get<T>(setting: string): T;
}

export interface IReporterConfig {
  type: ReporterType;
  uid: string;
  [key: string]: unknown;
}

export interface ILoggerConfig {
  type: LoggerType;
  logLevel: LogLevel;
  path?: string;
}

export function getDriver({type, logLevel, path}: ILoggerConfig): ILoggerDriver {
  switch (type?.toUpperCase()) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return (): void => void 0;
    case 'CONSOLE': return consoleFactory(logLevel);
    case 'FILE': return fileFactory(logLevel, path);
    default:
      throw new Error(`Unknown logger type ${type}`);
  }
}

export function getReporter({type, ...extra}: IReporterConfig): IErrorReporter {
  switch (type?.toUpperCase()) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return (): void => void 0;
    case 'SENTRY': return sentryFactory(extra);
    default:
      throw new Error(`Unknown reporter type ${type}`);
  }
}

interface IContainer {
  get<T>(name: symbol): T;
  bind<T>(name: symbol): {
    toDynamicValue(provider: (context: {container: IContainer}) => T): {
      inSingletonScope();
    };
  };
}

export function setup(container: IContainer): void {

  container.bind<ILoggerDriver>(LoggerDriverSymbol)
    .toDynamicValue(({container}) => {
      const config = container.get<IConfig>(ConfigSymbol);
      return getDriver(config.get<ILoggerConfig>('logger') || {})
    }).inSingletonScope();

  container.bind<IErrorReporter>(ErrorReporterSymbol)
    .toDynamicValue(({container}) => {
      const config = container.get<IConfig>(ConfigSymbol);
      return getReporter(config.get<IReporterConfig>('reporter') || {})
    }).inSingletonScope();

  container.bind<ILoggerFactory>(LoggerFactorySymbol)
    .toDynamicValue(({container}) => {
      const driver = container.get<ILoggerDriver>(LoggerDriverSymbol);
      const reporter = container.get<IErrorReporter>(ErrorReporterSymbol);
      return (name): ILogger => new Logger(typeof name === 'function' ? name.name : name, driver, reporter);
    }).inSingletonScope();
}
