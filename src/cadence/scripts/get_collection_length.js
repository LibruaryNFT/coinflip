export const getUserTotal = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0x9582fcd59741438c

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account
        .getCapability(Coin.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection. Collection length error.")
    
    return collectionRef.getIDs().length
}

`