import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"
import Coin from "../contracts/Coin.cdc"

pub struct CoinItem {
    pub let itemID: UInt64
    pub let resourceID: UInt64
    pub let kind: Coin.Kind
    pub let rarity: Coin.Rarity

    init(
        itemID: UInt64,
        resourceID: UInt64,
        kind: Coin.Kind,
        rarity: Coin.Rarity,
        ) {
        
        self.itemID = itemID
        self.resourceID = resourceID
        self.kind = kind
        self.rarity = rarity
        
    }
}

pub fun main(address: Address, itemID: UInt64): CoinItem? {
    if let collection = getAccount(address).getCapability<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic}>(Coin.CollectionPublicPath).borrow() {
        
        if let item = collection.borrowEntireNFT(id: itemID) {

            if let view = item.resolveView(Type<MetadataViews.Display>()) {

                let display = view as! MetadataViews.Display
                
                let owner: Address = item.owner!.address!  

                return CoinItem(
                    itemID: itemID,
                    resourceID: item.uuid,
                    kind: item.kind, 
                    rarity: item.rarity, 
                )
            }
        }
    }

    return nil
}
 