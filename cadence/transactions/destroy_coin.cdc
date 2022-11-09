import Coin from "./../contracts/Coin.cdc"

// This transction destroys a coin

transaction(coinID: UInt64) {

    prepare(signer: AuthAccount) {

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
