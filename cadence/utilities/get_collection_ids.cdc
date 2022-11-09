import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import Coin from "../contracts/Coin.cdc"

/// Script to get NFT IDs in an account's collection
///
// https://github.com/onflow/flow-nft/blob/master/scripts/get_collection_ids.cdc

pub fun main(address: Address, collectionPublicPath: PublicPath): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account
        .getCapability(collectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection at specified path")

    return collectionRef.getIDs()
}