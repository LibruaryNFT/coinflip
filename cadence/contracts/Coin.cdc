import NonFungibleToken from "./NonFungibleToken.cdc"
import FungibleToken from "./FungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

pub contract Coin: NonFungibleToken {

// -------------------------------------------------------------------
// Coin contract Events
// -------------------------------------------------------------------    
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, kind: UInt8, rarity: UInt8)
    pub event CoinDestroyed(id: UInt64)
    pub event CoinFlipGame(CoinID id: UInt64, CoinGuess kind: UInt8, RandomNumberGenerated randomNum: UInt64, ConvertedRandom coinFlip: UInt64, Result0Win1Lose coinresult: UInt64)

// ------------------------------------------------------------------
// Named Paths
// ------------------------------------------------------------------
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let CollectionPrivatePath: PrivatePath
    pub let MinterStoragePath: StoragePath
    pub let CoinFlipperStoragePath: StoragePath

// ------------------------------------------------------------------
// Coin contract-level fields
// ------------------------------------------------------------------

    // The total number of Coins that have been minted
    pub var totalSupply: UInt64

    pub enum Rarity: UInt8 {
        pub case bronze
        pub case silver
        pub case gold
    }

    pub enum Kind: UInt8 {
        pub case heads
        pub case tails
    }

    // Mapping from item (kind, rarity) -> IPFS image CID
    access(self) var images: {Kind: {Rarity: String}}

    // Mapping from rarity -> price
    pub var itemRarityPriceMap: {Rarity: UFix64}

// -------------------------------------------------------------------------
// Coin contract-level function definitions
// -------------------------------------------------------------------------

    pub fun kindToString(_ kind: Kind): String {
        switch kind {
            case Kind.heads:
                return "Heads"
            case Kind.tails:
                return "Tails"
        }

        return ""
    }

      pub fun rarityToString(_ rarity: Rarity): String {
        switch rarity {
            case Rarity.bronze:
                return "Copper"
            case Rarity.silver:
                return "Silver"
            case Rarity.gold:
                return "Gold"
        }

        return ""
    }

       // createEmptyCollection
    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // Return the initial sale price for an item of this rarity.
    pub fun getItemPrice(rarity: Rarity): UFix64 {
        return self.itemRarityPriceMap[rarity]!
    }

    // fetch
    // Get a reference to a Coin from an account's Collection, if available.
    // If an account does not have a Coin.Collection, panic.
    // If it has a collection but does not contain the itemID, return nil.
    // If it has a collection and that collection contains the itemID, return a reference to that.
    //
    pub fun fetch(_ from: Address, itemID: UInt64): &Coin.NFT? {
        let collection = getAccount(from)
            .getCapability(Coin.CollectionPublicPath)!
            .borrow<&Coin.Collection{Coin.CollectionPublic}>()
            ?? panic("Couldn't get collection")
        // We trust Coin.Collection.borrowEntireNFT to get the correct itemID
        // (it checks it before returning it).
        return collection.borrowEntireNFT(id: itemID)
    }
    
// --------------------------------------------------------------------
// Coin as an NFT
// --------------------------------------------------------------------
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {

        // Token ID 
        pub let id: UInt64

        // Token Kind (Heads 0 or Tails 1)
        pub let kind: Kind

        // Token Rarity (Bronze, Silver, Gold)
        pub let rarity: Rarity 

       pub var sentBy : Address
        
        init(id: UInt64, kind: Kind, rarity: Rarity) {
            self.id = id
            self.kind = kind
            self.rarity = rarity
            self.sentBy = 0x0
        }

         // Gets the imageCID from the initialization. For example, for a bronze heads: "bafybeibuqzhuoj6ychlckjn6cgfb5zfurggs2x7pvvzjtdcmvizu2fg6ga",
        pub fun imageCID(): String {
            return Coin.images[self.kind]![self.rarity]!
        }

        // takes the above imageCID concatenates it with the hard-coded path sm.png. For example: "bafybeibuqzhuoj6ychlckjn6cgfb5zfurggs2x7pvvzjtdcmvizu2fg6ga/sm.png"
        // this is stored as a IPFSFile and is used with a function, dwebURL, to add the https:// and the ipfs.dweb.link portion
        // the dwebURL function requires a IPFSFile 
        pub fun thumbnail(): MetadataViews.IPFSFile {
          return MetadataViews.IPFSFile(cid: self.imageCID(), path: "sm.png")
        }

        pub fun dwebURL(_ file: MetadataViews.IPFSFile): String {
            var url = "https://"
            .concat(file.cid)
            .concat(".ipfs.dweb.link/")
    
            if let path = file.path {
                return url.concat(path)
            }
    
            return url
        }

        // Creates name by adding Rarity + Kind, ie Gold Tails
        pub fun name(): String {
            return Coin.rarityToString(self.rarity)
                .concat(" ")
                .concat(Coin.kindToString(self.kind))
        }

        // Creates description by adding the Rarity, Kind and ID ie "A copper heads with serial number 0"
        pub fun description(): String {
            return "A "
                .concat(Coin.rarityToString(self.rarity).toLower())
                .concat(" ")
                .concat(Coin.kindToString(self.kind).toLower())
                .concat(" with serial number ")
                .concat(self.id.toString())
        }

        // set sentBy to the user's receiver capability
        access(contract) fun setSentBy(_ playeraddress:Address) {
			self.sentBy=playeraddress
		}


        pub fun getSentBy() : Address {
            if self.sentBy== nil {
				panic("Never sent")
			}
			return self.sentBy!
        }
        
        // Get the default view from the Metadata views contract
        // This shows the views that are supported. 
        // Display requires name, description, thumbnail

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>()
            ]
        }

        // if the type is metadata views
        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name(),
                        description: self.description(),
                        thumbnail: self.thumbnail()
                    )
            }

            return nil
        }
    }

 
