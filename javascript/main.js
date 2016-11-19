"use strict";
/*jslint browser:true */
/*jslint node:true */

/**
 *  Pong main entry script
 *  @author Pere Crespo <pedcremo@iestacio.com>
 *  @version 0.0.1
 */

/** Prototype where all game objects are present and could be accessed */
var singletonContext = require('./patterns/singleton/singletonContext');
/** Game utils */
var utils = require('./utils');

/** Once the page has been completely loaded. Including images. We start the game logic */
window.onload=function(){

    var GameContext_ = singletonContext.getInstance();

    var startOrStopGame=function(event){
        if (GameContext_.state.match("run")){
          GameContext_.stop();
        }else{
          GameContext_.start();
        }
    };
    /** We check if player has chosen a nickname(mandatory) and a Picture Profile (optional). We store them as cookie and LocalStorage respectively
     If there is not profile we can not start the game otherwise we can start or stop the game pressing any key */
    utils.checkIfProfileHasBeenDefined(function(){  window.addEventListener("keypress",startOrStopGame,false);});
    /** On windows resize event we restart context to resize and realocate game elements into the new viewport */
    window.onresize = function() {
        GameContext_.restart();
    };
};
