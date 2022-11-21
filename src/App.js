import "./dist/output.css"

import CoinCollection from "./components/CoinCollection.js";
import SaleCollection from "./components/SaleCollection.js";
import AdminStore from "./components/AdminStore.js"
import SetupAccount from "./components/SetupAccount.js"
import CoinStats from "./components/CoinStats.js"
import Footer from "./components/Footer.js"

import * as fcl from "@onflow/fcl";

import {checkCoinCollection} from "./cadence/scripts/check_coincollection.js";
import {getBalance} from "./cadence/scripts/get_balance.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

document.title = 'CoinFlip';

function App() {

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
      setBalance(result)
      console.log("Balance", result);
  }

  const checkTheCoinCollection = async () => {
      const result = await fcl.send([
        fcl.script(checkCoinCollection),
        fcl.args([fcl.currentUser])
      ]).then(fcl.decode);
      setCheckCoinCollection(result)
      console.log("checkcoincollection", result);
  }

  return (
    
    <div>

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


      <div className="flex flex-col text-center font-bold  bg-blue-400">
        <h1 className="text-white text-4xl">Your Coin Collection</h1>
      </div>

      { user.loggedIn == true && coincollectioncheck == true
        ?
        <CoinCollection address={user.addr}></CoinCollection>
        :
        null
      }

      { user.loggedIn == true && coincollectioncheck == false
        ?
        <div>zzzzz</div>
        :
        null
      }

      { user.loggedIn == false
        ?
        <div>Connect Wallet to view your Coin Collection.</div>
        :
        null
      }
                      
    

   


      <div className="flex flex-col text-center font-bold  bg-green-400">
        <h1 className="text-white text-4xl">Coin Marketplace</h1>
      </div>

      <SaleCollection address="0xb5d3705b4021c2ea"/>

      <Footer/>
   
    </div>
    
  );

}

export default App;
