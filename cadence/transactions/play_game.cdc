import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import Coin from "./../contracts/Coin.cdc"

// This transaction transfers a CoinFlip Item from one account to another.
// https://github.com/onflow/kitty-items/blob/master/cadence/transactions/kittyItems/transfer_kitty_item.cdc

transaction(recipient: Address, withdrawID: UInt64) {

    let receiver : {UInt64 : Capability<&{NonFungibleToken.Receiver}>}
    let receiver2 : Address

    prepare(signer: AuthAccount) {
        //let receiver: Capability<&Coin.Collection{NonFungibleToken.Receiver}>
        //let receiver = signer.getCapability(Coin.CollectionPublicPath)

        self.receiver = {}

        let cap = signer.getCapability<&{NonFungibleToken.Receiver}>(Coin.CollectionPublicPath)
        self.receiver[withdrawID] = cap

         self.receiver2 = 0x0


        
        // borrow a reference to the signer's NFT collection
        let coins = signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        
        coins.play(recipient:recipient, withdrawID:withdrawID, receiverCap:self.receiver, receiverCap2:self.receiver2)
             
    }
 
    execute {

    }
}
 