import type { ContentMetadata, ContentSource } from "azot";
import { defineExtension, utils } from "azot";
import { DOMAIN, API, API_KEY, DEVICE_TYPE } from "./lib/constants";
import { checkAuth } from "./lib/auth";
import { fetchContentMetadada, fetchStreamOptions } from "./lib/api";
import { IContent } from "./lib/types";

const init = async () => {
  await checkAuth();
};

function parseUnicoUrl(urlStr: string) {
  const url = new URL(urlStr);
  const parts = url.pathname.split("/").filter(Boolean);

  const watchIndex = parts.indexOf("watch");
  if (watchIndex === -1 || watchIndex + 1 >= parts.length) {
    return { content: null, season: null };
  }

  const content = parts[watchIndex + 1];

  const seasonPart = parts[watchIndex + 2];
  const seasonMatch = seasonPart && seasonPart.match(/^season-(\d+)$/);
  const season = seasonMatch ? parseInt(seasonMatch[1], 10) : null;

  return { content, season };
}

const formContentMetadata = async (metadata: IContent, isSeries?: boolean) => {
  const streams = await fetchStreamOptions(
    isSeries ? "series/episode" : "movie",
    metadata.uid
  );

  const stream = streams?.playlists?.[streams?.playlists?.length - 1];
  const url = `${API}${
    stream?.items?.[stream?.items?.length - 1]?.sources?.dash
  }?auth_token=${localStorage.getItem(
    "authentication_token"
  )}`;

  const source: ContentSource = { url, headers: {'Api-Key': API_KEY[DEVICE_TYPE]} };

  if (streams?.license) {
    source.drm = {
      server: streams.license.wv,
    };
  }
  return {
    id: metadata._id,
    title: utils.sanitizeString(metadata.title),
    source,
  };
};

export default defineExtension({
  init,

  canHandle: (url) => new URL(url).hostname.includes(DOMAIN),

  fetchContentMetadata: async (url, args) => {
    const { content, season } = parseUnicoUrl(url);

    const results = [] as ContentMetadata[];

    if (content) {
      const metadata = await fetchContentMetadada(content);
      if (metadata?._id) {
        if (metadata.items) {
          // if series
          if (season)
            metadata.items = metadata.items?.filter(
              (el) => el.number == season
            );
          const eps = utils.extendEpisodes(args.episodes);
          if (eps.items.size) {
            for (const season of metadata.items) {
              season.items = season.items?.filter((ep) =>
                eps.has(ep.number, season.number)
              );
              if (season.items?.length) {
                for (const episode of season.items) {
                  const episodeTitle = episode.title;
                  episode.title = metadata.title;
                  episode.uid = `${season.uid}/${episode.uid}`;
                  const result = await formContentMetadata(episode, true);
                  results.push({
                    ...result,
                    episodeNumber: episode.number,
                    seasonNumber: season.number,
                    episodeTitle,
                  });
                }
              }
            }
          }
        } else {
          // else - movie
          const movie = await formContentMetadata(metadata);
          results.push(movie);
        }
      }
    }

    return results;
  },

  // fetchContentSource: async (contentId, args) => {
  //   console.log('fetchContentSource: ', contentId, args);
  //   return {url: ''}
  //   // const episodeSource = await getEpisodeSource(contentId, args);
  //   // return episodeSource;
  // },

  // fetchContentDrm: async ({ assetId }) => {
  //   console.log('fetchContentDrm: ', assetId);
  //   return {
  //     server: ROUTES.drm
  //   } // getDrmConfig(assetId);
  // },
});
