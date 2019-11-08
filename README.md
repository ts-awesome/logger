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

```ts
import {setup, ILoggerFactory, LoggerFactory, ILogger} from '@viatsyshyn/ts-logger';

// TODO: create container and config

setup(container, config);

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

function setup(container: Container, config: IConfig) {
  const driver = getDriver(config.get<ILoggerConfig>('logger') || {});
  const reporter = getReporter(config.get<IReporterConfig>('reporter') || {});

  container.bind<ILoggerDriver>(Symbols.LoggerDriver).toConstantValue(driver);
  container.bind<IErrorReporter>(Symbols.ErrorReporter).toConstantValue(reporter);

  container.bind<ILoggerFactory>(Symbols.LoggerFactory)
    .toConstantValue((name: string) => new Logger(name, driver, reporter));
}
```
