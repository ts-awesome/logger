import {ILoggerDriver} from "../interfaces";

export default function (...loggers: ILoggerDriver[]): ILoggerDriver {
  return function (level, prefix: string, message: string, ...data: unknown[]): void {
    loggers.forEach(l => l.call(null, level, prefix, message, ...data));
  }
}
