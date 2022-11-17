import '../dist/output.css';

import * as fcl from "@onflow/fcl";
import {getTotalSupply} from "../cadence/scripts/get_total_supply.js";
import {getBalance} from "../cadence/scripts/get_balance.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function UserAccount() {
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
      getTheBalance(); 
    } 
  }
  

  const getTheSupply = async () => {
    const result = await fcl.send([
      fcl.script(getTotalSupply)
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
    <div className="flex flex-col mx-auto space-y-6 md:space-y-6 md:flex-row bg-zinc-800">
        <div className="flex flex-col space-y-14 md:w-1/2">
            <h2 className="max-w-md text-4xl font-bold text-center md:text-left md:ml-14 text-white">
                CoinFlip                  
            </h2>
        </div>
        <div className=" flex flex-col space-y-14 md:w-1/2">
            <div className="flex flex-col">
                <div className="rounded-l-full bg-brightRedSupLight">
                    <div className="flex items-center space-x-2">

                    { user && user.addr 
                        ?
                        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                            <button onClick={() => fcl.unauthenticate()}>Disconnect Wallet</button>  
                        </div>
                        :
                        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                            <button onClick={() => logIn()}>Connect Wallet</button>
                        </div>     
                        }
        
                        <div>
                            <h2 className="font-bold">Account Information</h2>
                            <h2 className="font-bold">Account Address: {user && user.addr ? user.addr : ''}</h2>
                            <h2 className="font-bold">FLOW Balance: {balance}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>        
    
  );

}

export default UserAccount;