// -------------------------------------------------------------------
// CollectionPublic
// -------------------------------------------------------------------

    // This is the interface that users can cast their CoinCollection as
    // to allow others to deposit Coins into their Collection. It also allows for reading
    // the details of Coins in the Collection.
    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} 
        pub fun borrowEntireNFT(id: UInt64): &Coin.NFT? {

            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Coin reference: The ID of the returned reference is incorrect."
            }
        }
    }

// -------------------------------------------------------------------
// Collection
// -------------------------------------------------------------------
    // Collection is a resource that every user who owns NFTs 
    // will store in their account to manage their NFTS
    //
    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        //
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // withdraw
        // Removes an NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Coin does not exist in the collection.")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }


        // deposit
        // Takes an NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        //
       pub fun deposit(token: @NonFungibleToken.NFT) {

            // Cast the deposited token as an NFT to make sure
            // it is the correct type
            let myToken <- token as! @Coin.NFT

            // Event emitted for Deposit with ID and recipient address
            emit Deposit(id: myToken.id, to: self.owner?.address)

            // Add the new token to the dictionary
            self.ownedNFTs[myToken.id] <-! myToken
        }

        // User sets the sendBy field on the NFT to their address and then sends it to the admin
        pub fun play(withdrawID:UInt64, receiverCap:Address ) {
                   
            // Withdraw Coin from signers collection
            let token <- self.withdraw(withdrawID: withdrawID) as! @Coin.NFT
          
            token.setSentBy(receiverCap)

            // Save the ID before it is moved to the new dictionary
            let coinid = token.id
            log("coinid")
            log(coinid)

            // get the Admin's &Coin.Collection
            let recipient = getAccount(0xf8d6e0586b0a20c7)
            let depositRef = recipient.getCapability(Coin.CollectionPublicPath).borrow<&Coin.Collection{Coin.CollectionPublic}>()!

            depositRef.deposit(token: <- token)
            

        }

        // getIDs returns an array of the IDs that are in the Collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }
        

        // borrowNFT Returns a borrowed reference to a Coin in the Collection
        // so that the caller can read its ID
        //
        // Parameters: id: The ID of the NFT to get the reference for
        //
        // Returns: A reference to the NFT
        //
        // Note: This only allows the caller to read the ID of the NFT,
        // not any Coin specific data. Please use borrowEntireNFT to 
        // read Coin data.
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        // borrowEntireNFT(&Coin)
        // Gets a reference to an NFT in the collection as a Coin,
        // exposing all of its fields (including the typeID & rarityID).
        // This is safe as there are no functions that can be called on the Coin.
        pub fun borrowEntireNFT(id: UInt64): &Coin.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &Coin.NFT
            } else {
                return nil
            }
        }

        // Making the collection conform to MetadataViews.Resolver
        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let coinItem = nft as! &Coin.NFT
            return coinItem as &AnyResource{MetadataViews.Resolver}
        }

        // If a transaction destroys the Collection object,
        // All the NFTs contained within are also destroyed
        destroy() {
            destroy self.ownedNFTs
        }

        // initializer
        //
        init () {
            self.ownedNFTs <- {}
        }
    }

 
// -------------------------------------------------------------------
// NFT Minter
// -------------------------------------------------------------------
    
    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT
        // Mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference

        pub fun mintNFT(
            recipient: &Coin.Collection{Coin.CollectionPublic}, 
            kind: Kind, 
            rarity: Rarity,
            ) {
            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-create Coin.NFT(id: Coin.totalSupply, kind: kind, rarity: rarity))

            emit Minted(
                id: Coin.totalSupply,
                kind: kind.rawValue,
                rarity: rarity.rawValue,
            )

            Coin.totalSupply = Coin.totalSupply + (1 as UInt64)
        }

    }

// -----------------------------------------------------------------
// CoinFlipper
// -----------------------------------------------------------------

