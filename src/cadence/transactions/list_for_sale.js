export const listNFT = `

import NFTMarketplace from 0x9582fcd59741438c

transaction(id: UInt64, price: UFix64) {
    prepare(acct: AuthAccount) {
      let saleCollection = acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/SaleCollection)
                              ?? panic("This SaleCollection does not exist")
      saleCollection.listForSale(id: id, price: price)
    }
    execute {
      log("A user listed an NFT for Sale")
    }
  }


`