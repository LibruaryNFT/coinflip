import FungibleToken from "./../contracts/FungibleToken.cdc"
import FlowToken from "./../contracts/FlowToken.cdc"
import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import MetadataViews from "./../contracts/MetadataViews.cdc"
import NFTMarketplace from "./../contracts/NFTMarketplace.cdc"
import Coin from "./../contracts/Coin.cdc"

transaction {
    prepare(signer: AuthAccount) {
           
        if signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath) == nil {
           // create a new empty collection
            let collection <- Coin.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: Coin.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic}>(Coin.CollectionPublicPath, target: Coin.CollectionStoragePath)
            signer.link<&Coin.Collection>(Coin.CollectionPrivatePath, target: Coin.CollectionStoragePath)
            log("Collection setup")

        } else {
        log("Collection already exists") 

        }
            
        if signer.borrow<&NFTMarketplace.SaleCollection>(from: /storage/SaleCollection) == nil {

            // create a new empty collection
            let FlowTokenVault = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            let CoinCollection = signer.getCapability<&Coin.Collection>(Coin.CollectionPrivatePath)
           

            // save it to the account
            signer.save(<- NFTMarketplace.createSaleCollection(CoinFlipCollection: CoinCollection, FlowTokenVault: FlowTokenVault), to: /storage/SaleCollection)
    
            // create a public capability for the collection
            signer.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection, target: /storage/SaleCollection)
            log("CoinFlip Marketplace Collection setup")
        
        } else {
            log("Sales Collection already exists")
        }
    }
    execute {
      log("Account setup ran")
    }
}
 