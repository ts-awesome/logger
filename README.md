# ts-logger

Provides logging and error tracking capabilities

## Basic usage

config expected to provide `ILoggerConfig` for `logger` key and `IReporterConfig` for `reporter` key.

```ts
import setup from '@viatsyshyn/ts-logger';

// TODO: create container and config

setup(container, config);
```

```
import {LoggerFactory, ILoggerFactory, ILogger} from '@viatsyshyn/ts-logger';

@injectable()
class SampleUser {

    private readonly logger: ILogger;

    constructor(
        @inject(LoggerFactory) loggerFactory: ILoggerFactory,
    ) {
        this.logger = loggerFactory(SampleUser.name);
    }

    public logRandom() {
        this.logger.log('random:', Math.random());
    }

    public errors() {
        this.logger.error(new Error('sample'));
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
    case 'CONSOLE': return require('./logger/console')(logLevel);
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

function setup(container: Container, config: IConfig) {
  const driver = getDriver(config.get<ILoggerConfig>('logger') || {});
  const reporter = getReporter(config.get<IReporterConfig>('reporter') || {});

  container.bind<ILoggerFactory>(Symbols.LoggerFactory)
    .toConstantValue((name: string) => new Logger(name, driver, reporter));
}
```
