import {ILoggerDriver} from "../interfaces";

export function CompositeLogger(...loggers: ILoggerDriver[]): ILoggerDriver {
  return function (level, ...data: string[]) {
    loggers.forEach(l => l.call(null, level, ...data));
  }
}
