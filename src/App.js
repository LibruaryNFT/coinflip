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

document.title = 'Waterfall of Luck';

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
                            <button onClick={() => fcl.logIn()}>Connect Character</button>
                        </div>     
                    }
        
                        <div>
                            <h2 className="font-bold">Character Information</h2>
                            <h2 className="font-bold">Name: {user.loggedIn == true ? user.addr : ''}</h2>
                            <h2 className="font-bold">FLOW Balance: {balance}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>        
      
      <div className="flex flex-col font-bold text-white bg-purple-400">
        <h1 className="text-white text-4xl text-center">A friendly visitor?!</h1>
      
        Welcome traveller! <br></br>Yes, the tales are true, I am the Water of Luck.. <br></br>and luckily for you I can speak English!
        <br></br>I want to have some fun with you, but first I'd like to get to know who you are. Please identify yourself!
        { user.loggedIn == true && coincollectioncheck == false
        ?
        <SetupAccount/>
        :
        null
        }

        { user.loggedIn == null
        ?
        <div className="font-bold">Look for a way to identify yourself! Legends say there might be a big button that says 'Connect Character'. Also, I know I am friendly to those from the land of BloctoWallet, but unsure about others.. </div>
        :
        null
        }
      
      </div>
      
      { user.loggedIn == true && coincollectioncheck == true
        ?
        <PreviousCoinFlips/>
        :
        null
      }
                    
      { user.loggedIn == true && coincollectioncheck == true
        ?
        <CoinCollection address={user.addr}></CoinCollection>
        :
        null
      }

      { user.loggedIn == true && coincollectioncheck == true
        ?
        <CoinStore address="0xf788ae5c7ec2d1ae"/>  
        :
        null
      }
                  
     
      <Footer/>
   
    </div>
    
  );

}

export default App;
 