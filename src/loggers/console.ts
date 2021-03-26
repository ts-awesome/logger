import {ILoggerDriver, LogLevel} from "../interfaces";

import {
  bgRedBright,
  bgYellowBright,
  bold,
  fgBlack,
  fgBlue, fgGreen,
  fgRed,
  fgSilver,
  fgWhite,
  fgYellow,
  reset
} from "../cli-color";

const mapping = {
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

const COLORS = {
  'debug': fgSilver,
  'info': fgBlue,
  'warn': fgYellow,
  'error': fgRed,
}

export default function (logLevel: LogLevel, colorize = true): ILoggerDriver {
  const current = mapping[logLevel.toLowerCase()] || 0;

  console.info( `${bold}${fgGreen}logger is active with level ${fgYellow}${logLevel}(${current})${reset}`);

  function str(x: unknown): string {
    return typeof x === 'string' && x ? x : JSON.stringify(x);
  }

  if (!colorize) {
    return (level: LogLevel, prefix: string, message: string, ...data: unknown[]): void => {
      const l = level.toLowerCase();
      if ((mapping[l] || 0) < current) {
        return
      }

      data.unshift(message);
      data.unshift(`${prefix}:`);
      if (l === 'warn') {
        data.unshift(`⚠`)
      } else if (l === 'error') {
        data.unshift(`⚡`)
      }

      // tslint:disable:no-console eslint-disable-next-line no-console
      console[l](...data.map(str));
    }
  }

  return (level: LogLevel, prefix: string, message: string, ...data: unknown[]): void => {

    if ((mapping[level] || 0) < current) {
      return
    }

    data.unshift(message);
    data.unshift(`${COLORS[level] ?? ''}${bold}${prefix}:${reset}${COLORS[level] ?? ''}`);
    data.push(reset);

    if (level === 'warn') {
      data.unshift(`${bgYellowBright}${fgBlack}${bold} ⚠ ${reset}`)
    } else if (level === 'error') {
      data.unshift(`${bgRedBright}${fgWhite}${bold} ⚡ ${reset}`)
    }

    // tslint:disable:no-console eslint-disable-next-line no-console
    console[level](...data.map(str));
  };
}
