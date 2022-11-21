import NonFungibleToken from "./../contracts/NonFungibleToken.cdc"
import Coin from "./../contracts/Coin.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, kind: UInt8, rarity: UInt8) {

    // local variable for storing the minter reference
    let minter: &Coin.NFTMinter

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&Coin.NFTMinter>(from: Coin.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT Minter.")
    }

    execute {

        // borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(Coin.CollectionPublicPath)
            .borrow<&Coin.Collection{Coin.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection.")

        let kindValue = Coin.Kind(rawValue: kind) ?? panic("Invalid Kind.")
        let rarityValue = Coin.Rarity(rawValue: rarity) ?? panic("Invalid Rarity.")

        // mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            kind: kindValue,
            rarity: rarityValue,
        )

        let newKind = kind.toString()
        let newRarity = rarity.toString()


        log("NFT Minted")
        log("kindValue= ".concat(newKind))
        log("rarityValue= ".concat(newRarity))

        
    }
}
