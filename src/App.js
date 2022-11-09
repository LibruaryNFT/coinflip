import './App.css';

import CoinCollection from "./CoinCollection.js";
import SaleCollection from "./SaleCollection.js";


import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

import {getTotalSupply} from "./cadence/scripts/get_total_supply.js";
import {getUserTotal} from "./cadence/scripts/get_collection_length.js";
import {getBalance} from "./cadence/scripts/get_balance.js";

import {setup} from  "./cadence/transactions/setup.js";

import {listNFT} from  "./cadence/transactions/list_for_sale.js";
import {unlistFromSaleTx} from  "./cadence/transactions/unlist_from_sale.js";
import {useState, useEffect} from 'react';


fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const[user, setUser] = useState();
  const[saleItemID, setID] = useState();
  const[saleItemPrice, setPrice] = useState();
  const[supply, setSupply] = useState('');
  const[usersupply, setUserSupply] = useState('');
  const[balance, setBalance] = useState('');

  useEffect(() => {

    const onload = async () => {
      loginStatus();
    }
    
    onload();

  }, [])

 const loginStatus = async () => {
    const currentUser = await fcl.currentUser.snapshot();
    console.log("The Current User", currentUser.addr);
    getTheSupply();

    if (currentUser.addr) { // user is logged in
      // sets the `user` variable to the person that is logged in through Blocto
      fcl.currentUser().subscribe(setUser);
      getTheUserTotal();
      getTheBalance(); 
    } 

  }
  

  const getTheSupply = async () => {
    const result = await fcl.send([
      fcl.script(getTotalSupply)
    ]).then(fcl.decode);
    
   // console.log(["getTheSupply", result]);
    setSupply(result);
  }

  const getTheUserTotal = async () => {
    const result = await fcl.send([
      fcl.script(getUserTotal),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);

    setUserSupply(result)
  }

  const getTheBalance = async () => {
    const result = await fcl.send([
      fcl.script(getBalance),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);

    setBalance(result)
  }

  const listForSale = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(listNFT),
      fcl.args([
          fcl.arg(parseInt(saleItemID), t.UInt64),
          fcl.arg(saleItemPrice, t.UFix64),
      ]),
      fcl.payer(fcl.currentUser),
      fcl.proposer(fcl.currentUser),
      fcl.authorizations([fcl.currentUser]),
      fcl.limit(9999)
    ]).then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  }

const unlistFromSale = async () => {
      const transactionId = await fcl.send([
        fcl.transaction(unlistFromSaleTx),
        fcl.args([
          fcl.arg(parseInt(saleItemID), t.UInt64)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
  
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
}

const setupTheAccount = async () => {
  const transactionId = await fcl.send([
    fcl.transaction(setup),
    fcl.payer(fcl.currentUser),
    fcl.proposer(fcl.currentUser),
    fcl.authorizations([fcl.currentUser]),
    fcl.limit(9999)
  ]).then(fcl.decode);

  console.log(transactionId)
}

const logIn = async () => {
    await fcl.authenticate();
    loginStatus();
    
 }

// Hardcoded admin for SaleCollection
return (
    <div className="App">
      <h1>CoinFlip</h1>
      <button onClick={() => logIn()}>Connect wallet to Testnet with Blocto</button><br></br>
      <button onClick={() => fcl.unauthenticate()}>Disconnect Wallet</button><br></br>
      <button onClick={() => setupTheAccount()}>Setup the account. This is only done once per account.</button><br></br>
      
      <h3>Total supply of Coins: {supply}</h3>
      <h2>Your Account Information</h2>
      <h3>TestNet Account Address: {user && user.addr ? user.addr : ''}</h3>
      <h3>Your FLOW Balance: {balance}</h3>
      

      <h1>Your Coin Collection</h1>
      <h3>Your number of coins: {usersupply}</h3>
    
      { user && user.addr 
        ?
        <CoinCollection address={user.addr}></CoinCollection>
        :
        null
      }
      
      <h1>Coins Available for Purchase</h1>

      <SaleCollection address="0x0af01d98f61b53df"></SaleCollection>

      <h1>Admin Storefront Only - List and Unlist your Coins</h1>
      <div>
        <label>ID: </label>
        <input type="text" onChange={(e) => setID(e.target.value)} />
        <label>Price: </label>
        <input type="text" onChange={(e) => setPrice(e.target.value)} />
        <button onClick={() => listForSale()}>List Coin for Sale</button>
        <button onClick={() => unlistFromSale()}>Unlist Coin from Sale</button>
      </div>     

    </div>
    
);

}

export default App;
