export const unlistFromSaleTx = `

import NFTMarketplace from 0xf8568211504c7dcf

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/SaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`