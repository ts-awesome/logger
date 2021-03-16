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

export default function (logLevel: LogLevel): ILoggerDriver {
  const current = mapping[logLevel] || 0;

  console.info( `${bold}${fgGreen}logger is active with level ${fgYellow}${logLevel}(${current})${reset}`);

  return (level: LogLevel, prefix: string, message: string, ...data: unknown[]): void => {

    data.unshift(message);

    data.unshift(`${COLORS[level] ?? ''}${bold}${prefix}:${reset}${COLORS[level] ?? ''}`);

    if (level === 'warn') {
      data.unshift(`${bgYellowBright}${fgBlack}${bold} ⚠ ${reset}`)
    } else if (level === 'error') {
      data.unshift(`${bgRedBright}${fgWhite}${bold} ⚡ ${reset}`)
    }

    data.push(reset);

    // tslint:disable:no-console eslint-disable-next-line no-console
    ((mapping[level] || 0) >= current) && console[level](...data);
  };
}
