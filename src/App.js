import './App.css';


import CoinCollection from "./components/CoinCollection.js";
import SaleCollection from "./components/SaleCollection.js";
import AdminStore from "./components/AdminStore.js"
import Header from "./components/Header.js"
import UserAccount from "./components/UserAccount.js"
import * as fcl from "@onflow/fcl";
import {getTotalSupply} from "./cadence/scripts/get_total_supply.js";
import {getUserTotal} from "./cadence/scripts/get_collection_length.js";
import {getBalance} from "./cadence/scripts/get_balance.js";
import {setup} from  "./cadence/transactions/setup.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const[user, setUser] = useState();
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


  return (
    
    <div className="App">
      <Header/>
      <div className="total">
        <h3>Total supply of Coins: {supply}</h3>
      </div>

      <UserAccount/>

      <div className="setUp">
        <button onClick={() => setupTheAccount()}>Setup the account. This is only done once per account.</button>
      </div>
      
      <div className="collection">    
        { user && user.addr 
          ?
        <CoinCollection address={user.addr}></CoinCollection>
        :
        null
        }

      </div>

      <SaleCollection address="0x0af01d98f61b53df"></SaleCollection>
      <AdminStore/>
   
    </div>
    
  );

}

export default App;
