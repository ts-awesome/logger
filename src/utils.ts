
import {Container, interfaces} from 'inversify';

import {Config, ErrorReporter, LoggerDriver, LoggerFactory} from './symbols';
import {IErrorReporter, ILogger, ILoggerDriver, ILoggerFactory, LogLevel, Named} from "./interfaces";
import {Logger} from "./logger";

export type ReporterType = null | '' | 'SENTRY' | 'NOOP' | string;
export type LoggerType = null | '' | 'CONSOLE' | 'NOOP' | string;

import consoleFactory from './loggers/console';
import sentryFactory from './reporters/sentry';

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
    case 'SENTRY': return sentryFactory(extra);
    default:
      throw new Error(`Unknown reporter type ${type}`);
  }
}

export function setup(container: Container) {

  container.bind<ILoggerDriver>(LoggerDriver)
    .toFactory<ILoggerDriver>(({container}: interfaces.Context) => {
      const config = container.get<IConfig>(Config);
      return () => getDriver(config.get<ILoggerConfig>('logger') || {})
    });

  container.bind<IErrorReporter>(ErrorReporter)
    .toFactory<IErrorReporter>(({container}: interfaces.Context) => {
      const config = container.get<IConfig>(Config);
      return () => getReporter(config.get<IReporterConfig>('reporter') || {})
    });

  container.bind<ILoggerFactory>(LoggerFactory)
    .toFactory<ILogger>(({container}: interfaces.Context) => {
      return () => {
        const driver = container.get<ILoggerDriver>(LoggerDriver);
        const reporter = container.get<IErrorReporter>(ErrorReporter);
        return (name: any) => new Logger(typeof name === 'function' ? name.name : name, driver, reporter);
      };
    });
}
