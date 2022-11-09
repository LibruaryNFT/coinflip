import MetadataViews from "../contracts/MetadataViews.cdc"

pub fun main(address:Address,id:UInt64): NFTResult {
    
    let account = getAccount(address)

    let collection = account
        .getCapability(/public/CoinCollection)
        .borrow<&{MetadataViews.ResolverCollection}>()
        ?? panic("Could not borrow a reference to the collection")

    let nft = collection.borrowViewResolver(id: id)

    var data = NFTResult()

    // Get the basic display information for this NFT
    if let view = nft.resolveView(Type<MetadataViews.Display>()) {   
        let display = view as! MetadataViews.Display

        data.name = display.name
        data.description = display.description
        data.thumbnail = dwebURL(display.thumbnail as! MetadataViews.IPFSFile)
        
    }

    // The owner is stored directly on the NFT object
    let owner: Address = nft.owner!.address
   
    data.owner = owner

    let nftType = nft.getType()
    data.type = nftType.identifier

    //let sentBy: Address = nft.getSentBy2()
    //data.sentBy = sentBy

    let itemID = id
    data.itemID = itemID

    let resourceID = nft.uuid
    data.resourceID = resourceID

    let kind = nft.kind
    data.kind = kind

    let rarity = nft.rarity
    data.rarity = rarity


    return data

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

pub struct NFTResult {
    pub(set) var name: String
    pub(set) var description: String
    pub(set) var thumbnail: String
    pub(set) var itemID: UInt64
    pub(set) var resourceID: UInt64
    pub(set) var kind: UInt8
    pub(set) var rarity: UInt8
    pub(set) var owner: Address
    pub(set) var sentBy: Address
    pub(set) var type: String

    init() {
        self.name = ""
        self.description = ""
        self.thumbnail = ""
        self.itemID = 0
        self.resourceID = 0
        self.kind = 0
        self.rarity = 0
        self.owner = 0x0
        self.sentBy = 0x0
        self.type = ""
    }
}