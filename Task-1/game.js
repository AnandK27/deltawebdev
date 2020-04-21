var start = document.querySelector('.start');
var stop = document.querySelector('.stop');
var timer = document.querySelector('.timer');
var cellCenter = document.querySelectorAll('.cell.center');
var cellLeft = document.querySelectorAll('.cell.left');
var container = document.querySelector('.container');
var countDownNumb = document.querySelector('.counter');
var highScore = document.querySelector('.highScore');
var leaderBoard = document.querySelector('.leaderBoard');
var difficultyForm = document.forms['diff'];
var difficultyLeader = document.querySelector('.difficultyLeader');
var leaderBoardList = leaderBoard.querySelectorAll('li');
let arr = Array.from({length: 20}, (_,index) => index + 1);
var counter,difficulty,presentScore,countDown,timerTimeOut,gameStarted = false;
var audWinGame = document.getElementById('audWinGame');
var audCountDown = document.getElementById('audCountDown');
var audErrorOption = document.getElementById('audErrorOption');
var audPointScore = document.getElementById('audPointScore');
var audGameStart = document.getElementById('audGameStart');
var audEasy = document.getElementById('audEasy');
var audMedium = document.getElementById('audMedium');
var audHard = document.getElementById('audHard');
var audGameStop = document.getElementById('audGameStop');
var aboutGame = document.querySelector('.about');
var aboutContent = document.querySelector('.aboutContent');
var radioButns = difficultyForm.querySelectorAll('input');
var resetLeaderBoard = document.querySelector('.foot');


function setCellTextColor(cell,counter){
  cell.style.background = 'grey';
  setTimeout(function(){
    cell.style.background = 'lightblue';
  },100);
  cell.style.color = "hsl(290,100%,"+(60-counter)+"%)";
}
 function changeDifficulty(str){
   if(gameStarted == false){
   if(str.toLowerCase() == 'easy'){
     difficulty = 0;
     difficultyLeader.innerHTML = 'Easy';
     if(!audEasy.paused){
       audEasy.load();
     }
     audEasy.play();
     HighScores();
   }

   else if(str.toLowerCase() == 'hard'){
     difficulty = 2;
     difficultyLeader.innerHTML = 'Hard';
     HighScores();
     if(!audMedium.paused){
       audMedium.load();
     }
     audMedium.play();
   }

   else{
     difficulty = 1;
     difficultyLeader.innerHTML = 'Medium';
     HighScores();
     if(!audHard.paused){
       audHard.load();
     }
     audHard.play();
   }
 }
}


difficultyForm.addEventListener('change',function(e){
  if(e.target.checked){
    if(e.target.id == 'easy')
      changeDifficulty('easy');
    else if(e.target.id == 'hard')
      changeDifficulty('hard');
    else
      changeDifficulty('medium');
  }
});



function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function HighScores() {
        if(typeof(Storage)!=="undefined"){
            var scores = false;
            if(localStorage["high-scores"]) {
                scores = JSON.parse(localStorage["high-scores"]);
                scores[difficulty] = scores[difficulty].sort();
                if(scores[difficulty][0] == null) {
                  for(let i = 0; i < 5; i++){
                  leaderBoardList[i].innerHTML = "";}
                  highScore.innerHTML = "0.000";
                  return;
                }
                highScore.innerHTML = scores[difficulty][0];
               for(let i = 0; i < 5; i++){
                 var s = scores[difficulty][i];
                   leaderBoardList[i].innerHTML = (s !== null ? (s+'s') : "" );
                }
            }
        }
        else {
            highScore.innerHTML = "0.000";
        }
    }

      function UpdateScore() {
          if(typeof(Storage)!=="undefined"){
              var current = presentScore;
              var scores = false;
              if(localStorage["high-scores"]) {
                  scores = JSON.parse(localStorage["high-scores"]);
                  scores[difficulty] = scores[difficulty].sort();

                  for(var i = 0; i < 5; i++){
                      var s = parseFloat(scores[difficulty][i]);

                      var val = (!isNaN(s) ? s : -1 );
                      if(current < val || val == -1)
                      {
                          scores[difficulty].splice(i, 0, parseFloat(current));
                          break;
                      }
                  }

                  scores[difficulty].length = 5;
                  localStorage["high-scores"] = JSON.stringify(scores);

              } else {
                  var scores = new Array(3);
                  for(let i = 0; i<3 ; ++i){
                    scores[i]=new Array(5);
                  }
                  scores[difficulty][0] = current;
                  localStorage["high-scores"] = JSON.stringify(scores);
              }

              HighScores();
          }
      }

