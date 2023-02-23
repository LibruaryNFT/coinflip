export const getTotalSupply = `
import Coin from 0xf8568211504c7dcf

pub fun main(): UInt64 {    
    return Coin.totalSupply
}
`