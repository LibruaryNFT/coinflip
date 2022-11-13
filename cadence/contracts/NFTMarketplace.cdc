import NonFungibleToken from "./NonFungibleToken.cdc"
import Coin from "./Coin.cdc"
import FungibleToken from "./FungibleToken.cdc"
import FlowToken from "./FlowToken.cdc"

pub contract NFTMarketplace {

  pub struct SaleItem {
        pub let price: UFix64
    
        pub let nftRef: &Coin.NFT
    
        init(_price: UFix64, _nftRef: &Coin.NFT) {
            self.price = _price
            self.nftRef = _nftRef
        }
    }

    pub resource interface SaleCollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun getPrice(id: UInt64) : UFix64
        pub fun purchase(id:UInt64, recipientCollection: &Coin.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault)
    }

    pub resource SaleCollection: SaleCollectionPublic {
    
        pub var forSale: {UInt64: UFix64}
        pub let myCoinCollection: Capability<&Coin.Collection>
        pub let FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

        pub fun listForSale(id: UInt64, price: UFix64){
            pre {
                price >= 0.0: "Not possible to list for less than 0"
                self.myCoinCollection.borrow()!.getIDs().contains(id) : "This SaleCollection owner does not have this NFT"
            }

            self.forSale[id] = price
        }

        pub fun unlistFromSale(id: UInt64) {
            self.forSale.remove(key:id)
        }

                // possible issue with the reference to CF collection
        pub fun purchase(id:UInt64, recipientCollection: &Coin.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault){
            pre {
                payment.balance == self.forSale[id]: "The payment is not equal to price of NFT"
            }
        
            recipientCollection.deposit(token: <- self.myCoinCollection.borrow()!.withdraw(withdrawID: id))
            self.FlowTokenVault.borrow()!.deposit(from: <- payment)
            self.unlistFromSale(id: id)
        }

        pub fun getPrice(id: UInt64):UFix64 {
            return self.forSale[id]!
        }

        pub fun getIDs(): [UInt64] {
            return self.forSale.keys
        }

        init(_CoinFlipCollection:Capability<&Coin.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {
            self.forSale = {}
            self.myCoinCollection = _CoinFlipCollection
            self.FlowTokenVault = _FlowTokenVault
        }
    }

    pub fun createSaleCollection(CoinFlipCollection:Capability<&Coin.Collection>, FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection {
        return <- create SaleCollection(_CoinFlipCollection : CoinFlipCollection, _FlowTokenVault : FlowTokenVault)
    }

    init() {

    }
}
 