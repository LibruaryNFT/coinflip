export const getNFTIDs = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0xf14637e23022698a

// This script returns an array of all the NFT IDs in an account's collection.

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Coin.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs()
}

`