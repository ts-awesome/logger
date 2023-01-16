const console = require('../dist/loggers/console').default;
const {Logger} = require('../dist/logger')

function write(logger) {
  logger.trace('trace first part', 'then');
  logger.debug('debug first part', 'then', 'http://example.org');
  logger.log('log first part', 'then', 'http://example.org');
  logger.info('info first part', 'then', 'http://example.org');
  logger.warn('warn first part', 'then', 'http://example.org');
  logger.error('error plain error log');
  logger.error(new TypeError('some error'));
}

global.console.log('all plain')
write (new Logger('test-logger.local', console('trace', false)));

global.console.log('all colorized')
write (new Logger('test-logger.local', console('trace', true)));

global.console.log('debug colorized')
write (new Logger('test-logger.local', console('debug', true)));

global.console.log('log colorized')
write (new Logger('test-logger.local', console('log', true)));

global.console.log('info colorized')
write (new Logger('test-logger.local', console('info', true)));

global.console.log('warn colorized')
write (new Logger('test-logger.local', console('warn', true)));

global.console.log('error colorized')
write (new Logger('test-logger.local', console('error', true)));
