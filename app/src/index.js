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
  nextPlayerEvent:null,
  gameOverWithWinEvent:null,
  gameOverWithDrawEvent:null,
  arrEventsFired:null,


  
  
  start: async function() {
    const { web3 } = this;

  
    try { 
      // get contract instance

     


      

     App.accounts = await App.web3.eth.getAccounts();
     App.account = App.accounts[0];
    // App.account1= App.accounts[1];
     TicTacToe.setProvider(App.web3.currentProvider);
     App.arrEventsFired=[];

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  useAccountOne: ()=>{
    App.account= App.accounts[1];
    console.log(App.account);
  },

  
  createNewGame: async () =>{
    TicTacToe.new({from:App.account, value: App.web3.utils.toWei(new App.web3.utils.BN(1),"ether")}).then(instance=>{
      App.ticTacToeInstance=instance;
      

     $(".in-game").show();
     $(".waiting-for-join").hide();
     $(".game-start").hide();
     $("#game-address").text(instance.address);
     $("#waiting").show();     


      //console.log(instance);
     const playerJoinedEvent = App.ticTacToeInstance.PlayerJoined();
       
       playerJoinedEvent.on("data",(eventObj)=>{
        $(".waiting-for-join").show();
        
        App.ticTacToeInstance.player2.call().then(player2address=>{
          $("#opponent-address").text(player2address);
        })
          console.log(eventObj);
         }).on("error",console.log);

         App.eventListing();
                
          console.log(instance);
     
    }).catch(err=>{
      console.error(err);
    })
  },

  joinGame: async ()=>{
     let gameAddress= prompt("Address of the game");
     if(gameAddress!=null) {
       TicTacToe.at(gameAddress).then(instance=>{
         App.ticTacToeInstance=instance;
         $(".in-game").show();
         $(".waiting-for-join").show();
         $(".game-start").hide();
         $("#game-address").text(instance.address);
         App.ticTacToeInstance.player1.call().then(player1address=>{
          $("#opponent-address").text(player1address);
        })
         App.eventListing();
         
           //console.log(App.account);
        return App.ticTacToeInstance.joinTheGame({from:App.account,value:App.web3.utils.toWei(new App.web3.utils.BN(1),"ether")})

       }).then(txResult => {

         console.log(txResult);
       })
     }
  },

  eventListing: ()=>{

    App.nextPlayerEvent = App.ticTacToeInstance.NextPlayer();  
         App.nextPlayerEvent.on("data",(eventObj)=>{
            App.nextPlayer(eventObj);
         });

         App.gameOverWithWinEvent = App.ticTacToeInstance.GameOverWithWin();
         App.gameOverWithWinEvent.on("data",(eventObj)=>{
             App.gameOver(eventObj);
         });

         App.gameOverWithDrawEvent = App.ticTacToeInstance.GameOverWithDraw();
         App.gameOverWithDrawEvent.on("data",(eventObj)=>{
            App.gameOver(eventObj);
         })


  },


 
  nextPlayer :(eventObj)=>{
    if(App.arrEventsFired.indexOf(eventObj.blockNumber)==-1){
    console.log(eventObj);
    App.printBoard();
    if(eventObj.args.player==App.account){
      //my turn
      
      $("#waiting").hide();
      $("#your-turn").show();

      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++) {
         // console.log($("#board")[0].children[0].children[i].children[j]);
         if($("#board")[0].children[0].children[i].children[j].innerHTML == ""){
          $($("#board")[0].children[0].children[i].children[j]).off('click').click({x:i,y:j},App.setStone);
        }
      }
      }
    }else {
      //opponent turn
      $("#waiting").show();
      $("#your-turn").hide();
    }
  }
  }, 


 gameOver:(eventObj)=>{
 
    console.log("Game Over",event);

    if(eventObj.event=="GameOverWithWin") {
          if(eventObj.args.player==App.account){
              alert("Congratulation! You won the game");
          }else {
            alert("You  loss the Game.Better Luck next Time.");
          }
    }else {

      alert('Game end with draw');
    }


    

    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++) {
       // console.log($("#board")[0].children[0].children[i].children[j]);
       $("#board")[0].children[0].children[i].children[j].innerHTML = "";
       }
      }


    $(".in-game").hide();
    $(".game-start").show();


 },






  setStone:(event)=>{
    console.log(event);

   
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++) {
       // console.log($("#board")[0].children[0].children[i].children[j]);
        $($("#board")[0].children[0].children[i].children[j]).prop('onclick',null).off('click');
      }
    }




    App.ticTacToeInstance.setStone(event.data.x,event.data.y,{from:App.account}).then(txResult=>{
      console.log(txResult);
      App.printBoard();
    })

  },

  printBoard: ()=>{
      App.ticTacToeInstance.getBoard.call().then(board=>{
          //console.log(board);
        for(let i=0;i<board.length;i++){
          for(let j=0;j<board.length;j++){
             if(board[i][j]==App.account) {
              $("#board")[0].children[0].children[i].children[j].innerHTML="X";
             }else if(board[i][j]!=0) {
              $("#board")[0].children[0].children[i].children[j].innerHTML="O";
             }
          }
        }



      });

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
      new Web3.providers.WebsocketProvider("WS://127.0.0.1:9545"),
    );
  }

  App.start();
});
