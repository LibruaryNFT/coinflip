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
    <div className="flex flex-col px-12 mx-auto mt-14 space-y-6 md:space-y-6 md:flex-row">
        <div className="flex flex-col space-y-12 md:w-1/2">
            <img src="https://flowbook.dev/logo.png" class="h-36 w-36 max-w-md"/>
        </div>
        <div className="flex flex-col space-y-8 md:w-1/2">
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">
                <div class="rounded-l-full bg-brightRedSupLight md:bg-transparent">
                    <div class="flex items-center space-x-2">
                        <div class="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600">
                            <button onClick={() => logIn()}>Connect Wallet</button>
                        </div>      
                        <div class="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600">
                            <button onClick={() => fcl.unauthenticate()}>Disconnect Wallet</button>  
                        </div>
                        <div>
                            <h2 className="font-bold">Your Account Information</h2>
                            <h2 className="font-bold">TestNet Account Address: {user && user.addr ? user.addr : ''}</h2>
                            <h2 className="font-bold">Your FLOW Balance: {balance}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>        
    
  );

}

export default App;
