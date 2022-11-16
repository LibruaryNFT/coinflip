import '../App.css';

import * as fcl from "@onflow/fcl";
import {getTotalSupply} from "../cadence/scripts/get_total_supply.js";
import {getUserTotal} from "../cadence/scripts/get_collection_length.js";
import {getBalance} from "../cadence/scripts/get_balance.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const[user, setUser] = useState();
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
  }

  const getTheUserTotal = async () => {
    const result = await fcl.send([
      fcl.script(getUserTotal),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);

  }

  const getTheBalance = async () => {
    const result = await fcl.send([
      fcl.script(getBalance),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);

    setBalance(result)
  }


  const logIn = async () => {
    await fcl.authenticate();
    loginStatus();
 }

// Hardcoded admin for SaleCollection
  return (

      <div className="User">
        <button onClick={() => logIn()}>Connect Wallet</button><br></br>
        <button onClick={() => fcl.unauthenticate()}>Disconnect Wallet</button><br></br>
        <h2>Your Account Information</h2>
        <h3>TestNet Account Address: {user && user.addr ? user.addr : ''}</h3>
        <h3>Your FLOW Balance: {balance}</h3>
      </div>
    
  );

}

export default App;
