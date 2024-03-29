import React, { useMemo } from "react"
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
import { useGetTokensInfoQuery } from "./store/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/card"
import AddTokenModal from "./AddTokenModal"
import { TypographyH2, TypographyH3 } from "./components/typography"
import TokenName from "./TokenName"

function App() {
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

  const handlePortfolioReset = () => {
    setTokensList([])
    localStorage.setItem("tokens", JSON.stringify([]))
  }

  const portfolioValue = useMemo(() => {
    return tokensList.reduce((acc, token) => {
      const tokenPrice = parseFloat(
        tokensInfo?.data.find((x) => x.attributes.address === token.address)
          ?.attributes.price_usd ?? "0"
      )
      return acc + tokenPrice * token.holdings
    }, 0)
  }, [tokensInfo?.data, tokensList])

  return (
    <div className="container flex flex-col space-y-4">
      <div className="flex w-full justify-center h-8">
        <div className="flex flex-col">
          <TypographyH2>Crypto Portfolio</TypographyH2>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>Total value of all crypto holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <TypographyH3>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(portfolioValue)}
          </TypographyH3>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AddTokenModal tokenList={tokensList} setTokenList={setTokensList} />
          <Button variant={"outline"} onClick={handlePortfolioReset}>
            Reset
          </Button>
        </CardFooter>
      </Card>
      <div>
        <div className="flex w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Holdings</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokensList.map((token) => (
                <TableRow>
                  <TableCell className="font-medium">
                    <TokenName
                      name={token.name}
                      symbol={token.symbol}
                      price={
                        tokensInfo?.data.find(
                          (x) => x.attributes.address === token.address
                        )?.attributes.price_usd
                      }
                    />
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
                  <TableCell className="w-[10px]">
                    <Trash2
                      className="h-4"
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
