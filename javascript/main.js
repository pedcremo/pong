/**
 * Our app is a closure
 *
 *
 */
//(function () {
    var artifact = require('./artifact');
    var utils = require('./utils');
    var stick = require('./stick');

    var vpWidth=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var vpHeight=window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


           window.onload=function(){
                var artifact_ = new artifact("bola");
                var stick_ = new stick("stick","right");
                artifact_.vpWidth=vpWidth;
                artifact_.vpHeight=vpHeight;
                artifact_.locate((vpWidth/2)-artifact_.imgObj.width,(vpHeight/2)-artifact_.imgObj.height);  //Posicionem pilota al mig

                var controlFunction=function(event){
                    event.preventDefault();
                    utils.clearSelection();
                    if (artifact_.state.match("run")) {
                        artifact_.state="stop";
                        artifact_.stop();
                    }else{
                        switch (event.type){
                            case "dblclick":
                                if (artifact_.state !== "run"){
                                    artifact_.state="run";
                                    artifact_.setDirection("NORTH_WEST");
                                }
                                break;
                            case "click":
                                if (artifact_.state !== "runvertical"){
                                    artifact_.state="runvertical";
                                    artifact_.setDirection("NORTH");
                                }
                                break;
                            default:
                                if (artifact_.state !== "runhorizontal"){
                                    artifact_.state="runhorizontal";
                                    artifact_.setDirection("WEST");
                                }
                                break;
                        }
                        artifact_.start();
                    }
                };

                window.addEventListener("dblclick",controlFunction,false);
                window.addEventListener("click",controlFunction,false);
                window.addEventListener("keypress",controlFunction,false);

            };
//})();
