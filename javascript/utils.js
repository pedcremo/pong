/**
 *  Used to avoid image double click selection default behaviour
 */

"use strict";

/*function clearSelection() {
     if(document.selection && document.selection.empty) {
         document.selection.empty();
     } else if(window.getSelection) {
         var sel = window.getSelection();
         sel.removeAllRanges();
     }
 }*/

function setCookie(cname, cvalue, exdays) {
    if (cvalue && cvalue!== ""){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

function showPlayerProfile(){
  var user = getCookie("username");
  if (user && user!==""){
    var nicknameElement=document.getElementById("playerLeft");
    nicknameElement.innerHTML= user;
    var dataImage = localStorage.getItem('imgData');
    if (dataImage){
      var profileImg=document.createElement("img");
      profileImg.src = "data:image/png;base64," + dataImage;
      profileImg.width=48;
      profileImg.height=64;
      nicknameElement.parentNode.insertBefore(profileImg,nicknameElement);
    }
    return true;
  }else{
    return false;
  }
}

function checkIfProfileHasBeenDefined(addGameKeyBindings) {

    var user = getCookie("username");
    if (user !== "") {
        showPlayerProfile();
        addGameKeyBindings();
    } else {
        // Get the modal
        var modal = document.getElementById('myModal');
        document.getElementById('blah').style.display="none";
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            if (showPlayerProfile()){
              modal.style.display = "none";
              addGameKeyBindings();
            }
        };
        window.onclick = function(event) {
          if (event.target == modal) {
            if (showPlayerProfile()){
              modal.style.display = "none";
              addGameKeyBindings();
            }
          }
        };
        modal.style.display = "block";

        var nickname = document.getElementById("nickname_");
        nickname.addEventListener("change",function(){setCookie("username", nickname.value, 365);});
        nickname.addEventListener("blur",function(){setCookie("username", nickname.value, 365);});
        nickname.addEventListener("focus",function(){setCookie("username", nickname.value, 365);});

        var imgProfile = document.getElementById("imgProfile");
        imgProfile.addEventListener("change",function(){readFileAndPreviewFromLocalFileSystem(this);});
    }
    document.getElementById("playerRight").innerHTML= "Computer";
}

//Encode an image using base64 previously to store it on LocalStorage
//Note: In HTML the img tag can load an image pointing src attribute to an URL or putting there the image in base64
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0,48,64);

    var dataURL = canvas.toDataURL("image/jpg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

//We convert before saving to base64
function saveImageToLocalStorage(){
  var bannerImage = document.getElementById('blah');
  var imgData = getBase64Image(bannerImage);
  localStorage.setItem("imgData", imgData);
}

//We choose a image profile from local system and we do a preview
function readFileAndPreviewFromLocalFileSystem(input) {
  if (input.files && input.files[0]) {
      document.getElementById('blah').style.display="block";
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("blah").src=e.target.result;
        saveImageToLocalStorage();
      };
      reader.readAsDataURL(input.files[0]);
  }
}

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

 //module.exports.clearSelection = clearSelection;
 module.exports.checkIfProfileHasBeenDefined = checkIfProfileHasBeenDefined;
