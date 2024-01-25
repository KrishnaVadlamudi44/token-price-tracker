import React from "react"
import "./App.css"
import { SavedToken } from "./types"
import { Input } from "./components/input"
import { Button } from "./components/button"
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./components/table"

import { Trash2 } from "lucide-react"
import {
  useGetNetworksQuery,
  useGetTokensInfoQuery,
  useLazyGetTokensInfoQuery,
} from "./store/api"
import { NetworkSelect } from "./NetworkSelect"

function App() {
  const [network, setNetwork] = React.useState<string>("")
  const [token, setToken] = React.useState<string>("")

  const { data: networks } = useGetNetworksQuery(undefined, { skip: false })
  const [getTokenInfo] = useLazyGetTokensInfoQuery()

  const [tokensList, setTokensList] = React.useState<SavedToken[]>(
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens") as string)
      : []
  )

  const { data: tokensInfo } = useGetTokensInfoQuery(
    tokensList.map((x) => {
      return {
        network: x.network,
        addresses: tokensList
          .filter((it) => it.network === x.network)
          .map((it) => it.address),
      }
    })
  )

  const handleNetworkSelect = (network: string) => {
    setNetwork(network)
  }

  const handleAddToken = async (address: string) => {
    const token = tokensList.find((token) => token.address === address)

    if (!token) {
      const tokenInfo = await getTokenInfo([
        {
          network,
          addresses: [address],
        },
      ]).unwrap()
      const newToken: SavedToken = {
        address,
        name: tokenInfo.data[0].attributes.name,
        symbol: tokenInfo.data[0].attributes.symbol,
        network,
        holdings: 0,
      }

      setTokensList([...tokensList, newToken])
      localStorage.setItem("tokens", JSON.stringify([...tokensList, newToken]))
      setToken("")
    }
  }

  const handleRemoveToken = (address: string) => {
    const newTokensList = tokensList.filter(
      (token) => token.address !== address
    )

    setTokensList(newTokensList)
    localStorage.setItem("tokens", JSON.stringify(newTokensList))
  }

  const handleHoldingsChange = (address: string, holdings: number) => {
    const newTokensList = tokensList.map((token) => {
      if (token.address === address) {
        return { ...token, holdings }
      }

      return token
    })

    setTokensList(newTokensList)
    localStorage.setItem("tokens", JSON.stringify(newTokensList))
  }

  return (
    <div className="container flex flex-col">
      <div className="flex w-full justify-center h-8">
        <div className="flex flex-col">Coin Holdings</div>
      </div>
      <div>
        <div className="flex w-full space-x-2">
          {networks && (
            <NetworkSelect
              networks={networks.map((x) => {
                return { value: x.id, label: x.attributes.name }
              })}
              selectedValue={network}
              selectNetwork={handleNetworkSelect}
            />
          )}
          <Input
            type="email"
            placeholder="Token Address"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button type="submit" onClick={() => handleAddToken(token)}>
            Add
          </Button>
        </div>
        <div className="flex w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Holdings</TableHead>
                <TableHead>Value</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokensList.map((token) => (
                <TableRow>
                  <TableCell className="font-medium">{`${token.symbol} (${token.name})`}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 10,
                    }).format(
                      parseFloat(
                        tokensInfo?.data.find(
                          (x) => x.attributes.address === token.address
                        )?.attributes.price_usd ?? "0"
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={token.holdings}
                      onChange={(e) =>
                        handleHoldingsChange(
                          token.address,
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      parseFloat(
                        tokensInfo?.data.find(
                          (x) => x.attributes.address === token.address
                        )?.attributes.price_usd ?? "0"
                      ) * token.holdings
                    )}
                  </TableCell>
                  <TableCell>
                    <Trash2
                      className="h-3"
                      onClick={() => handleRemoveToken(token.address)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default App
