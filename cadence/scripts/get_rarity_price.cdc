import Coin from "../contracts/Coin.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"

// doesnt work

pub fun main(rarity: Coin.Rarity): UFix64 {
    return Coin.itemRarityPriceMap[rarity]!
    }

   // pub fun main(rarity: Coin.Rarity): UFix64 {
   // let x = Coin.getItemPrice(rarity:rarity)
   // return x
   // }

   // worked for the mapping

   //
   //pub fun main(): {Coin.Rarity:UFix64} {
   // let x:{Coin.Rarity:UFix64} = Coin.itemRarityPriceMap
    //return x
//
   // }




  