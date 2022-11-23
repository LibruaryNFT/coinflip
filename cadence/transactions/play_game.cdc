import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import Coin from "./../contracts/Coin.cdc"

// This transaction transfers a CoinFlip Item from one account to another.
// https://github.com/onflow/kitty-items/blob/master/cadence/transactions/kittyItems/transfer_kitty_item.cdc

transaction(withdrawID: UInt64, admin: Address) {

    prepare(signer: AuthAccount) {
        
        // borrow a reference to the signer's NFT collection
        let coins = signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        
        // Provide the tokenID, the signer's address to attach to the NFT, and the admin address
        coins.play(withdrawID:withdrawID, receiverCap:signer.address, admin: admin)
    }
 
    execute {

    }
}
 