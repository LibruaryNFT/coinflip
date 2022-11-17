import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NFTMarketplace from "../contracts/NFTMarketplace.cdc"

// This script checks if a sale collection exists

pub fun main(address: Address): Bool {
   
    let collection = getAccount(address).getCapability<&NFTMarketplace.SaleCollection>(/public/SaleCollection).borrow()
    return collection != nil
   
}