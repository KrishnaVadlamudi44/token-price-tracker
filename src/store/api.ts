import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { NetworksData, NetworksResponse, TokenResponse } from "../types"

export const baseQuery = fetchBaseQuery({
  baseUrl: `https://api.geckoterminal.com/api/v2`,
})

const tokenApi = createApi({
  baseQuery: baseQuery,
  reducerPath: "tokenApi",
  tagTypes: ["networks"],
  endpoints: (build) => ({
    getNetworks: build.query<NetworksData[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const GetNetworks = async (
          networks: NetworksData[] = [],
          link?: string
        ): Promise<NetworksData[]> => {
          const res = await fetchWithBQ(link ?? `networks`)

          const { data, links } = res.data as NetworksResponse

          networks = networks.concat(...data)

          if (links.next) {
            const link = links.next.split("?")[1]
            return GetNetworks(networks, `networks?${link}`)
          }

          return networks
        }

        const data = await GetNetworks()

        return { data }
      },
    }),

    getTokensInfo: build.query<
      TokenResponse,
      Array<{ network: string; addresses: string[] }>
    >({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const results = await Promise.all(
          _arg.map(({ network, addresses }) =>
            fetchWithBQ(
              `networks/${network}/tokens/multi/${addresses.join(",")}`
            )
          )
        )

        const data = results.flatMap(
          (res) => (res.data as TokenResponse).data
        )

        return { data: { data } }
      },
    }),
  }),
})

export const {
  useGetNetworksQuery,
  useGetTokensInfoQuery,
  useLazyGetTokensInfoQuery,
} = tokenApi

export default tokenApi
