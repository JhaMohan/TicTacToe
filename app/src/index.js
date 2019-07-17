import Web3 from "web3";
import { default as contract } from 'truffle-contract'
import ticTacToeArtifact from "../../build/contracts/TicTacToe.json";
import $ from "jquery";

   
  let TicTacToe = contract(ticTacToeArtifact);

let App = {
 web3: null,
 account: null,
 accounts:null,
  ticTacToeInstance:null,

  
  
  start: async function() {
 //   const { web3 } = this;

  
    try { 
      // get contract instance
     App.accounts = await App.web3.eth.getAccounts();
     App.account = App.accounts[0];
    // App.account1= App.accounts[1];
     TicTacToe.setProvider(App.web3.currentProvider);
     
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  useAccountOne: ()=>{
    App.account=App.accounts[1];
  },

  
  createNewGame: async () =>{
    TicTacToe.new({from:App.account, value: App.web3.utils.toWei(new App.web3.utils.BN(1),"ether")}).then(instance=>{
      App.ticTacToeInstance=instance;

       for(let i=0;i<3;i++){
         for(let j=0;j<3;j++) {
           console.log($("#board")[0].children[0].children[i].children[j]);
           $($("#board")[0].children[0].children[i].children[j]).off('click').click({x:i,y:j},App.setStone);
         }
       }
      console.log(App.ticTacToeInstance);
    }).catch(err=>{
      console.error(err);
    })
  },

  joinGame: async ()=>{
     let gameAddress= prompt("Address of the game");
     if(gameAddress!=null) {
       TicTacToe.at(gameAddress).then(instance=>{
         App.ticTacToeInstance=instance;
           
        return App.ticTacToeInstance.joinTheGame({from:App.account,value:App.web3.utils.toWei(new App.web3.utils.BN(1),"ether")})

       }).then(txResult => {

       for(let i=0;i<3;i++){
        for(let j=0;j<3;j++) {
          console.log($("#board")[0].children[0].children[i].children[j]);
          $($("#board")[0].children[0].children[i].children[j]).off('click').click({x:i,y:j},App.setStone);
        }
      }
         console.log(txResult);
       })
     }
  },
  setStone:(event)=>{
    console.log(event);
    App.ticTacToeInstance.setStone(event.data.x,event.data.y,{from:App.account}).then(txResult=>{
      console.log(txResult);
    })

  },



};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.start();
});
