import '../App.css';
import '../dist/output.css';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {getNFTDetails} from "../cadence/scripts/get_nft_details.js";
import {getUserTotal} from "../cadence/scripts/get_collection_length.js";

import {useEffect, useState} from 'react';
import {playGame} from "../cadence/transactions/play_game.js";

import Transaction from "./Transaction.js";

function CoinCollection(props) {
  const[nfts, setNFTs] = useState([]);
  const[usersupply, setUserSupply] = useState('');
  const[txId, setTxId] = useState();
  const[txInProgress, setTxInProgress] = useState(false);
  const[txStatus, setTxStatus] = useState(-1);


  useEffect(() => {
      
      getTheNFTDetails();
      getTheUserTotal();

  }, [props.address]);


  const getTheNFTDetails = async () => {
      const result = await fcl.send([
          fcl.script(getNFTDetails),
          fcl.args([
              fcl.arg(props.address, t.Address)
          ])
      ]).then(fcl.decode);
      
      setNFTs(result);
      console.log("getTheNFTDetails", result);
  }
  const getTheUserTotal = async () => {
    const result = await fcl.send([
      fcl.script(getUserTotal),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);
    setUserSupply(result)
    console.log("getTheUserTotal", result);
  }

  const play = async (id) => {
    setTxInProgress(true);
    setTxStatus(-1);
    const transactionId = await fcl.send([
        fcl.transaction(playGame),
        fcl.args([
          fcl.arg(parseInt(id), t.UInt64),
          fcl.arg("0x9582fcd59741438c", t.Address)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
      
      setTxId(transactionId);
      fcl.tx(transactionId).subscribe(res => {

        setTxStatus(res.status);

        console.log(res);
      })

  }



 
  return (
        
        <div>
          <div className="flex flex-col text-center font-bold  bg-red-400">
              <h1 className="text-white text-4xl">CoinFlip Gaming Area</h1>
          </div>
          <div className="flex flex-col text-center font-bold  bg-red-400">
            <h1 className="text-white">This area will show your game on-chain and in real-time.</h1>
          </div>
          <Transaction txId={txId} txInProgress={txInProgress} txStatus={txStatus}/>

          <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h1 className="text-white text-4xl">Your Coin Collection</h1>
          </div>
          <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h1 className="text-white">This is your collection of Coins.</h1>
          </div>
          <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h3 className="text-white">Your number of coins: {usersupply}</h3>
            {nfts.map(nft => (
              <div key={nft.id}>
                <h3>ID: {nft.id}</h3>
                <h3>Kind: {nft.kind.rawValue}</h3>
                <h3>Rarity: {nft.rarity.rawValue}</h3>
                <button onClick={() => play(nft.id)}>Flip this Coin!</button>

              </div>
            ))}
          </div>
          
        </div>
);

  
}

export default CoinCollection;
 