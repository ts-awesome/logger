import {ILoggerDriver, LogLevel} from "../interfaces";

const mapping = {
  trace: -1,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

type Writer = (dest: string, line: string) => void;

export default function (
  logLevel: LogLevel,
  path = '%date%.log',
  writer: Writer = require('fs').appendFileSync
): ILoggerDriver {
  const current = mapping[logLevel] || 0;
  return function (level, prefix: string, message: string, ...data: unknown[]): void {
    if ((mapping[level] || 0) < current) {
      return;
    }

    try {
      const ts = new Date().toISOString();
      const [date] = ts.split('T');
      writer(path.replace('%date%', date),
        `${ts} | ${(`   ` + level).toUpperCase().substr(-5)} | [${prefix}] ${message} `
        + data.map(x => typeof x === 'string' ? x : JSON.stringify(x, null, 2)).join(' ')
        + '\n',
      )
    } catch (e) {
      // ignored
    }
  };
}
