const TicTacToe = artifacts.require('TicTacToe');

contract("TicTacToe",(accounts)=>{

  it("Game could be draw",()=>{

    let ticTacToeInstance;
    const playerOne=accounts[0];
    const playerTwo=accounts[1];

  return TicTacToe.new({from:playerOne,value:web3.utils.toWei(new web3.utils.BN(1),"ether")}).then(instance => {
     
    ticTacToeInstance=instance;
    
    return ticTacToeInstance.joinTheGame({from:playerTwo,value:web3.utils.toWei(new web3.utils.BN(1),"ether")})
  }).then(txResult=>{
        return ticTacToeInstance.setStone(0,0,{from: txResult.logs[1].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(0,1,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(0,2,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(1,0,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(1,2,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(1,1,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(2,0,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(2,2,{from: txResult.logs[0].args.player})
  }).then(txResult =>{
    return ticTacToeInstance.setStone(2,1,{from: txResult.logs[0].args.player})
  }).then(txResult=>{
      assert.equal(txResult.logs[0].event,"GameOverWithDraw","Game should be draw");
  })
  
  
  .catch(err=>{
      console.log(err);
  })

   



  })  

})