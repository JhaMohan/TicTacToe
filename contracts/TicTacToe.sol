pragma solidity ^0.5.0;


contract TicTacToe {
    
    uint constant public gameCost = 1 ether;
    uint8 public boardSize =3;
    uint8 Counter;
    
    uint TimeToReact= 3 minutes;
    uint GameValidUntil;
    
    
    bool gameActive;
    
    address gameInitiator; 
    
    address[3][3] board;
    
    address payable public  player1;
    address payable public player2;
    
    uint balanceToDrawPlayer1;
    uint balanceToDrawPlayer2;
    
    address payable activePlayer;
    
    event PlayerJoined(address player);
    event NextPlayer(address player); 
    event GameOverWithWin(address player);
    event GameOverWithDraw();
    event PayoutSucess(address receiver,uint amountInWei);
    
    constructor() public  payable{
        require(msg.value==gameCost);
        player1=msg.sender;
        gameInitiator=player1;
        
        GameValidUntil = now + TimeToReact;
        
    }
    
    
    function joinTheGame() public payable{
        require(msg.sender!=gameInitiator);
        assert(player2==address(0));
        require(msg.value==gameCost);
        gameActive=true;
         GameValidUntil = now + TimeToReact;
        player2=msg.sender;
        emit PlayerJoined(activePlayer);
        
        if(block.number%2==0) {
            activePlayer=player2;
        }else {
            activePlayer=player1;
        }
        
        emit NextPlayer(activePlayer);
        
        
    }
    
    function getBoard() public view returns(address[3][3] memory) {
        return board;
    }
    
    
    
    function setWinner(address payable player_win) private {
        gameActive=false;
        //emit an event
        emit GameOverWithWin(player_win);
        //transfer money to the winner
        
        uint payoutBalance = address(this).balance;
        
        if(player_win.send(address(this).balance)!=true) {
            
            if(player_win==player1) {
                balanceToDrawPlayer1=address(this).balance;
            }else {
                balanceToDrawPlayer2=address(this).balance;
            }
        }else {
              emit  PayoutSucess(player_win,payoutBalance);
            }
            
        
        
    }
    
    
    function withdraw() public {
        if(msg.sender==player1) {
            require(balanceToDrawPlayer1>0);
            balanceToDrawPlayer1=0;
            player1.transfer(balanceToDrawPlayer1);
            emit  PayoutSucess(player1,balanceToDrawPlayer1);
        }else {
            require(balanceToDrawPlayer1>0);
            balanceToDrawPlayer2=0;
            player2.transfer(balanceToDrawPlayer2);
            emit  PayoutSucess(player2,balanceToDrawPlayer2);
        }
    }
    
    
    
    
   function setDraw() private {
       gameActive=false;
       emit GameOverWithDraw();
       
       
       uint balanceToPayout = address(this).balance/2;
       if(player1.send(balanceToPayout)!=true){
           balanceToDrawPlayer1 += balanceToPayout;
       }else {
           emit PayoutSucess(player1,balanceToPayout);
       }
       
       
       if(player2.send(balanceToPayout)!=true) {
           balanceToDrawPlayer2 +=balanceToPayout;
       }else {
           emit PayoutSucess(player2,balanceToPayout);
       }
      
       
   }    
    
    
    function emergencyCashOut() public {
        
        require(GameValidUntil<now);
        require(gameActive);
        
        
        uint payoutBalance = address(this).balance;
        if(activePlayer==player1) {
            if(player2.send(address(this).balance)!=true) {
                balanceToDrawPlayer2 += address(this).balance;
            }else {
                emit PayoutSucess(player2,payoutBalance);
            }
        } else {
            
             if(player1.send(address(this).balance)!=true) {
                balanceToDrawPlayer1 += address(this).balance;
            }else {
                emit PayoutSucess(player1,payoutBalance);
            }
            
        }
        
        
        
        
        
    }
    
    
    
    
    
    function setStone(uint8 x,uint8 y) public {
        
        require(board[x][y]==address(0));
        require(GameValidUntil>now);
        assert(gameActive);
        assert(x< boardSize);
        assert(y<boardSize);
        require(msg.sender==activePlayer);
        board[x][y]=msg.sender;
        Counter++;
         GameValidUntil = now + TimeToReact;
          
        
        
        //checking row 
        for(uint8 i=0;i<boardSize;i++) {
            
            if(board[i][y]!=activePlayer) {
                break;
            }
            
            if(i== boardSize-1)
             {
                setWinner(activePlayer);
                return;
             }
            
        }
        
        //checking column
        
        for(uint8 i=0;i<boardSize;i++) {
            
            if(board[x][i]!=activePlayer) {
                break;
            }
            
            if(i== boardSize-1)
             {
                  setWinner(activePlayer);
                return;
             
             }
            
            
            
        }
        
        //for diagonal
        if(x==y) {
            
            for(uint8 i=0;i<boardSize;i++) {
                if(board[i][i]!=activePlayer) {
                    break;
                }
                
                
                if(i== boardSize-1)
                 {
                   setWinner(activePlayer);
                   return;
             
                }
            
        }
      }
      
      //anti daigonal
      
      if((x+y)==boardSize-1) {
          
          for(uint8 i=0;i<boardSize;i++) {
              if(board[i][(boardSize-1)-i]!=activePlayer) {
                  break;
              }
              
              if(i==boardSize-1) {
                   setWinner(activePlayer);
                return;
             
              }
              
              
          }
          
      }
      
      
      
      if(Counter==(boardSize**2)) {
          //draw
          setDraw();
          return;
      }
      
      
        
        
        
        
        
        
        
        
        
        
        
        if(activePlayer==player2) {
            activePlayer=player1;
        }else {
            activePlayer = player2;
        }
       
      
       emit NextPlayer(activePlayer);   
    }
    
    
    
}