import Coin from "./../contracts/Coin.cdc"
import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import NFTMarketplace from "./../contracts/NFTMarketplace.cdc"
import FlowToken from "./../contracts/FlowToken.cdc"
import FungibleToken from "./../contracts/FungibleToken.cdc"

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {

    let coinCap =  acct.getCapability<&Coin.Collection{Coin.CollectionPublic}>(Coin.CollectionPublicPath)
    if !coinCap.check() {
         // save it to the account
        acct.save(<-Coin.createEmptyCollection(), to: Coin.CollectionStoragePath)

        // create a public capability for the collection
        acct.link<&Coin.Collection{Coin.CollectionPublic, NonFungibleToken.CollectionPublic}>(Coin.CollectionPublicPath, target: Coin.CollectionStoragePath)
        acct.link<&Coin.Collection>(Coin.CollectionPrivatePath, target: Coin.CollectionStoragePath)
        log("CoinCollection setup.")
    }

    let saleCap = 
    acct.getCapability<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection)

    if !saleCap.check() {
        let CoinCollection = acct.getCapability<&Coin.Collection>(/private/CoinCollection)
        let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        acct.save(<- NFTMarketplace.createSaleCollection(CoinFlipCollection: CoinCollection, FlowTokenVault: FlowTokenVault), to: /storage/SaleCollection)
        acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection, target: /storage/SaleCollection)
        log("SaleCollection setup.")
    }


    let recipientCollection = getAccount(acct.address).getCapability(/public/CoinCollection) 
                    .borrow<&Coin.Collection{NonFungibleToken.CollectionPublic}>()
                    ?? panic("Could not borrow the user's CoinCollection. This error should never occur.")

    let saleCollection = getAccount(account).getCapability(/public/SaleCollection)
                        .borrow<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection. This error should never occur.")

    

    let price = saleCollection.getPrice(id: id)

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault

    saleCollection.purchase(id: id, recipientCollection: recipientCollection, payment: <- payment)
  }

  execute {
    log("The user purchased a Coin.")
  }
}
