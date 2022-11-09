import Coin from "./../contracts/Coin.cdc"

pub fun main(): UInt64 {    
    log(getCurrentBlock().timestamp)
    log(getCurrentBlock())
    return Coin.totalSupply
}
