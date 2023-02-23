import NFTMarketplace from "./../contracts/NFTMarketplace.cdc"
import FlowToken from "./../contracts/FlowToken.cdc"
import Coin from "./../contracts/Coin.cdc"
import FungibleToken from "./../contracts/FungibleToken.cdc"


transaction(id: UInt64, price: UFix64) {
  prepare(acct: AuthAccount) {
    let saleCap = 
    acct.getCapability<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection)

    if !saleCap.check() {
        let CoinCollection = acct.getCapability<&Coin.Collection>(Coin.CollectionPrivatePath)
        let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        acct.save(<- NFTMarketplace.createSaleCollection(CoinFlipCollection: CoinCollection, FlowTokenVault: FlowTokenVault), to: /storage/SaleCollection)
        acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection, target: /storage/SaleCollection)
        log("Empty SaleCollection created.")
    }

    let saleCollection = acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/SaleCollection)
                            ?? panic("This SaleCollection does not exist")
    saleCollection.listForSale(id: id, price: price)
  }
  execute {
    log("User has listed a Coin for sale.")
  }
}
