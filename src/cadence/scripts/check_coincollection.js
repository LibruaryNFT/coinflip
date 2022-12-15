export const checkCoinCollection = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0x91b3acc974ec2f7d

// This script checks if a coin collection exists

pub fun main(address: Address): Bool {
   
    let collection = getAccount(address).getCapability<&Coin.Collection{Coin.CollectionPublic}>(/public/CoinCollection).borrow()
    return collection != nil
   
}


`