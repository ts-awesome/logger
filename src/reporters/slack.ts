import {IErrorReporter} from '../interfaces';

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x != null && Object.getPrototypeOf(x).constructor === Object;
}

interface Params {
  webhook: string;
  username?: string;

  [key: string]: unknown;
}

function getCtor(x): string {
  return (typeof x === 'object' && x && Object.getPrototypeOf(x).constructor?.name) + ': ' ?? '';
}

export default function ({webhook, username, ...params}: Params): IErrorReporter {

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fetch = require('cross-fetch');

  return ((error: Error, ...data: unknown[]): void => {
    const {user, tags, ...extras} = Object.assign({}, params, ...data.map((x, i) => isObject(x) ? {...x} : {[i]: x}));

    const {message, stack, ...extra} = error ?? {};

    const blocks = [
      `*⚡ ${getCtor(error)}${message} ⚡*`,

      // stack process
      stack ? '```' + stack.replace(/^Error: /, getCtor(error)) + '```' : null,

      // error extras
      Object.entries(extra ?? {})
        .map(([key, value]) => `_${key}_: \`${typeof value === 'string' ? value : JSON.stringify(value)}\``)
        .join('\n'),

      // generic extras
      Object.entries({user, tags, ...extras})
        .filter(([, _]) => _)
        .map(([key, value]) => `_${key}_: \`${JSON.stringify(value)}\``)
        .join('\n')

    ].filter(x=>x)
      .map(text => ({ type: "section", text: {
        type: "mrkdwn",
        text: text?.replace('>', '&gt;').replace('<', '&lt;').replace('&', '&amp;') }
      }));

    const payload = JSON.stringify({
      username,
      blocks,
      text: 'Ops! ' + message,
    });
    fetch(webhook,{
      method: 'POST',
      body: payload,
    }).catch(console.error);
  });
}
