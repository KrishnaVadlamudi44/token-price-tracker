import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { NetworksData, NetworksResponse, TokenResponse } from "../types"
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes"

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
          const res: QueryReturnValue = await fetchWithBQ(link ?? `networks`)

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
        let resp: TokenResponse = { data: [] }
        await Promise.all(
          _arg.map(async ({ network, addresses }) => {
            const res: QueryReturnValue = await fetchWithBQ(
              `networks/${network}/tokens/multi/${addresses.join(",")}`
            )
            resp = {
              ...resp,
              data: [...resp.data, ...(res.data as TokenResponse).data],
            }
          })
        )

        return { data: resp }
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
