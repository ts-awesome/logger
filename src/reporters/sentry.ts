import { IErrorReporter } from '../interfaces';

declare var window: any;

export default function ({dsn, ...extra}: any): IErrorReporter {
  if (dsn === undefined) {
    throw new Error(`Sentry reporter requires 'dsn' property`);
  }

  const Sentry = typeof window === 'undefined' ? require('@sentry/node') : require('@sentry/browser');

  Sentry.init({dsn});

  return (error: Error, data: any[]) => {
    const {user, tags, ...extras} = Object.assign({}, extra, ...data?.map((x, i) => {
      return Object.getPrototypeOf(x) === Object ? x : {[i]: x};
    }));
    Sentry.configureScope((scope: any) => {
      scope.clear();
      user && scope.setUser(user);
      tags && scope.setTags(tags);
      extras && scope.setExtras(extras);
    });

    Sentry.captureException(error);
  }
}
