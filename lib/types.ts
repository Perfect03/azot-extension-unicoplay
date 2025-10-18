export interface IDevice {
  last_use: number
  name: string
  type: string
  uid: string
}
export interface ILogin {
  _id: string
  ab: unknown[]
  apple_id?: string
  apple_info?: unknown
  authentication_token: string
  contact_info: {
    email_is_confirmed: boolean
  }
  country_code: string
  current_country_code: string
  date_created: string
  devices: IDevice[]
  email: string
  externals: unknown[]
  google_id?: string
  is_registered: boolean
  language: ILanguage
  phone: string
  profile_for_child: boolean
  profile_id: string
  promo_manager: boolean
  segmentation_id: string
  status_gdpr?: unknown
  subscriptions: ISubscription[]
  tags: unknown[]
  traffic_source: unknown
  trial_is_available: boolean
  type: string
  virtual: boolean
  vk_id?: string
  vk_info: unknown
  yandex_id?: string
  yandex_info: unknown
}

export interface IContent {
  _cls: 'Product.Series'|'Product.Season'|'Product.Movie'|'Episode'
  _id: string
  alias: string
  background: IImage
  badges: unknown[]
  banner: IImage
  description: string
  display: boolean
  downloadable: boolean
  enabled_for_partner: boolean
  for_kids: boolean
  in_subscription: boolean
  is_disabled: boolean
  is_free: boolean
  is_premier: boolean
  is_preview: boolean
  items?: IContent[]
  kinopoisk_id?: string
  locales: string[]
  logotype: IImage
  num: number
  number: number
  origin_countries?: {code: string, title: string}[]
  packshot: IImage
  play_last_season: boolean
  playback_options: string
  publish: string
  rating_age: string
  release_date: number
  restrictions: unknown[]
  slug: string
  special: boolean
  standard: boolean
  start_release_date: string
  subtitle: string
  thumbnail: IImage
  title: string
  title_original: string
  uid: string
  unavailable_by_geo: boolean
  unpublish: number
  url: string
  vertical: IImage
  year: number
}

export interface IStreamOptions {
  _cls: string
  _id: string
  bumper_time?: string
  description: string
  drm_encrypted: boolean
  duration: number
  end_recap_time?: string
  end_titles_time?: string
  entry_titles_time?: string
  is_free: boolean
  license: {
    fp: string
    fp_cer: string
    pr: string
    wv: string
  }
  limited_by_trial: boolean
  play_next: string
  playlist: string
  playlists: IPlaylist[]
  start_recap_time?: string
  title: string
  uid: string
}
export interface IPlaylist {
  items: IPlaylistItem[]
  quality: string
}
export interface IPlaylistItem {
  lang: string
  sources: IPlaylistItemSource
}
export interface IPlaylistItemSource {
  dash: string
  hls: string
  ss: string
}

export interface IAudioTrack {
  display_name: string
  id: string
  index: number
  lang: string
  lang_iso_639_1: string
}


export interface ILanguage {
  audio: string
  content_lang: string[]
  interface: string
  subtitles: string
}
export interface ISubscription {
  _id: string
  billing_expire: number
  expiration: number
  googleplay_id?: string
  huawei_id?: string
  itunes_product_id?: string
  manageable: boolean
  packets: unknown[]
  period: number
  reccurent: boolean
  roku_product_id?: string
  standalone: boolean
  start: number
  summary: string
  title: string
  type: number
}
export interface IImage {
  image_1x: string
  image_15x: string
}