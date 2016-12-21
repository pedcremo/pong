/* constants */
var SLEEPTIME = 1; // time between updates
var PAUSEDSLEEPTIME = 100;
var WIDTH = 800;
var HEIGHT = 600;
var BALLDIAMETER = 11;
var PADDLEWIDTH = 12;
var PADDLEHEIGHT = 80;
var PADDLEOFFSET = 4; // distance from edge of field
var PADDLEMAXSPEED = (1000/1000); // in pixels per millisecond
var MAXBOUNCEANGLE = (Math.PI/12);

/* global variables */
var paused = false;
var score1=0, score2=0;
var lastTime;
var ballX, ballY;   // position
var ballVx, ballVy; // velocity & direction
var paddle1Y;
var paddle1Vy=0;
var paddle2Y;
var paddle2Vy=0;
/*** Velocities are in pixels/ms ***/

/* elements */
var page;
var pongtable;
var content;
var ball;
var paddle1, paddle2;

window.onload = function () {
	// load all element variables
	page = document.getElementById("page");
	pongtable = document.getElementById("pong_table");
	content = document.getElementById("content");
	ball = document.getElementById("pong_ball");
	paddle1 = document.getElementById("pong_paddle1");
	paddle2 = document.getElementById("pong_paddle2");
	
	// clear the field
	UpdateScores();
	ResetBall();
	ResetPaddles();
	SetBallPos();
	ResetPaddles();
	SetPaddlePos();
	
	// start the frame loop
	lastTime = new Date();
	setTimeout(Frame,1);
	
	// bind keypress event
	content.onmousedown = MouseDown;
	content.onmouseup = MouseUp;
	
	// and return
	page.style.display="block";
	return true;
}

function Frame() {
	var currTime = new Date();
	var millis = currTime.getTime() - lastTime.getTime();
	lastTime = currTime;
	
	if(!paused) {
		// do framely stuff here
		ProcessAI1();
		ProcessAI2();
		UpdatePaddlePos(millis,0);
		
		UpdateBallPos(millis);
		
		SetBallPos();
		SetPaddlePos();
	}
	
	if(paused)
		setTimeout(Frame,PAUSEDSLEEPTIME);
	else
		setTimeout(Frame,SLEEPTIME);
}

function UpdateBallPos(ms) {
	var newBallX = ballX + ballVx*ms;
	var newBallY = ballY + ballVy*ms;
	
	// Top and bottom edges, simply bounce
	if(newBallY < 0) {
		newBallY = -newBallY;
		ballVy = -ballVy;
	} else if(newBallY+BALLDIAMETER > (HEIGHT-1)) {
		newBallY -= 2*((newBallY+BALLDIAMETER)-(HEIGHT-1));
		ballVy = -ballVy;
	}
	
	// Left paddle (paddle1)
	if(newBallX < PADDLEOFFSET+PADDLEWIDTH && ballX >= PADDLEOFFSET+PADDLEWIDTH) {
		var intersectX = PADDLEOFFSET+PADDLEWIDTH; // (duh)
		var intersectY = ballY - ((ballX - (PADDLEOFFSET+PADDLEWIDTH))*(ballY-newBallY))/(ballX - newBallX);
		if(intersectY >= paddle1Y && intersectY <= paddle1Y+PADDLEHEIGHT) {
			var relativeIntersectY = (paddle1Y+(PADDLEHEIGHT/2)) - intersectY;
			var bounceAngle = (relativeIntersectY/(PADDLEHEIGHT/2)) * (Math.PI/2 - MAXBOUNCEANGLE);
			var ballSpeed = Math.sqrt(ballVx*ballVx + ballVy*ballVy);
			var ballTravelLeft = (newBallY-intersectY)/(newBallY-ballY);
			ballVx = ballSpeed*Math.cos(bounceAngle);
			ballVy = ballSpeed*-Math.sin(bounceAngle);
			newBallX = intersectX + ballTravelLeft*ballSpeed*Math.cos(bounceAngle);
			newBallY = intersectY + ballTravelLeft*ballSpeed*Math.sin(bounceAngle);
		}
	}
	
	// Right paddle (paddle2)
	if(newBallX > WIDTH-PADDLEOFFSET-PADDLEWIDTH && ballX <= WIDTH-PADDLEOFFSET-PADDLEWIDTH) {
		var intersectX = WIDTH-PADDLEOFFSET-PADDLEWIDTH; // (duh)
		var intersectY = ballY - ((ballX - (WIDTH-PADDLEOFFSET-PADDLEWIDTH))*(ballY-newBallY))/(ballX - newBallX);
		if(intersectY >= paddle2Y && intersectY <= paddle2Y+PADDLEHEIGHT) {
			var relativeIntersectY = (paddle2Y+(PADDLEHEIGHT/2)) - intersectY;
			var bounceAngle = (relativeIntersectY/(PADDLEHEIGHT/2)) * (Math.PI/2 - MAXBOUNCEANGLE);
			var ballSpeed = Math.sqrt(ballVx*ballVx + ballVy*ballVy);
			var ballTravelLeft = (newBallY-intersectY)/(newBallY-ballY);
			ballVx = ballSpeed*Math.cos(bounceAngle)*-1;
			ballVy = ballSpeed*Math.sin(bounceAngle)*-1;
			newBallX = intersectX - ballTravelLeft*ballSpeed*Math.cos(bounceAngle);
			newBallY = intersectY - ballTravelLeft*ballSpeed*Math.sin(bounceAngle);
		}
	}
	
	// Left and right edges, add to the score and reset the ball
	if(newBallX < 0) {
		PlayerLost(1);
		return;
	} else if(newBallX+BALLDIAMETER > (WIDTH-1)) {
		PlayerLost(2);
		return;
	}
	
	// Finally, copy newBall to ball
	ballX = newBallX;
	ballY = newBallY;
}

