export type NetworksResponse = {
  data: NetworksData[]
  links: NetworkLinks
}

export type NetworksData = {
  attributes: NetworkAttributes
  id: string
  type: string
}

export type NetworkAttributes = {
  name: string
  coingecko_asset_platform_id: string
}

export type NetworkLinks = {
  first: string
  last: string
  next: string
  prev: string
}

export type TokenResponse = {
  data: TokenData[]
}

export type TokenData = {
  attributes: TokenAttributes
  id: string
  type: string
}

export type TokenAttributes = {
  address: string
  coingecko_coin_id: string
  decimals: number
  fdv_usd: string
  market_cap_usd: string
  name: string
  price_usd: string
  symbol: string
  total_reserve_in_usd: string
  total_supply: string
}

export type SavedToken = {
  address: string
  network: string
  name: string
  holdings: number
  symbol: string
  imageUrl?: string
}
