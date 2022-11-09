import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import Coin from "../contracts/Coin.cdc"

// https://github.com/onflow/flow-nft/blob/master/scripts/get_collection_length.cdc

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account
        .getCapability(Coin.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}