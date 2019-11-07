
import {Container} from 'inversify';
import {IConfig} from 'config';

import Symbols from './symbols';
import {ILoggerFactory, LogLevel} from "./interfaces";
import {Logger} from "./logger";

export type ReporterType = null | '' | 'SENTRY' | 'NOOP';
export type LoggerType = null | '' | 'CONSOLE' | 'NOOP';

import consoleFactory from './loggers/console';

export interface IReporterConfig {
  type: ReporterType;
  uid: string;
  [key: string]: any;
}

export interface ILoggerConfig {
  type: LoggerType;
  logLevel: LogLevel;
}

function getDriver({type, logLevel}: ILoggerConfig) {
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

function getReporter({type, ...extra}: IReporterConfig) {
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

  container.bind<ILoggerFactory>(Symbols.LoggerFactory)
    .toConstantValue((name: string) => new Logger(name, driver, reporter));
}
