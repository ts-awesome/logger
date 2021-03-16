const sentryFactory = require('../dist/reporters/sentry').default;
const {Logger} = require('../dist/logger')

const logger = new Logger('test-logger.local', () => void 0, sentryFactory({dsn: ''}));

logger.error('plain error log');
logger.error(new TypeError('some error'));
