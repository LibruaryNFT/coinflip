export const playGame = `

import NonFungibleToken from 0x631e88ae7f1d7c20
import Coin from 0x9582fcd59741438c

transaction(withdrawID: UInt64) {

    prepare(signer: AuthAccount) {
        
        // borrow a reference to the signer's NFT collection
        let coins = signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        
        // receiverCap = capability , receiverCap2 = address
        coins.play(withdrawID:withdrawID, receiverCap:signer.address)
    }
 
    execute {

    }
}

`