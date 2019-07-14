const TicTacToe = artifacts.require('TicTacToe');

contract("TicTacToe",(accounts)=>{

    
   it("To check the winner", ()=>{

    let ticTacToeinstance;
    const playerOne = accounts[0];
    const playerTwo = accounts[1];

    return TicTacToe.new({from : playerOne,value : web3.utils.toWei(new web3.utils.BN(1),"ether")}).then(instance=>{
       
        ticTacToeinstance=instance;

      return  ticTacToeinstance.joinTheGame({from:playerTwo, value : web3.utils.toWei(new web3.utils.BN(1),"ether")})
       }).then( txHash=>{
        //console.log(txHash.logs[1].args.player);
        return ticTacToeinstance.setStone(0,0,{from:txHash.logs[1].args.player})
    }).then(txHash=>{
        //console.log(txHash.logs[0].args.player);
        return ticTacToeinstance.setStone(0,1,{from:txHash.logs[0].args.player})
    }).then(txHash=>{
      //  console.log(txHash.logs[0].args.player);
         // console.log(txHash.logs[0].args.player);
         return ticTacToeinstance.setStone(1,0,{from:txHash.logs[0].args.player})
    }).then(txHash=>{
        //  console.log(txHash.logs[0].args.player);
           // console.log(txHash.logs[0].args.player);
           return ticTacToeinstance.setStone(0,2,{from:txHash.logs[0].args.player})
      }).then(txHash=>{
        //  console.log(txHash.logs[0].args.player);
           // console.log(txHash.logs[0].args.player);
           return ticTacToeinstance.setStone(2,0,{from:txHash.logs[0].args.player})
      }).then(txHash=>{
          assert.equal(txHash.logs[0].event,"GameOverWithWin","Game ended with win");
      })
    .catch(err =>{
        console.log(err);
    })
   }) 
});