changeDifficulty("Medium");

start.addEventListener('click',function(e){
	if(gameStarted){
clearTimeout(countDown);
countDownNumb.innerHTML = "";
restartGame();
	}

gameStarted = true;
radioButns.forEach(function(butn){
  butn.disabled = true;
})
leaderBoard.classList.add("hide");
counter=1;
let gameArr = arr;
shuffle(gameArr);
Array.from(cellCenter).forEach(function(cell,i){
	cell.innerHTML = gameArr[i];
  cellLeft[i].innerHTML = gameArr[i];
  setCellTextColor(cell,gameArr[i]);
  setCellTextColor(cellLeft[i],gameArr[i]);
})
audCountDown.play();
startCountDown(3);

container.addEventListener('click', updateCell);

stop.addEventListener('click',function(e){
clearInterval(countDown);
countDownNumb.innerHTML = "";
	restartGame();
})

})

function updateCell(e){
  console.log(e.target);
	if(e.target.classList[0] == 'cell'){
      if(e.target.innerHTML == counter){
        if(!audPointScore.paused){
        audPointScore.load();
      }
        audPointScore.play();
        e.target.style.borderColor = "rgb(0,255,0)";
        setTimeout(function(){
          e.target.style.borderColor = "blue";
        },100);
        var cellstoChange = container.querySelectorAll('.'+ e.target.classList[3]);
        cellstoChange.forEach(function(cell,i){
          if(counter<=(20*difficulty)){
                cell.innerHTML = counter + 20;
            setCellTextColor(cell,counter+20);
            if(i){counter++;}
        }
        else{

            cell.innerHTML = "";
          if(i){counter++;}

        }
        if(counter==(20*(difficulty + 1)) +1 ){
          finishGame();
          presentScore = parseFloat(timer.innerHTML);
          countDownNumb.classList.remove('hide');
          UpdateScore();
        }
      })
    }
    else{
      if(!audErrorOption.paused)
      {audErrorOption.load();}
      audErrorOption.play();
      e.target.style.borderColor = "red";
      setTimeout(function(){
        e.target.style.borderColor = "blue";
      },100);
      }
}
}

function startCountDown(numb){
if(numb <= 0){
	countDownNumb.innerHTML = "";
	countDownNumb.parentElement.classList.add('hide');
  audGameStart.play();
	startTimer();
	return;
}
 countDownNumb.innerHTML = numb;
 numb-=1;
 countDown = setTimeout(function(){startCountDown(numb)}, 1000);
}

function startTimer(){
	var startTime = Date.now();
	timerTimeOut = setInterval(function(){
		timer.innerHTML = ((Date.now()-startTime)/1000).toFixed(3);
	},10);
}

function stopTimer(){
	clearInterval(timerTimeOut);
  container.removeEventListener('click',updateCell);
  leaderBoard.classList.remove('hide');
  radioButns.forEach(function(butn){
    butn.disabled = false;
  })
}

function clearTimer(){
	stopTimer();
	timer.innerHTML = '0.000';
}

function finishGame(){
	stopTimer();
  audWinGame.play();
  countDownNumb.parentElement.classList.remove('hide')
  gameStarted = false;
}

function restartGame(){
	if(gameStarted){
    clearTimer();
	countDownNumb.parentElement.classList.remove('hide');
  audCountDown.load();
  if(!audGameStop.paused){
    audGameStop.load();
  }
  audGameStop.play();
	gameStarted = false;
}
}

aboutGame.addEventListener('mouseenter',function(){
  aboutContent.style.display = "initial";
})

aboutGame.addEventListener('mouseleave',function(){
  aboutContent.style.display = "none";
})

resetLeaderBoard.addEventListener(('click'),function(){
  localStorage.clear();
  window.location.reload();
});
