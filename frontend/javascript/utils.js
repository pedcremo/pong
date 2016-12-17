"use strict";
/*jslint browser:true */
/*jslint node:true */
/*global $ */

/**
 * Utils module.
 * @module utils
 * @see module:utils
 */

function setCookie(cname, cvalue, exdays) {
    if (cvalue && cvalue!== ""){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

function getModalTemplate(idTemplate,callback){
  $.get("template/"+idTemplate,function(data,status){
          $('body').append(data);
          $('#'+idTemplate).show();
          callback($('#'+idTemplate));
  });
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
    var $nicknameElement=$("#playerLeft");
    $nicknameElement.text(user);
    var dataImage = localStorage.getItem('imgData');
    if (dataImage){
      var $profileImg=$("<img/>");
      $profileImg.attr("src","data:image/jpg;base64," + dataImage).width(48).height(64);
      $("body").prepend($profileImg);
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
                console.log("Merdaaaa");
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
    $("#playerRight").text("Computer");
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
/** Before start any game we check if user has defined a profile. */
 module.exports.checkIfProfileHasBeenDefined = checkIfProfileHasBeenDefined;
 module.exports.getModalTemplate = getModalTemplate;
