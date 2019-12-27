import {ILoggerDriver, LogLevel} from "../interfaces";

const mapping = {
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

type Writer = (dest: string, line: string) => void;

export default function (
  logLevel: LogLevel,
  path: string = '%date%.log',
  writer: Writer = require('fs').appendFileSync
): ILoggerDriver {
  const current = mapping[logLevel] || 0;
  return function (level, ...data: any[]) {
    if ((mapping[level] || 0) < current) {
      return;
    }

    try {
      const ts = new Date().toISOString();
      const [date] = ts.split('T');
      writer(path.replace('%date%', date),
        `[${ts}] ${(`   ` + logLevel).toUpperCase().substr(-5)} `
        + data.map(x => typeof x === 'string' ? x : JSON.stringify(x, null, 2)).join(' ')
        + '\n',
      )
    } catch (e) {
      // ignored
    }
  };
}
