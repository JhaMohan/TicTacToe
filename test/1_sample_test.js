const TicTacToe = artifacts.require('TicTacToe');


contract("TicTacToe", (accounts)=>{

    it("should have empty board at the begning", () => {
    return TicTacToe.new({from : accounts[0],value: web3.utils.toWei(new web3.utils.BN(1),"ether")}).then( instance => {
        return instance.getBoard.call();
    }).then(board => {
       assert.equal(board[0][0],0,"First row and column value should be same");
    }).catch(err => {
       console.log(err);
    })
   })







})