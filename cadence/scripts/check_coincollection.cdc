import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import Coin from "../contracts/Coin.cdc"

// This script checks if a coin collection exists

pub fun main(address: Address): Bool {
   
    let collection = getAccount(address).getCapability<&Coin.Collection{Coin.CollectionPublic}>(Coin.CollectionPublicPath).borrow()
    return collection != nil
   
}