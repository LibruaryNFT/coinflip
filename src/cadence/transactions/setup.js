export const setup = `

import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
import NFTMarketplace from 0xf14637e23022698a
import Coin from 0xf14637e23022698a

transaction {
    prepare(signer: AuthAccount) {
           
        if signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath) == nil {
           // create a new empty collection
            let collection <- Coin.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: Coin.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic}>(/public/CoinCollection, target: /storage/CoinCollection)
            signer.link<&Coin.Collection>(/private/CoinCollection, target: /storage/CoinCollection)
            log("CoinFlip Collection setup")

        } else {
        log("CoinFlip Collection already exists") 

        }
            
        if signer.borrow<&NFTMarketplace.SaleCollection>(from: /storage/SaleCollection) == nil {

            // create a new empty collection
            let FlowTokenVault = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            let CoinCollection = signer.getCapability<&Coin.Collection>(/private/CoinCollection)
           

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

`