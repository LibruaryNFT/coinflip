import '../App.css';
import '../dist/output.css';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {getNFTDetails} from "../cadence/scripts/get_nft_details.js";
import {getUserTotal} from "../cadence/scripts/get_collection_length.js";

import {useEffect, useState} from 'react';
import {playGame} from "../cadence/transactions/play_game.js";

function CoinCollection(props) {
  const [nfts, setNFTs] = useState([]);
  const[usersupply, setUserSupply] = useState('');

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

      console.log(result);
      setNFTs(result);
  }
  const getTheUserTotal = async () => {
    const result = await fcl.send([
      fcl.script(getUserTotal),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);
    setUserSupply(result)
  }

  const play = async (id) => {
    const transactionId = await fcl.send([
        fcl.transaction(playGame),
        fcl.args([
          fcl.arg(parseInt(id), t.UInt64),
          fcl.arg(0x9582fcd59741438c, t.Address)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
  
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
  }


 
  return (

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

  );

  
}

export default CoinCollection;
 