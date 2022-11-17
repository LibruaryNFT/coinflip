export const getTotalSupply = `
import Coin from 0x9582fcd59741438c

pub fun main(): UInt64 {    
    return Coin.totalSupply
}
`