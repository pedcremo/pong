var BOUNCECONTROLLER = BOUNCECONTROLLER || {};

BOUNCECONTROLLER = {
  lastAngle:0,
  indexBresenham:0,
  bresenhamCoordinates:[],
  gameContext:{}
}

BOUNCECONTROLLER.getNextPoint = function(){
  BOUNCECONTROLLER.indexBresenham+=BOUNCECONTROLLER.gameContext.ball.speed;
  if (BOUNCECONTROLLER.indexBresenham <= (BOUNCECONTROLLER.bresenhamCoordinates.length -1)  ){
      return BOUNCECONTROLLER.bresenhamCoordinates[BOUNCECONTROLLER.indexBresenham];
  }else{
      return BOUNCECONTROLLER.bresenhamCoordinates[(BOUNCECONTROLLER.bresenhamCoordinates.length -1)];
  }
};

//Ranges allowed 10-60 degrees,120-170 degrees,190-240 degrees or 300-350 degrees
//If the angle is not in the allowed angle range we make a round
function checkAngle(angle){
  var newAngle = angle;
  if (angle >60 && angle <120){
      (120-angle) < 30 ? newAngle = 120:newAngle = 60;
  }
  if (angle >170 && angle <190){
      (190-angle) < 10 ? newAngle = 190:newAngle = 170;
  }
  if (angle >240 && angle <300){
      (300-angle) < 30 ? newAngle = 300:newAngle = 240;
  }
  if (angle >=0 && angle <10){
      newAngle = 10;
  }
  if (angle >350 && angle <=360){
      newAngle = 350;
  }
  return newAngle;
}

BOUNCECONTROLLER.recalculatePath = function(stickCollision,angleCorrection){
  var GameContext_ = BOUNCECONTROLLER.gameContext;
  //var angleCorrection = 25;
  var startPoint = GameContext_.ball.getPosition();
  if (stickCollision){
      BOUNCECONTROLLER.lastAngle = reflection(GameContext_.ball.getPosition(),checkAngle(BOUNCECONTROLLER.lastAngle+angleCorrection),stickCollision);
  }else{
      BOUNCECONTROLLER.lastAngle = reflection(GameContext_.ball.getPosition(),BOUNCECONTROLLER.lastAngle,stickCollision);
  }
  GameContext_.ball.angleDirection = BOUNCECONTROLLER.lastAngle;
  var endPoint= getEndPoint(startPoint,BOUNCECONTROLLER.lastAngle);
  BOUNCECONTROLLER.bresenhamCoordinates = calcStraightLine(startPoint,endPoint);
  BOUNCECONTROLLER.indexBresenham = 0;
};

//Ranges allowed 10-60 degrees,120-170 degrees,190-240 degrees or 300-350 degrees
BOUNCECONTROLLER.getDepartureRandomAngle = function(){
    var option = Math.floor((Math.random() * 4) + 1);
    var result=0;
    switch (option){
        case 1:  result=Math.floor((Math.random() * 50) + 10);
            break;
        case 2:  result=Math.floor((Math.random() * 50) + 120);
            break;
        case 3:  result=Math.floor((Math.random() * 50) + 190);
            break;
        default:
            result=Math.floor((Math.random() * 50) + 300);
            break;
    }
    console.log(result+" degrees");
    BOUNCECONTROLLER.lastAngle = result;
    BOUNCECONTROLLER.recalculatePath();
    //return result;
};

function reflection(referencePoint,angle,stickCollision){
    var reflectionAngle = (360 - angle); //If we bounce top or bottom edge

    if ((referencePoint.x === 0) || (referencePoint.x === BOUNCECONTROLLER.gameContext.viewPortWidth) || stickCollision){
      if (angle >=0 && angle <=180 ) reflectionAngle = (180 - angle);
      else reflectionAngle = (270 - (angle-270));
    }
    
    return reflectionAngle;
}

//Bresenham algorithm
function calcStraightLine (startCoordinates, endCoordinates) {
  var coordinatesArray = []; // new Array();
  // Translate coordinates
  var x1 = startCoordinates.x;
  var y1 = startCoordinates.y;
  var x2 = endCoordinates.x;
  var y2 = endCoordinates.y;
  // Define differences and error check
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
  // Set first coordinates
  coordinatesArray.push({y:y1,x:x1});
  // Main loop
  while (!((x1 == x2) && (y1 == y2))) {
    var e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
    // Set coordinates
    coordinatesArray.push({y:y1,x:x1});
  }
  // Return the result
  return coordinatesArray;
}

function getTanDeg(deg) {
  var rad = deg * Math.PI/180;
  return Math.tan(rad);
}

function getEndPoint(_startPoint,angle){
    var c2 = 0;
    var c1 = 0;

    //First we calculate base catet (c2) because we are suposing we are bouncing top or bottom edges and
    //we know C1 . If we discover C2 value is wrong then we know we are really bouncing left or right edge and
    //we know C2 and we should calculate C1
    var umbral = 0;
    if (angle>=90 && angle <=270){
        umbral = Math.abs(_startPoint.x);
    }else{
        umbral = Math.abs(BOUNCECONTROLLER.gameContext.viewPortWidth-_startPoint.x);
    }
    if (angle>=0 && angle <=180){
        c2 = _startPoint.y/getTanDeg(angle);
    }else{
        c2 = (BOUNCECONTROLLER.gameContext.viewPortHeight -_startPoint.y)/getTanDeg(angle);
    }

    if ((Math.abs(c2) > umbral) || (c2 == 0)) {
        var c1 = getTanDeg(angle)* Math.abs(BOUNCECONTROLLER.gameContext.viewPortWidth-_startPoint.x);
        if ((angle >= 0 && angle <=90) || (angle >= 270 && angle <=360)) {
            startPoint = {x:BOUNCECONTROLLER.gameContext.viewPortWidth, y:Math.round(_startPoint.y-c1)};
        }else{
            c1 = getTanDeg(angle)* Math.abs(_startPoint.x);
            startPoint = {x:0, y:Math.round(_startPoint.y+c1)};
        }
    }else{
        if (angle >=180 && angle <=360){
            startPoint = {x:Math.round(_startPoint.x-c2),y:BOUNCECONTROLLER.gameContext.viewPortHeight};
        }else{
            startPoint = {x:Math.round(_startPoint.x+c2),y:0};
        }
    }
    return startPoint;
}

 module.exports.bounceController = BOUNCECONTROLLER;
