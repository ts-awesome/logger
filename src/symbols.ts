export const ConfigSymbol = Symbol.for('IConfig');
export const LoggerFactorySymbol = Symbol.for('LoggerFactory');
export const LoggerDriverSymbol = Symbol.for('LoggerDriver');
export const ErrorReporterSymbol = Symbol.for('ErrorReporter');

export const Symbols = {
  Config: ConfigSymbol,
  LoggerFactory: LoggerFactorySymbol,
  LoggerDriver: LoggerDriverSymbol,
  ErrorReporter: ErrorReporterSymbol,
};

export default Symbols;
