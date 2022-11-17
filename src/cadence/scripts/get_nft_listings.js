export const getNFTListings = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0x9582fcd59741438c
import NFTMarketplace from 0x9582fcd59741438c

// This script returns an array of all the NFT IDs in an account's collection.

pub fun main(account: Address): {UInt64: NFTMarketplace.SaleItem} {
    let saleCollection = getAccount(account).getCapability(/public/SaleCollection)
                          .borrow<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>()
                          ?? panic("Could not borrow the user's SaleCollection")
  
    let collection = getAccount(account).getCapability(/public/CoinCollection) 
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
 
`




