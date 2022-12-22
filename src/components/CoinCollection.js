import '../App.css';
import '../dist/output.css';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { HubConnectionBuilder } from '@microsoft/signalr';

import {getNFTDetails} from "../cadence/scripts/get_nft_details.js";
import {getUserTotal} from "../cadence/scripts/get_collection_length.js";

import {useEffect, useState, useRef} from 'react';
import GraffleSDK from '@graffle/flow-livestream-sdk';
import {playGame} from "../cadence/transactions/play_game.js";
import axios from "axios";

import Transaction from "./Transaction.js";

function CoinCollection(props) {
  const[nfts, setNFTs] = useState([]);
  const[usersupply, setUserSupply] = useState('');
  const[txId, setTxId] = useState();
  const[txInProgress, setTxInProgress] = useState(false);
  const[txStatus, setTxStatus] = useState(-1);

  // graffle
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);
  const [eventsData, setEventsData] = useState([]);


  useEffect(() => {
      
      getTheNFTDetails();
      getTheUserTotal();

  }, [props.address]);

  const clientConfig = {
    projectId: '041706f7-3ded-4e39-9697-87544103a856',
    apiKey: 'dd6325db33b24f21bb99ae520485cd41'
  };

  // or `const streamSDK = new GraffleSDK(clientConfig);` for main net
  const streamSDK = new GraffleSDK(clientConfig, true);

  latestChat.current = chat;

  const foo = (message) => {
    console.log(message);
    const updatedChat = [...latestChat.current];
    updatedChat.push(message);

    setChat(updatedChat);
  };

  console.log(chat);

  useEffect(() => {
    streamSDK.stream(foo);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      streamSDK.disconnect();
      streamSDK.stream(foo);
    }
      , 10000);
  }, []);

  useEffect(() => {
    const getEvents = async () => {
        // console.log("getSales fired")
        let data
        let res = await axios
            .get("https://prod-test-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.91b3acc974ec2f7d.Coin.CoinFlipGame")
        data = res.data
        setEventsData(data)
    }
    getEvents()
  }, [])

  console.log('eventsData', eventsData);


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
          fcl.arg("0x91b3acc974ec2f7d", t.Address)
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
          <div className="flex flex-col text-white font-bold  bg-red-400">
            <h1 className="text-4xl text-center">CoinFlip Results</h1>

            <h2 className="text-2xl">Recent CoinFlips</h2>

            <table className="table-auto text-left border">
                <tbody>
                  <tr className="border">
                    <th className="border">Date</th>
                    <th className="border">Player</th>
                    <th className="border">TokenID</th>
                    <th className="border">Prediction</th>
                    <th className="border">CoinFlip</th>
                    <th className="border">Result</th>              
                  </tr>

                  {eventsData.map((item, id) => (
                    <tr key={id} className="border">
                      <td className="border hover:bg-sky-700"><a href={`https://testnet.flowscan.org/transaction/${item.flowTransactionId}`} target="_blank">{item.eventDate.slice(0, 19)}</a></td>
                      <td className="border">{item.blockEventData.player}</td>
                      <td className="border">{item.blockEventData.id}</td>
                      <td className="border">{item.blockEventData.kind == 0 ? 'Heads' : 'Tails'}</td>
                      <td className="border">{item.blockEventData.coinFlip == 0 ? 'Heads' : 'Tails'}</td>
                      <td className="border">{item.blockEventData.coinresult == 0 ? 'Winner' : 'Loser'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <h2 className="text-2xl">Your Live CoinFlip Results</h2>
              <h2 className="flex flex-col text-white font-bold  bg-red-400">Step 1: Sending Coin to be Flipped Transaction Details</h2>
                <div className="flex flex-col text-white font-bold bg-red-400"><Transaction txId={txId} txInProgress={txInProgress} txStatus={txStatus}/></div>

              <table className="text-left table-fixed border-collapse">
                <tbody>
                  <tr className="border">
                    <th className="border">Date</th>
                    <th className="border">Status</th>
                    <th className="border">Player</th>
                    <th className="border">TokenID</th>
                    <th className="border">Prediction</th>
                    <th className="border">CoinFlip</th>
                    <th className="border">Result</th>              
                  </tr>

                  {chat.map((item, id) => (
                    <tr key={id} className="border">
                      <td className="border hover:bg-sky-700"><a href={`https://testnet.flowscan.org/transaction/${item.flowTransactionId}`} target="_blank">{item.eventDate.slice(0, 19)}</a></td>
                      <td className="border">{item.blockEventData.player == null ? 'Coin sent.' : 'Coin Flipped!'}</td>
                      <td className="border">{item.blockEventData.player == null ? 'Pending' : item.blockEventData.player}</td>
                      <td className="border">{item.blockEventData.id}</td>
                      <td className="border">{item.blockEventData.kind == null ? 'Pending' : (item.blockEventData.kind == 0 ? 'Heads' : 'Tails')}</td>
                      <td className="border">{item.blockEventData.coinFlip == null ? 'Pending' : (item.blockEventData.coinFlip == 0 ? 'Heads' : 'Tails')}</td>
                      <td className="border">{item.blockEventData.coinresult == null ? 'Pending' : (item.blockEventData.coinresult == 0 ? 'Winner' : 'Loser')}</td>                       
                    </tr>
                  ))}
                </tbody>
              </table>
              
          </div>
          
          
          

          <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h1 className="text-white text-4xl">Your Coin Collection</h1>
          </div>
          <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h2 className="text-white">Your total number of coins: {usersupply}</h2>
            
            <table className="text-left table-fixed border-collapse text-white">
                <tbody>
                  <tr className="border">
                    <th className="border">Coin Details</th>
                    <th className="border">TokenID</th>
                    <th className="border">Prediction Type</th>             
                  </tr>

                  {nfts.map(nft => (
                    <tr key={nft.id} className="border">
                      <img className="border cursor-pointer" src={`https://${nft.ipfsHash}.ipfs.dweb.link/`} onClick={() => play(nft.id)}/>                 
                      <td className="border">{nft.id}</td>
                      <td className="border">{nft.kind.rawValue == 0 ? 'Heads' : 'Tails'}</td>
                 
              
                    </tr>
                  ))}
                </tbody>
              </table>


          </div>
          
        </div>
);

  
}

export default CoinCollection;
 