const file = require('../dist/loggers/file').default;
const {Logger} = require('../dist/logger')

const logger = new Logger('test-logger', file('debug'));

logger.trace('first part', 'then');
logger.log('first part', 'then', 'http://example.org');
logger.debug('first part', 'then', 'http://example.org');
logger.info('first part', 'then', 'http://example.org');
logger.warn('first part', 'then', 'http://example.org');
logger.error('plain error log');
logger.error(new TypeError('some error'));
