export const ConfigSymbol = Symbol.for('IConfig');
export const LoggerFactorySymbol = Symbol.for('LoggerFactory');
export const LoggerDriverSymbol = Symbol.for('LoggerDriver');
export const ErrorReporterSymbol = Symbol.for('ErrorReporter');

export default {
  Config: ConfigSymbol,
  LoggerFactory: LoggerFactorySymbol,
  LoggerDriver: LoggerDriverSymbol,
  ErrorReporter: ErrorReporterSymbol,
}
