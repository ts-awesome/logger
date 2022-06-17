import {ConfigSymbol, ErrorReporterSymbol, LoggerDriverSymbol, LoggerFactorySymbol} from './symbols';
import {IErrorReporter, ILogger, ILoggerDriver, ILoggerFactory, LogLevel, Named} from "./interfaces";
import {Logger} from "./logger";

export type ReporterType = null | '' | 'SENTRY' | 'NOOP' | string;
export type LoggerType = null | '' | 'CONSOLE' | 'FILE' | 'NOOP' | string;

import consoleFactory from './loggers/console';
import fileFactory from './loggers/file';
import sentryFactory from './reporters/sentry';
import slackFactory from './reporters/slack';

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
  colorize?: boolean;
}

export function getDriver({type, logLevel = 'debug', path, colorize}: ILoggerConfig): ILoggerDriver {
  switch (type?.toUpperCase()) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return (): void => void 0;
    case 'CONSOLE': return consoleFactory(logLevel, colorize ?? true);
    case 'FILE': return fileFactory(logLevel, path);
    default:
      throw new Error(`Unknown logger type ${type}`);
  }
}

export function getReporter({type, ...extra}: IReporterConfig): IErrorReporter {
  const types = type?.toUpperCase().split(',').map(x => x?.trim()).filter(x => x) ?? [];
  if (types.length > 1) {
    const reporters = types.map(type => getReporter({type, ...extra}));
    return function (error: Error, ...extra: unknown[]): void {
      try {
        reporters.forEach(h => h(error, ...extra));
      } catch (e) {
        console.error(e);
      }
    }
  }

  switch (types[0]) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return (): void => void 0;
    case 'SENTRY': return sentryFactory(extra as any);
    case 'SLACK': return slackFactory(extra as any);
    default:
      throw new Error(`Unknown reporter type ${type}`);
  }
}

export function getLoggerFactory(driverCfg: ILoggerConfig, reporterCfg?: IReporterConfig): ILoggerFactory {
  const driver = getDriver(driverCfg);
  const reporter = reporterCfg ? getReporter(reporterCfg) : undefined;
  return (nameOrConstructor: string | Named): ILogger => new Logger(
    typeof nameOrConstructor === 'string' ? nameOrConstructor : nameOrConstructor.name,
    driver,
    reporter
  );
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
