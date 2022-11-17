import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import MetadataViews from "./../contracts/MetadataViews.cdc"
import Coin from "./../contracts/Coin.cdc"

/// This transaction is what an account would run
/// to set itself up to receive NFTs
// https://github.com/jacob-tucker/nftdapp-tutorial/blob/main/src/cadence/transactions/setup_user.js
// https://github.com/onflow/flow-nft/blob/master/transactions/setup_account.cdc

transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&Coin.Collection>(from: Coin.CollectionStoragePath) == nil {
            

            // save it to the account
            signer.save(<-Coin.createEmptyCollection(), to: Coin.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Coin.Collection{Coin.CollectionPublic, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(Coin.CollectionPublicPath, target: Coin.CollectionStoragePath)
            signer.link<&Coin.Collection>(Coin.CollectionPrivatePath, target: Coin.CollectionStoragePath)
            log("CoinCollection setup.")

        }
    }
}