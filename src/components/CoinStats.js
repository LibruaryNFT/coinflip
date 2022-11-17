import '../App.css';

import "../dist/output.css"

import * as fcl from "@onflow/fcl";

import {getTotalSupply} from "../cadence/scripts/get_total_supply.js";

import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function CoinStats() {
  const[supply, setSupply] = useState('');
  
  useEffect(() => {

    const onload = async () => {
      getTheSupply();
    }
    
    onload();

  }, [])
  
  const getTheSupply = async () => {
    const result = await fcl.send([
      fcl.script(getTotalSupply)
    ]).then(fcl.decode);
    setSupply(result);
  }


  return (
    

      <div className="flex flex-col mt-5 font-bold text-center bg-green-400">
        <h3>Total supply of Coins: {supply}</h3>
        <h3>Total supply of Coins Destroyed:</h3>
      </div>
 
    
  );

}

export default CoinStats;
