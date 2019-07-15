import Web3 from "web3";
import ticTacToeArtifact from "../../build/contracts/TicTacToe.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ticTacToeArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        ticTacToeArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      //this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  createNewGame: () =>{
    this.meta.new({from:account, value:web3.util.toWei(new web3.util.BN(1),"ether")}).then(instance=>{
      console.log(instance);
    }).catch(err=>{
      console.error(err);
    })
  },

  joinGame: ()=>{
    console.log("Join Game called");
  }



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
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
