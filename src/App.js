import "./dist/output.css"

import CoinCollection from "./components/CoinCollection.js";
import SaleCollection from "./components/SaleCollection.js";
import CoinStore from "./components/CoinStore.js";
import AdminStore from "./components/AdminStore.js"
import SetupAccount from "./components/SetupAccount.js"
import PreviousCoinFlips from "./components/PreviousCoinFlips.js"
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

    <div className="flex flex-col mx-auto space-y-6 md:space-y-6 md:flex-row bg-zinc-800">
        <div className="flex flex-col space-y-14 md:w-1/2">
            <h2 className="max-w-md text-4xl font-bold text-center md:text-left md:ml-14 text-white">
                Waterfall of Luck                  
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
                  
      
      <div className="flex flex-col font-bold text-white bg-purple-400">
                    
        <h1 className="text-white text-4xl text-center">Feeling Lucky?</h1>
        Throw in a coin and say how you think the coin will land at the bottom of the water! <br></br>
If you are correct, riches await you! Remember that any coins thrown in can never again be retrieved!<br></br>
If you'd like more coins, I sell only the luckiest coins below at the Lucky Coin Store.
 <br></br>

        
      </div>
      
      <div className="flex flex-col font-bold text-white bg-purple-400">
        <h1 className="text-white text-4xl text-center">Game Instructions</h1>
      

        { user.loggedIn == true && coincollectioncheck == false
        ?
        <SetupAccount/>
        :
        null
        }

        { user.loggedIn == null
        ?
        <div className="font-bold">Connect Wallet to view your Coin Collection.</div>
        :
        null
        }
        
        <div>Special Note for Testing: If you need funds, copy your Account Address top right and then use <a className="text-sky-800" href='https://testnet-faucet-v2.onflow.org/fund-account' target="_blank">TestNet Faucet</a> to fund your account.</div>
        <div className="font-bold">1. Purchase a Coin from the Store.<br></br>
        2. Click the Coin in your Collection<br></br>
        3. Wait and see if you Predicted correctly to win $FLOW!</div>  
        
      </div>
      
      <PreviousCoinFlips/>
                    
      { user.loggedIn == true && coincollectioncheck == true
        ?
        <CoinCollection address={user.addr}></CoinCollection>
        :
        null
      }
      <CoinStore address="0xf788ae5c7ec2d1ae"/>              
     
      
      <Footer/>
   
    </div>
    
  );

}

export default App;
 