import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import FungibleToken from "./../contracts/FungibleToken.cdc"
import FlowToken from "./../contracts/FlowToken.cdc"
import Coin from "./../contracts/Coin.cdc"

// This transction uses the CoinFlipper resource to flip a coin.
//
// It must be run with the account that has the CoinFlipper resource
// stored at path /storage/CoinFlipper.

// recipient is the destination for winnings
// address and coinID relate to the coin being flipped

transaction(coinID: UInt64) {

    // local variable for storing the CoinFlipper reference
    let flipper: &Coin.CoinFlipper

    let provider: &{FungibleToken.Provider}  

    prepare(signer: AuthAccount) {

        // borrow a reference to the CoinFlipper resource in storage
        self.flipper = signer.borrow<&Coin.CoinFlipper>(from: /storage/CoinFlipper)
            ?? panic("Could not borrow a reference to the CoinFlipper. flip_coin error.")
        
        // borrow a reference to the flowTokenVault of the signer
        self.provider = signer.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault) 
            ?? panic("Could not borrow vault. flip_coin error.")

        // Hardcoded
        //let adminaddress:Address= 0x9582fcd59741438c
        let adminaddress:Address= 0xf8d6e0586b0a20c7

        let collection = getAccount(adminaddress).getCapability(/public/CoinCollection)
                    .borrow<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic}>()
                    ?? panic("Can't get the User's collection. flip_coin error.")

             // borrow a reference to the signer's NFT collection
       // let collection = signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath)
       //     ?? panic("Could not borrow a reference to the owner's collection. Flip Coin error.")          

        let itemID = coinID

        let coin = collection.borrowEntireNFT(id: itemID)

        let sentBy : Address = coin!.sentBy

        // get the public account object for the recipient
        //let recipient = getAccount(recipient)
        let recipient = getAccount(sentBy)

        // borrow the recipient's public NFT collection reference
        //let receiver = recipient
         //   .getCapability(Coin.CollectionPublicPath)
         //   .borrow<&{NonFungibleToken.CollectionPublic}>()
          //  ?? panic("Could not get receiver reference to the NFT Collection")

        
        var coinresult = self.flipper.flipCoin(coinID: coinID, address: adminaddress)

        log("CoinResult")
        log(coinresult)

        // Payout

        if coinresult == 0 {
            let amount : UFix64 = 1.0
            let tokens <- self.provider.withdraw(amount: amount)
            recipient.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver).borrow()!.deposit(from: <-tokens)
            log("WINNER! Payout of $FLOW sent!")

        } else {
            log("LOSER! No payout.")
        }

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath)
          ?? panic("Could not borrow a reference to the owner's collection")
            
         //withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: coinID)
        destroy nft

    }

    execute {
    }

}
