import "../dist/output.css"

import * as fcl from "@onflow/fcl";

import {checkCoinCollection} from "../cadence/scripts/check_coincollection.js";
import {getBalance} from "../cadence/scripts/get_balance.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")


function UserDetails(props) {

  const[user, setUser] = useState({loggedIn: false});
  const[balance, setBalance] = useState(0);
  const[coincollectioncheck, setCheckCoinCollection] = useState();

  useEffect(() => {
    
    fcl.currentUser.subscribe(setUser);

  }, [])

  useEffect(() => {
    
    if (user.loggedIn == true){
      getTheBalance();
      checkTheCoinCollection();
    } else {
      setBalance("");
    }

  }, [user])

  
  const getTheBalance = async () => {
      const result = await fcl.send([
        fcl.script(getBalance),
        fcl.args([fcl.currentUser])
      ]).then(fcl.decode);
      setBalance(result);
      console.log("Balance", result);
  }

  const checkTheCoinCollection = async () => {
      const result = await fcl.send([
        fcl.script(checkCoinCollection),
        fcl.args([fcl.currentUser])
      ]).then(fcl.decode);
      setCheckCoinCollection(result);
      console.log("checkcoincollection", result);
  }


  return (
    
    <div>
        <div className=" flex flex-col space-y-14 md:w-1/2">
            <div className="flex flex-col">
                <div className="rounded-l-full bg-brightRedSupLight">
                    <div className="flex items-center space-x-2">
                      

                    { user.loggedIn == true
                        ?
                        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                            <button onClick={() => fcl.unauthenticate()}>Disconnect Wallet</button>  
                        </div>
                        :
                        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                            <button onClick={() => fcl.logIn()}>Connect Wallet</button>
                        </div>     
                    }
        
                        <div>
                            <h2 className="font-bold">Account Information</h2>
                            <h2 className="font-bold">Account Address: {user.loggedIn == true ? user.addr : ''}</h2>
                            <h2 className="font-bold">FLOW Balance: {balance}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>        
                  
    
  );

}

export default UserDetails;
