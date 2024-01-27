import React, { FC, useMemo } from "react"

type TokenNameProps = {
  symbol: string
  name: string
  price?: string
}

const TokenName: FC<TokenNameProps> = ({ symbol, name, price }) => {
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 10,
    }).format(parseFloat(price ?? "0"))
  }, [price])
  return (
    <div>
      <h4 className="font-semibold leading-none tracking-tight">{`${symbol} (${name})`}</h4>
      <p className="text-sm text-muted-foreground">{formattedPrice}</p>
    </div>
  )
}

export default TokenName
