export const getTotalSupply = `
import Coin from 0xf14637e23022698a

pub fun main(): UInt64 {    
    return Coin.totalSupply
}
`