/* Remember! Modify velocities, not positions! */

function ProcessAI1() {
	if(controllingPaddle != 1) {
		if(ballVx < 0 && ballX+(BALLDIAMETER/2) < WIDTH/2) {
			// move towards the ball
			// for now, try to get the paddle centered at the ball
			if(ballY+(BALLDIAMETER/2) != paddle1Y+(PADDLEHEIGHT/2)) {
				var timeTilCollision = ((PADDLEOFFSET+PADDLEWIDTH) - ballX) / (ballVx);
				var distanceWanted = (paddle1Y+(PADDLEHEIGHT/2)) - (ballY+(BALLDIAMETER/2));
				var velocityWanted = -distanceWanted / timeTilCollision;
				if(velocityWanted > PADDLEMAXSPEED)
					paddle1Vy = PADDLEMAXSPEED;
				else if(velocityWanted < -PADDLEMAXSPEED)
					paddle1Vy = -PADDLEMAXSPEED;
				else
					paddle1Vy = velocityWanted;
			} else {
				paddle1Vy = 0;
			}
		} else {
			paddle1Vy = 0;
		}
	} else
		paddle1Vy = 0;
}

function ProcessAI2() {
	if(controllingPaddle != 2) {
		if(ballVx > 0 && ballX+(BALLDIAMETER/2) > WIDTH/2) {
			// move towards the ball
			// for now, try to get the paddle centered at the ball
			if(ballY+(BALLDIAMETER/2) != paddle2Y+(PADDLEHEIGHT/2)) {
				var timeTilCollision = ((WIDTH-PADDLEOFFSET-PADDLEWIDTH) - ballX) / (ballVx);
				var distanceWanted = (paddle2Y+(PADDLEHEIGHT/2)) - (ballY+(BALLDIAMETER/2));
				var velocityWanted = -distanceWanted / timeTilCollision;
				if(velocityWanted > PADDLEMAXSPEED)
					paddle2Vy = PADDLEMAXSPEED;
				else if(velocityWanted < -PADDLEMAXSPEED)
					paddle2Vy = -PADDLEMAXSPEED;
				else
					paddle2Vy = velocityWanted;
			} else {
				paddle2Vy = 0;
			}
		} else
			paddle2Vy = 0;
	}
}