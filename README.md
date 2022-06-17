# @ts-awesome/logger

TypeScript logger and error reporter

Key features:

* console and/or file logs
* colorful console logs
* sentry/slack error reporters
* configurable log level

## `Logger`

library provides a convenient `Logger` class to make things easier.

```ts
import {getLoggerFactory, Logger} from '@ts-awesome/logger';

const driverCfg = {
  type: 'CONSOLE', // or 'FILE" or 'NOOP'
}

const reporterCfg = {
  type: 'SENTRY', // or 'SLACK' or 'NOOP'
  dsn: 'dsn-1' // required for sentry
}

const loggerFactory = getLoggerFactory(driverCfg, reporterCfg);

const logger = loggerFactory('app');

logger.trace('something trivial');
logger.debug('something trivial');
logger.info('something usefull');
logger.warn('something to pay attantion to');
logger.error('something to be alerted with');
logger.error(new Error('something wrong'));
```

Please note that `console` can be used a replacement for Logger.

## Use with IoC container and @ts-awesome/config

```ts
import {Config} from '@ts-awesome/config';
import {Container} from "inversify";
import {getLoggerFactory} from "./utils";

const container: Container;
const config: Config;

const driverCfg = config.get<ILoggerConfig>('logger');
const reporterCfg = config.has('reporter') ? config.get<ILoggerConfig>('reporter') : undefined;

const loggerFactory = getLoggerFactory(driverCfg, reporterCfg);

container.bind<ILoggerFactory>(LoggerFactorySymbol).toConstantValue(loggerFactory);
```

## Bare console logger

```ts
import driverFactory from '@ts-awesome/logger/dist/loggers/console';

const logger = driverFactory(
  'log', // min log level
  true, // add colors, true by default
);

logger('log', 'something trivial');
logger('info', 'something usefull');
logger('warn', 'something to pay attantion to');
logger('error', 'something to be alerted with');
```

## Bare file logger

```ts
import driverFactory from '@ts-awesome/logger/dist/loggers/file';

const logger = driverFactory(
  'info', // min log level
  'logs-%date%.log', // files pattern, default is `%date%.log`
  /* alternative Writer, default is `require('fs').appendFileSync` */
);

logger('log', 'something trivial');
logger('info', 'something usefull');
logger('warn', 'something to pay attantion to');
logger('error', 'something to be alerted with');
```

## Composite logger

```ts
import consoleDriverFactory from '@ts-awesome/logger/dist/loggers/console';
import fileDriverFactory from '@ts-awesome/logger/dist/loggers/console';
import compositeDriverFactory from '@ts-awesome/logger/dist/loggers/composite';

const logger = compositeDriverFactory(
  fileDriverFactory('error', 'errors-%date%.log'),
  fileDriverFactory('info', 'logs-%date%.log'),
  consoleDriverFactory('log'),
);

logger('log', 'something trivial');
logger('info', 'something usefull');
logger('warn', 'something to pay attantion to');
logger('error', 'something to be alerted with');
```

## Bare sentry reporter

```ts
// sentry has to be installed separatly
import reporterFactory from '@ts-awesome/logger/dist/reporters/sentry';

const config = {
  dsn: 'dns-1', // your destination,
  // rest is added to report
  some: 'extra'
}

const reporter = reporterFactory(config);

const error = new Error('Test case');
const data = {
  user: 'some-id',
  tags: ['tag1', 'tag2'],
  other: 'extra'
}

reporter(error, data);
```

## Bare slack reporter

```ts
// cross-fetch has to be installed separatly
import reporterFactory from '@ts-awesome/logger/dist/reporters/slack';

const config = {
  webhook: 'https://example.org', // obtaine url from Slack
  username: 'ErrorReporterBot', 
  // rest is added to report
  some: 'extra'
}

const reporter = reporterFactory(config);

const error = new Error('Test case');
const data = {
  user: 'some-id',
  tags: ['tag1', 'tag2'],
  other: 'extra'
}

reporter(error, data);
```
