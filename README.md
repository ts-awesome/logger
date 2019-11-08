# ts-logger

Provides logging and error tracking capabilities

```bash
npm install --save @viatsyshyn/ts-logger
# or
yarn add @viatsyshyn/ts-logger
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
import {setup, ILoggerFactory, LoggerFactory, ILogger, IConfig} from '@viatsyshyn/ts-logger';

// TODO: create container and bind config as Symbols.Config

setup(container);

const loggerFactory = container.get<ILoggerFactory>(LoggerFactory)
const logger = loggerFactory('system');

logger.info('app is ready');
```

```ts
import {LoggerFactory, ILoggerFactory, ILogger} from '@viatsyshyn/ts-logger';

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
```
