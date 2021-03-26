import { IErrorReporter } from '../interfaces';

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x != null && Object.getPrototypeOf(x).constructor === Object;
}

export default function ({dsn, ...extra}: { dsn: string; [key: string]: unknown }): IErrorReporter {
  if (dsn === undefined) {
    throw new Error(`Sentry reporter requires 'dsn' property`);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Sentry = require('sentry-ponyfill');

  Sentry?.init?.({dsn});

  return ((error: Error, ...data: unknown[]): void => {
    const {user, tags, ...extras} = Object.assign({}, extra, ...data.map((x, i) => isObject(x) ? {...x} : {['_' + i]: x}));
    Sentry?.configureScope?.((scope) => {
      scope.clear();
      user && scope.setUser(user);
      tags && scope.setTags(tags);
      extras && scope.setExtras(extras);
    });

    Sentry?.captureException?.(error);
  });
}
