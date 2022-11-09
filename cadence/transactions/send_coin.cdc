import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import Coin from "./../contracts/Coin.cdc"

// This transaction transfers a CoinFlip Item from one account to another.
// https://github.com/onflow/kitty-items/blob/master/cadence/transactions/kittyItems/transfer_kitty_item.cdc

transaction(recipient: Address, withdrawID: UInt64) {

    prepare(signer: AuthAccount) {
        
        // get the recipients public account object
        let recipient = getAccount(recipient)

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        //let depositRef = recipient.getCapability(Coin.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()!
        let depositRef = recipient.getCapability(Coin.CollectionPublicPath).borrow<&Coin.Collection{Coin.CollectionPublic}>()!

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)
        
        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)

    }
 
    execute {

    }
}