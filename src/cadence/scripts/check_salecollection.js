export const checkSaleCollection = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace from 0xf8568211504c7dcf

// This script checks if a sale collection exists

pub fun main(address: Address): Bool {
   
    let collection = getAccount(address).getCapability<&NFTMarketplace.SaleCollection>(/public/SaleCollection).borrow()
    return collection != nil
   
}


`