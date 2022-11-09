import Coin from "../contracts/Coin.cdc"

pub fun main(): UInt64 {    
    return Coin.totalSupply
}