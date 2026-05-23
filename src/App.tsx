import React, { useMemo } from "react"
import "./App.css"
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
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "./store/store"
import { removeToken, updateHoldings, resetPortfolio } from "./store/tokenSlice"

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const tokensList = useSelector((state: RootState) => state.tokens)

  const queryArgs = useMemo(() => {
    const byNetwork = tokensList.reduce<Record<string, string[]>>(
      (acc, token) => {
        if (!acc[token.network]) acc[token.network] = []
        acc[token.network].push(token.address)
        return acc
      },
      {}
    )
    return Object.entries(byNetwork).map(([network, addresses]) => ({
      network,
      addresses,
    }))
  }, [tokensList])

  const {
    data: tokensInfo,
    isLoading,
    isError,
  } = useGetTokensInfoQuery(queryArgs)

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
          {isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              Loading prices…
            </p>
          )}
          {isError && (
            <p className="text-sm text-destructive mt-1">
              Failed to load prices.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <AddTokenModal />
          <Button
            variant={"outline"}
            onClick={() => dispatch(resetPortfolio())}
          >
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
                <TableRow key={token.address}>
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
                      min="0"
                      value={token.holdings}
                      onChange={(e) =>
                        dispatch(
                          updateHoldings({
                            address: token.address,
                            holdings: parseFloat(e.target.value) || 0,
                          })
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
                      onClick={() => dispatch(removeToken(token.address))}
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
