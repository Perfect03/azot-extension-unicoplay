import { expect, test } from 'vitest';
import extension from './main';

test('canHandle', async () => {
  expect(typeof extension.canHandle).toBe('function');
  if (typeof extension.canHandle !== 'function') return;

  const unknownUrl = 'https://example.com';
  const canHandleUnknownUrl = extension.canHandle?.(unknownUrl);
  expect(canHandleUnknownUrl).toBe(false);

  const knownUrl = 'https://bitmovin.com/demos/stream-test?format=dash';
  const canHandleKnownUrl = extension.canHandle?.(knownUrl);
  expect(canHandleKnownUrl).toBe(true);
});
