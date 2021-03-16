// based on https://en.wikipedia.org/wiki/ANSI_escape_code

export const reset = "\x1b[0m"
export const bold = "\x1b[1m"
export const dim = "\x1b[2m"
export const italic = "\x1b[3m"
export const underscore = "\x1b[4m"
export const blink = "\x1b[5m"
export const reverse = "\x1b[7m"
export const hidden = "\x1b[8m"

export const fgBlack = "\x1b[30m"
export const fgRed = "\x1b[31m"
export const fgGreen = "\x1b[32m"
export const fgYellow = "\x1b[33m"
export const fgBlue = "\x1b[34m"
export const fgMagenta = "\x1b[35m"
export const fgCyan = "\x1b[36m"
export const fgSilver = "\x1b[37m"

export const bgBlack = "\x1b[40m"
export const bgRed = "\x1b[41m"
export const bgGreen = "\x1b[42m"
export const bgYellow = "\x1b[43m"
export const bgBlue = "\x1b[44m"
export const bgMagenta = "\x1b[45m"
export const bgCyan = "\x1b[46m"
export const bgSilver = "\x1b[47m"

export const fgGray = "\x1b[90m"
export const fgRedBright = "\x1b[91m"
export const fgGreenBright = "\x1b[92m"
export const fgYellowBright = "\x1b[93m"
export const fgBlueBright = "\x1b[94m"
export const fgMagentaBright = "\x1b[95m"
export const fgCyanBright = "\x1b[96m"
export const fgWhite = "\x1b[97m"

export const bgGray = "\x1b[100m"
export const bgRedBright = "\x1b[101m"
export const bgGreenBright = "\x1b[102m"
export const bgYellowBright = "\x1b[103m"
export const bgBlueBright = "\x1b[104m"
export const bgMagentaBright = "\x1b[105m"
export const bgCyanBright = "\x1b[106m"
export const bgWhite = "\x1b[107m"

export type CliColor = string;
export function colorize(text: string, ...modifiers: CliColor[]): string {
  return `${modifiers.join('')}${text}${reset}`;
}
