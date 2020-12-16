# ts-logger

Provides logging and error tracking capabilities

```bash
npm install --save @ts-awesome/logger
# or
yarn add @ts-awesome/logger
```

## Basic usage

config expected to provide `ILoggerConfig` for `logger` key and `IReporterConfig` for `reporter` key.

```json
{
    "logger": {
        "type": "CONSOLE",
        "logLevel": "warn"
    },
    "reporter": {
        "type": "SENTRY",
        "dsn": "__DSN__",
        "server-name": "extraA",
    }
}
```

Reporter `SENTRY` requires `@sentry/node` or `@sentry/browser` depending on environment. Please install separately.

```ts
import {setup, ILoggerFactory, LoggerFactory, ILogger, IConfig} from '@ts-awesome/logger';

// TODO: create container and bind config as Symbols.Config

setup(container);

const loggerFactory = container.get<ILoggerFactory>(LoggerFactory)
const logger = loggerFactory('system');

logger.info('app is ready');
```

```ts
import {LoggerFactory, ILoggerFactory, ILogger} from '@ts-awesome/logger';

@injectable()
class SampleUser {

    private readonly logger: ILogger;

    constructor(
        @inject(LoggerFactory) loggerFactory: ILoggerFactory,
    ) {
        this.logger = loggerFactory(SampleUser);
    }

    public logRandom() {
        this.logger.log('random: %d', Math.random());
    }

    public errors() {
        this.logger.error(new Error('sample'), {user: {id: 2}, tags: {role: 'demo'}});
    }
}
```

## Advanced

You can setup you own customized loggers and reporters using following example

```ts

function getDriver({type, logLevel}: ILoggerConfig) {
  switch (type) {
    case undefined:
    case null:
    case '':
    case 'NOOP': return () => {};
    // TODO: provide other drivers
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
    // TODO: provide other reporters
    default:
      throw new Error(`Unknown reporter type ${type}`);
  }
}

function setup(container: Container) {
  container.bind<ILoggerDriver>(LoggerDriverSymbol)
    .toDynamicValue(({container}: interfaces.Context) => {
      const config = container.get<IConfig>(ConfigSymbol);
      return getDriver(config.get<ILoggerConfig>('logger') || {})
    }).inSingletonScope();

  container.bind<IErrorReporter>(ErrorReporterSymbol)
    .toDynamicValue(({container}: interfaces.Context) => {
      const config = container.get<IConfig>(ConfigSymbol);
      return getReporter(config.get<IReporterConfig>('reporter') || {})
    }).inSingletonScope();

  container.bind<ILoggerFactory>(LoggerFactorySymbol)
    .toDynamicValue(({container}: interfaces.Context) => {
      const driver = container.get<ILoggerDriver>(LoggerDriverSymbol);
      const reporter = container.get<IErrorReporter>(ErrorReporterSymbol);
      return (name: any) => new Logger(typeof name === 'function' ? name.name : name, driver, reporter);
    }).inSingletonScope();
}
```
