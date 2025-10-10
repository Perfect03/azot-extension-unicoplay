import { defineExtension, type ContentSource, type MovieMetadata } from 'azot';

export default defineExtension({
  canHandle(url) {
    return new URL(url).hostname === 'bitmovin.com';
  },

  async fetchContentMetadata(url, options) {
    // https://bitmovin.com/demos/stream-test?format=dash
    const response = await fetch(url);
    const body = await response.text();

    // https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd
    const mpd = body.split("'").find((line) => line.endsWith('.mpd'));
    const filename = mpd?.split('/').pop()?.replace('.mpd', ''); // f08e80da-bf1d-4e3d-8899-f0f6155f6efa

    if (!mpd) return [];

    const source: ContentSource = { url: mpd };
    const metadata: MovieMetadata = { title: filename, source };
    return [metadata];
  },
});
