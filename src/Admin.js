import "./dist/output.css"

import CoinCollection from "./components/CoinCollection.js";
import SaleCollection from "./components/SaleCollection.js";
import AdminStore from "./components/AdminStore.js"
import UserAccount from "./components/UserAccount.js"
import SetupAccount from "./components/SetupAccount.js"
import CoinStats from "./components/CoinStats.js"
import Footer from "./components/Footer.js"

import * as fcl from "@onflow/fcl";

import {checkCoinCollection} from "./cadence/scripts/check_coincollection.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const[user, setUser] = useState();
  const[coincollectioncheck, setCheckCoinCollection] = useState('');

  useEffect(() => {

    const onload = async () => {
      loginStatus();
      checkTheCoinCollection();
    }

    document.title = 'Admin';
    
    onload();

  }, [])

 const loginStatus = async () => {
    const currentUser = await fcl.currentUser.snapshot();
    console.log("The Current User", currentUser.addr);
    if (currentUser.addr) { // user is logged in
      // sets the `user` variable to the person that is logged in through Blocto
      fcl.currentUser().subscribe(setUser);
    } 
  }

  const checkTheCoinCollection = async () => {
    const result = await fcl.send([
      fcl.script(checkCoinCollection),
      fcl.args([fcl.currentUser])
    ]).then(fcl.decode);

    setCheckCoinCollection(result)
  }

  return (
    
    <div>

      <UserAccount/>


      <div className="flex flex-col text-center font-bold  bg-blue-400">
        <h1 className="text-white text-4xl">Your Coin Collection</h1>
      </div>

      { coincollectioncheck == true 
        ?
        <CoinCollection address={user.addr}></CoinCollection>

        :
        <SetupAccount/>
      }

      <div className="flex flex-col text-center font-bold  bg-green-400">
        <h1 className="text-white text-4xl">Coin Marketplace</h1>
      </div>

      <SaleCollection address="0x28b2715c085b4a79"/>

      <AdminStore/>

      <Footer/>
   
    </div>
    
  );

}

export default App;
