import FungibleToken from "./../contracts/FungibleToken.cdc"
import FlowToken from "./../contracts/FlowToken.cdc"
import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import MetadataViews from "./../contracts/MetadataViews.cdc"
import NFTMarketplace from "./../contracts/NFTMarketplace.cdc"
import Coin from "./../contracts/Coin.cdc"

transaction {

  prepare(acct: AuthAccount) {
    
     if acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/SaleCollection) == nil {
      let CoinCollection = acct.getCapability<&Coin.Collection>(/private/CoinCollection)
      let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

      acct.save(<- NFTMarketplace.createSaleCollection(CoinFlipCollection: CoinCollection, FlowTokenVault: FlowTokenVault), to: /storage/SaleCollection)
      acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection, target: /storage/SaleCollection)
    }
  }

}

 