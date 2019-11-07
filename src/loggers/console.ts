import {ILoggerDriver, LogLevel} from "../interfaces";

const mapping = {
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export default function (logLevel: LogLevel): ILoggerDriver {
  const current = mapping[logLevel] || 0;
  return (level: LogLevel, ...data: string[]) => {
    // tslint:disable:no-console
    ((mapping[level] || 0) >= current) && console[level](...data);
  };
};
