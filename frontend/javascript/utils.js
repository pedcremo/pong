"use strict";
/*jslint browser:true */
/*jslint node:true */
/*global $ */

/**
 * Utils module.
 * @module utils
 * @see module:utils
 */

//var singleContext = require('./patterns/singleton/singletonContext');
var main = require('./main');

function setCookie(cname, cvalue, exdays) {
    if (cvalue && cvalue!== ""){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

function getModalTemplate(idTemplate,callback){
  //If exists in the DOM tree we don't call via ajax again
  if ($('#'+idTemplate).length){
      $('#'+idTemplate).show();
      callback($('#'+idTemplate));
  }else{
      $.ajax({
            url: "template/"+idTemplate,
            type: 'GET',
            success: function(data){
                $('body').append(data);
                $('#'+idTemplate).fadeIn("slow");
                callback($('#'+idTemplate));
            },
            error: function(data) {
                console.log('woops ERROR calling! '+idTemplate); //or whatever
            }
        });
   }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Show nickname name and/or image if profile has been defined
 * @returns {Boolean}
 */

function showPlayerProfile(){
  var user = getCookie("username");
  if (user && user!==""){
    //var $nicknameElement=$("#playerLeft"); EXAM LEAVE
    //$nicknameElement.text(user);EXAM LEAVE
    var dataImage = localStorage.getItem('imgData');
    if (dataImage){
      var $profile=$('#profileImg');
      $profile.css("position","absolute").hide();//EXAM
      $profile.attr("src","data:image/jpg;base64," + dataImage).width(48).height(64);
      //$("body").prepend($profileImg); EXAM LEAVE
    }
    return true;
  }else{
    return false;
  }
}

/** Check if there is a cookie and/or image profile defined to identify user. If not we force definition */
function checkIfProfileHasBeenDefined(callBackFunction) {

    var user = getCookie("username");

    if (user !== "") {
        showPlayerProfile();
        callBackFunction();
    } else {
        getModalTemplate("modal-player-profile",function($template){
            $("#blah").hide();
            //$(document,".close:first").click(function(){
            $(".close:first").off("click").on("click",function(){
              if (showPlayerProfile()){
                $template.hide();
                callBackFunction();
              }
            });
            var $nickname = $("#nickname_");
            $nickname.on('change blur focus',function(){
              setCookie("username", $nickname.val(), 365);
            });

            $("#imgProfile").change(function(){
              readFileAndPreviewFromLocalFileSystem(this);
            });

        });

    }
    //$("#playerRight").text("Computer");
}

//Encode an image using base64 previously to store it on LocalStorage
//Note: In HTML the img tag can load an image pointing src attribute to an URL or putting there the image in base64
function getBase64Image(img) {

    var $canvas = $("<canvas/>").attr("width",img.width).attr("height",img.height);

    var ctx = $canvas[0].getContext("2d");
    ctx.drawImage(img, 0, 0,48,64);
    var dataURL = $canvas[0].toDataURL("image/jpg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
//We convert before saving to base64
function saveImageToLocalStorage(){
  var imgData = getBase64Image($('#blah')[0]);
  localStorage.setItem("imgData", imgData);
}

//We choose a image profile from local system and we do a preview
function readFileAndPreviewFromLocalFileSystem(input) {
  if (input.files && input.files[0]) {
      $('#blah').show();
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#blah').attr('src',e.target.result);
        saveImageToLocalStorage();
      };
      reader.readAsDataURL(input.files[0]);
  }
}
function chooseGameMode(context_){
    if (!context_) context_ = main.singletonContext.getInstance(); //EXAM
    getModalTemplate("modal-game-mode",function($template){
        $template.find("#single").on("click",function(){
            if (context_ && context_.state === "stop") context_.start();
            else context_.resetScores();//EXAM
            $template.fadeOut("slow");
        });
    });
}

/** Before start any game we check if user has defined a profile. */
 module.exports.checkIfProfileHasBeenDefined = checkIfProfileHasBeenDefined;
 module.exports.getModalTemplate = getModalTemplate;
 module.exports.chooseGameMode = chooseGameMode;
 module.exports.getCookie = getCookie;
