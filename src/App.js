import "./dist/output.css"

import CoinCollection from "./components/CoinCollection.js";
import CoinStore from "./components/CoinStore.js";
import AdminStore from "./components/AdminStore.js"
import PreviousCoinFlips from "./components/PreviousCoinFlips.js"
import SetupAccount from "./components/SetupAccount.js"
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

    <div className="flex flex-col mx-auto space-y-6 md:space-y-6 md:flex-row bg-gradient-to-r from-sky-500 to-indigo-500">
        <div className="flex flex-col space-y-14 md:w-1/2">
            <h2 className="max-w-md text-4xl font-bold text-center md:text-left md:ml-14 text-white">
                Waterfall of Luck                  
            </h2>
        </div>
        <div className=" flex flex-col space-y-14 md:w-1/2">
            <div className="flex flex-col">
                <div className="rounded-l-full bg-gradient-to-r from-zinc-500 to-neutral-400">
                    <div className="flex items-center space-x-2">
                      

                    { user.loggedIn == true
                        ?
                        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                            <button onClick={() => fcl.unauthenticate()}>Disconnect Character</button>  
                        </div>
                        :
                        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold">
                            <button onClick={() => fcl.logIn()}>Connect Character</button>
                        </div>     
                    }
        
                        <div className="text-white">
                            <h2 className="font-bold">Name: {user.loggedIn == true ? user.addr : ''}</h2>
                            <h2 className="font-bold">FLOW Balance: {balance}</h2>

                    { user.loggedIn ==true && balance < 1
                      ?
                      <div>Important Notice: For Testnet Flow Balance, copy your Name and then go to the <a className="font-bold text-indigo-600" href="https://testnet-faucet-v2.onflow.org/fund-account">TestNet Faucet</a> and load your account with 1000 $FLOW. </div>
                      :
                      null
                    }

                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>        
      
      <div className="flex flex-col font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500">
      
        { user.loggedIn == true && coincollectioncheck == false
        ?
        <SetupAccount/>
        :
        null
        }

        { user.loggedIn == null
        ?
        <div className="font-bold text-center relative italic">
          <img className="flex flex-col justify-center items-center mx-auto md:w-1/2" src="https://raw.githubusercontent.com/LibruaryNFT/WaterfallOfLuck/main/1.png"/>
          <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-90">
            <h3 className="text-xl text-white font-bold">
            Welcome traveler! <br></br></h3>
            <p className="mt-2 text-sm text-white">Yes, the tales are true, I am the Waterfall of Luck.. <br></br>and luckily for you I can speak English!<br></br>
            <br></br>I want to have some fun with you, but first I'd like to get to know who you are. Look for a way to identify yourself! Legends say there might be a big button that says 'Connect Character'.<br></br></p>
          </div>
        </div>
        :
        null
        }

        { user.loggedIn == true && coincollectioncheck == true
        ?
        
        <div className="font-bold text-center relative italic">
          <img className="flex flex-col justify-center items-center mx-auto md:w-1/2" src="https://raw.githubusercontent.com/LibruaryNFT/WaterfallOfLuck/main/1.png"/>
          <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-90">
            <h3 className="text-xl text-white font-bold">
            Feeling lucky today? <br></br></h3>
            <p className="mt-2 text-sm text-white">I hope so!<br></br>As the great Waterfall of Luck, I will allow you to throw in a marked coin, if it lands with the marking faced up in my waters.. treasures await you!<br></br></p>
          </div>
        </div>

        :
        null
        }

        { user.loggedIn == true && coincollectioncheck == true
        ?
        <CoinCollection address={user.addr}/>
        :
        null
        }

        { user.loggedIn == true && coincollectioncheck == true
        ?
        <CoinStore address="0x7b2848088d45b449"/>  
        :
        null
        }

        { user.loggedIn == true && coincollectioncheck == true
        ?
        <PreviousCoinFlips/>
        :
        null
        }
       
      </div>
      
      <Footer/>
   
    </div>
    
  );

}

export default App;
 