export const getNFTDetails = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0xf8568211504c7dcf

// This script returns an array of all the NFT IDs in an account's collection.

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



`