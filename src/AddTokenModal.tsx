import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog"
import { Button } from "./components/button"
import { Input } from "./components/input"
import { Label } from "./components/label"
import { NetworkSelect } from "./NetworkSelect"
import { useGetNetworksQuery, useLazyGetTokensInfoQuery } from "./store/api"
import { SavedToken } from "./types"
import { useToast } from "./components/use-toast"

type AddTokenModalProps = {
  tokenList: SavedToken[]
  setTokenList: React.Dispatch<React.SetStateAction<SavedToken[]>>
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({
  tokenList,
  setTokenList,
}) => {
  const [network, setNetwork] = React.useState<string>("")
  const [token, setToken] = React.useState<string>("")

  const { toast } = useToast()

  const { data: networks } = useGetNetworksQuery()
  const [getTokenInfo] = useLazyGetTokensInfoQuery()

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleNetworkSelect = (network: string) => {
    setNetwork(network)
  }

  const handleAddToken = async (address: string) => {
    const token = tokenList.find((token) => token.address === address)

    if (!token) {
      const tokenInfo = await getTokenInfo([
        {
          network,
          addresses: [address],
        },
      ]).unwrap()

      if (!tokenInfo.data[0]) {
        toast({
          title: "Token not found",
          description: "Please check the address and try again",
          variant: "destructive",
        })

        return
      }
      const newToken: SavedToken = {
        address,
        name: tokenInfo.data[0].attributes.name,
        symbol: tokenInfo.data[0].attributes.symbol,
        network,
        holdings: 0,
      }

      setTokenList([...tokenList, newToken])
      localStorage.setItem("tokens", JSON.stringify([...tokenList, newToken]))
      setToken("")
      setIsModalOpen(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>Add Token</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Token</DialogTitle>
          <DialogDescription>
            Select a network and enter token address to add a new token.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Network
            </Label>
            {networks && (
              <NetworkSelect
                networks={networks.map((x) => {
                  return { value: x.id, label: x.attributes.name }
                })}
                selectedValue={network}
                selectNetwork={handleNetworkSelect}
              />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Token address
            </Label>
            <Input
              type="text"
              placeholder="Token Address"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => handleAddToken(token)}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddTokenModal
