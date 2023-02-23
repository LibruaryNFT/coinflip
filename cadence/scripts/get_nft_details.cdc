import Coin from "../contracts/Coin.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"

// https://github.com/jacob-tucker/nftdapp-tutorial/blob/main/src/cadence/scripts/get_nfts.js

pub fun main(account: Address): [&Coin.NFT] {
  let collection = getAccount(account).getCapability(Coin.CollectionPublicPath)
                    .borrow<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")
  let returnVals: [&Coin.NFT] = []
  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id)!)
  }
  return returnVals
}