// Resource that is created during the initialization of this contract for the admin
// This is used to flip coins and send out rewards

    pub resource CoinFlipper {

        pub fun randomNum(): UInt64{
            let unsafeRand : UInt64 = unsafeRandom()
            log("unsafeRand")
            log(unsafeRand)
            return unsafeRand
        }

        // program to check if the number is even or odd
        pub fun coinFlip(unsafeRand: UInt64): UInt64 {

            var coinFlip : UInt64 = 0

            // check if coinflip is even(aka heads)
            if (unsafeRand % 2 == 0) {
                coinFlip = 0
                log("unsafeRand converted to Heads(Even)")
            }

            // check if coinflip is odd(aka tails)
            else {
                coinFlip = 1
                log("unsafeRand converted to Tails(Odd)")
            }

            return coinFlip           
        }

        pub fun getKind(itemID:UInt64) : UInt8{

        // 0xf8d6e0586b0a20c7
        // 0xf14637e23022698a

            let address : Address = 0xf8d6e0586b0a20c7
            let nftRef : &Coin.NFT = Coin.fetch(address, itemID: itemID)!
            // kind 0 = heads, 1 = tails
            log("Kind")
            log(nftRef.kind.rawValue) 
            if (nftRef.kind.rawValue == 0) {
                log("Coin Bet Kind: Heads")
            }

            else {
                log("Coin Bet Kind: Tails")
            }
            return nftRef.kind.rawValue
        }

        pub fun determineResult(nftkind:UInt8, coinFlip:UInt64) : UInt64{       

            var coinresult : UInt64 = 2
            var coinFlipstr = coinFlip.toString()
            var nftkindstr = nftkind.toString()        

            // check if the unsafeRand is equal to the NFT Kind
            // if it is equal, they are a winner
            if coinFlipstr == nftkindstr {
                coinresult = 0
                log("WINNER! You guessed the correct outcome of the coin flip!")
                log(coinresult)
                } else {

            // if it is not equal, they are a loser
                coinresult = 1
                log("LOSER! You incorrectly guessed the outcome of the coin flip.")
                log(coinresult)
            }  

            return coinresult
        }


        // recipient/receiver is the destination for winnings
        // address and coinID relate to the coin being flipped
        // receiver: &AnyResource{NonFungibleToken.CollectionPublic},

        pub fun flipCoin(
            coinID: UInt64
            ) : UInt64 {

            // admin must own the NFT
            // 0xf8d6e0586b0a20c7
            // 0xf14637e23022698a
            let address : Address = 0xf8d6e0586b0a20c7

            // generate unsafeRandom number
            var randomNum : UInt64 = self.randomNum()

            // convert unsafeRand to a 0 or 1 , 0 if it is odd , 1 if it is even 
            var coinFlip : UInt64 = self.coinFlip(unsafeRand: randomNum)
            
             // get the kind of the NFT with a given ID
            var nftkind : UInt8 = self.getKind(itemID: coinID)

            // final result of this function is a boolean whether the guess was correct or not
            var coinresult : UInt64 = self.determineResult(nftkind: nftkind, coinFlip: coinFlip)

            emit CoinFlipGame(
                CoinID: coinID,
                CoinGuess: nftkind,
                RandomNumberGenerated: randomNum,
                ConvertedRandom: coinFlip,
                Result0Win1Lose: coinresult,
            )

            return coinresult
        }
    }

    // initializer
    init() {
        // set rarity price mapping
        self.itemRarityPriceMap = {
            Rarity.gold: 125.0,
            Rarity.silver: 5.0,
            Rarity.bronze: 1.0
        }

        // set imageCID
        self.images = {
            Kind.heads: {
                Rarity.bronze: "bafybeibuqzhuoj6ychlckjn6cgfb5zfurggs2x7pvvzjtdcmvizu2fg6ga",
                Rarity.silver: "bafybeihbminj62owneu3fjhtqm7ghs7q2rastna6srqtysqmjcsicmn7oa",
                Rarity.gold: "bafybeid73gt3qduwn2hhyy4wzhsvt6ahzmutiwosfd3f6t5el6yjqqxd3u"
            },
            Kind.tails: {
                Rarity.bronze: "bafybeigu4ihzm7ujgpjfn24zut6ldrn7buzwqem27ncqupdovm3uv4h4oy",
                Rarity.silver: "bafybeih6eaczohx3ibv22bh2fsdalc46qaqty6qapums6zhelxet2gfc24",
                Rarity.gold: "bafybeid2r5q3vfrsluv7iaelqobkihfopw5t4sv4z2llxsoe3xqfynl73u"
            }
        }

        // Set our named paths
        self.CollectionStoragePath = /storage/CoinCollection
        self.CollectionPublicPath = /public/CoinCollection
        self.CollectionPrivatePath = /private/CoinCollection
        self.MinterStoragePath = /storage/CoinMinter
        self.CoinFlipperStoragePath = /storage/CoinFlipper

        // Initialize the total supply
        self.totalSupply = 0


        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // Create a public capability for the collection
        self.account.link<&Coin.Collection{NonFungibleToken.CollectionPublic, Coin.CollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        self.account.link<&Coin.Collection>(
            self.CollectionPrivatePath, 
            target: self.CollectionStoragePath
        )
        
        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        // Create a CoinFlipper resource and save it to storage
        let flipper <- create CoinFlipper()
        self.account.save(<-flipper, to: self.CoinFlipperStoragePath)


        emit ContractInitialized()
    }
}
 