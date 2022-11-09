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

transaction(recipient: Address, coinID: UInt64) {

    // local variable for storing the CoinFlipper reference
    let flipper: &Coin.CoinFlipper

    let provider: &{FungibleToken.Provider}  

    prepare(signer: AuthAccount) {

        // borrow a reference to the CoinFlipper resource in storage
        self.flipper = signer.borrow<&Coin.CoinFlipper>(from: /storage/CoinFlipper)
            ?? panic("Could not borrow a reference to the CoinFlipper.")
        
        // borrow a reference to the flowTokenVault of the signer
        self.provider = signer.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault) 
            ?? panic("Could not borrow vault.")

    }

    execute {
        // get the public account object for the recipient
        let recipient = getAccount(recipient)

        // borrow the recipient's public NFT collection reference
        //let receiver = recipient
         //   .getCapability(Coin.CollectionPublicPath)
         //   .borrow<&{NonFungibleToken.CollectionPublic}>()
          //  ?? panic("Could not get receiver reference to the NFT Collection")

        
        var coinresult = self.flipper.flipCoin(coinID: coinID)

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
        

    }
}
