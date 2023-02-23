export const checkCoinCollection = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0xf8568211504c7dcf

// This script checks if a coin collection exists

pub fun main(address: Address): Bool {
   
    let collection = getAccount(address).getCapability<&Coin.Collection{Coin.CollectionPublic}>(Coin.CollectionPublicPath).borrow()
    return collection != nil
   
}


`