function PlayerLost(player) {
	if(player<1 || player>2) {
		console.log("PlayerLost given invalid player number: " + player);
		return;
	}
	
	if(player==1)
		score2++;
	else
		score1++;
	
	UpdateScores();
	ResetBall();
	ResetPaddles()
	SetBallPos();
}

function ResetBall() {
	// randomize the ball's location and velocity
	ballX = 200;
	ballY = 300;
	ballVx = 800/1000;
	ballVy = 1/1000;
}

function ResetPaddles() {
	var y = parseInt((HEIGHT-PADDLEHEIGHT)/2);
	if(controllingPaddle != 1)
		paddle1Y = y;
	if(controllingPaddle != 2)
		paddle2Y = y;
}

function SetBallPos() {
	// update the ball element to match the ballX & ballY variables
	ball.style.left = ballX+"px";
	ball.style.top = ballY+"px";
}

function UpdatePaddlePos(ms,paddle) {
	if(paddle<1 || paddle>2) paddle=0;
	if(paddle<=1) {
		paddle1Y += paddle1Vy*ms;
	}
	if(paddle%2==0) {
		paddle2Y += paddle2Vy*ms;
	}
	
	if(paddle1Y < 0) {
		paddle1Y = 0;
		paddle1Vy = 0;
	} else if(paddle1Y+PADDLEHEIGHT > HEIGHT-1) {
		paddle1Y = (HEIGHT-1)-PADDLEHEIGHT;
		paddle1Vy = 0;
	}
	if(paddle2Y < 0) {
		paddle2Y = 0;
		paddle2Vy = 0;
	} else if(paddle2Y+PADDLEHEIGHT > HEIGHT-1) {
		paddle2Y = (HEIGHT-1)-PADDLEHEIGHT;
		paddle2Vy = 0;
	}
}

function SetPaddlePos() {
	// update the paddle elements to match the paddle Y variables
	paddle1.style.top = paddle1Y+"px";
	paddle2.style.top = paddle2Y+"px";
}

function UpdateScores() {
	UpdateScore(1);
	UpdateScore(2);
}

function UpdateScore(player) {
	if(player < 1 || player > 2) {
		console.log("Invalid player num: " + player);
		return;
	}
	if(score < 0 || score > 99) {
		console.log("Invalid score: " + score);
		return;
	}
	var score;
	if(player==1) score = score1;
	else score = score2;
	
	var number1, number2;
	if(player == 1) {
		number1 = document.getElementById("pong_number1");
		number2 = document.getElementById("pong_number2");
	} else {
		number1 = document.getElementById("pong_number3");
		number2 = document.getElementById("pong_number4");
	}
	
	var onesPieces, tensPieces;
	// top, tl, tr, mid, bl, br, bot
	var GetPiecesArray = function (num) {
		var pieces;
		switch(num) {
			case 0:
				pieces = new Array(true,true,true,false,true,true,true);
			break;
			case 1:
				pieces = new Array(false,false,true,false,false,true,false);
			break;
			case 2:
				pieces = new Array(true,false,true,true,true,false,true);
			break;
			case 3:
				pieces = new Array(true,false,true,true,false,true,true);
			break;
			case 4:
				pieces = new Array(false,true,true,true,false,true,false);
			break;
			case 5:
				pieces = new Array(true,true,false,true,false,true,true);
			break;
			case 6:
				pieces = new Array(true,true,false,true,true,true,true);
			break;
			case 7:
				pieces = new Array(true,false,true,false,false,true,false);
			break;
			case 8:
				pieces = new Array(true,true,true,true,true,true,true);
			break;
			case 9:
				pieces = new Array(true,true,true,true,false,true,true);
			break;
		}
		return pieces;
	}
	onesPieces = GetPiecesArray(score%10);
	var tensPlace = parseInt(score/10);
	if(tensPlace > 0)
		tensPieces = GetPiecesArray(parseInt(score/10));
	else
		tensPieces = new Array(false,false,false,false,false,false,false);
	
	var UpdateNumber = function (elem, piecesArr) {
		var childIdx = 0;
		for(var i=0;i<piecesArr.length;i++) {
			while(elem.childNodes[childIdx] && elem.childNodes[childIdx].nodeName.toUpperCase() != "IMG")
				childIdx++;
			if(!elem.childNodes[childIdx])
				break;
			if(piecesArr[i]) {
				elem.childNodes[childIdx].style.display="inline";
			} else {
				elem.childNodes[childIdx].style.display="none";
			}
			childIdx++;
		}
	}
	UpdateNumber(number1,tensPieces);
	UpdateNumber(number2,onesPieces);
}