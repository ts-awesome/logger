
import {Container} from 'inversify';

import {ErrorReporter, LoggerDriver, LoggerFactory} from './symbols';
import {IErrorReporter, ILoggerDriver, ILoggerFactory, LogLevel} from "./interfaces";
import {Logger} from "./logger";

export type ReporterType = null | '' | 'SENTRY' | 'NOOP' | string;
export type LoggerType = null | '' | 'CONSOLE' | 'NOOP' | string;

import consoleFactory from './loggers/console';

interface IConfig {
  get<T>(setting: string): T;
}

export interface IReporterConfig {
  type: ReporterType;
  uid: string;
  [key: string]: any;
}

export interface ILoggerConfig {
  type: LoggerType;
  logLevel: LogLevel;
}

function getDriver({type, logLevel}: ILoggerConfig): ILoggerDriver {
  switch (type) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return () => {};
    case 'CONSOLE': return consoleFactory(logLevel);
    default:
      throw new Error(`Unknown logger type ${type}`);
  }
}

function getReporter({type, ...extra}: IReporterConfig): IErrorReporter {
  switch (type) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return () => {};
    case 'SENTRY': return require('./reporters/sentry').default(extra);
    default:
      throw new Error(`Unknown reporter type ${type}`);
  }
}

export function setup(container: Container, config: IConfig) {
  const driver = getDriver(config.get<ILoggerConfig>('logger') || {});
  const reporter = getReporter(config.get<IReporterConfig>('reporter') || {});

  container.bind<ILoggerDriver>(LoggerDriver).toConstantValue(driver);
  container.bind<IErrorReporter>(ErrorReporter).toConstantValue(reporter);

  container.bind<ILoggerFactory>(LoggerFactory)
    .toConstantValue((name: string | Function) => new Logger(typeof name === 'function' ? name.name : name, driver, reporter));
}
