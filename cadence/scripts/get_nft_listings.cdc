import Coin from "../contracts/Coin.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NFTMarketplace from "../contracts/NFTMarketplace.cdc"

pub fun main(account: Address): {UInt64: NFTMarketplace.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/SaleCollection)
                        .borrow<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(Coin.CollectionPublicPath) 
                    .borrow<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: NFTMarketplace.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)!

    returnVals.insert(key: nftRef.id, NFTMarketplace.SaleItem(_price: price, _nftRef: nftRef))
  }

  return returnVals
}
