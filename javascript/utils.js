/**
 *  Used to avoid image double click selection default behaviour
 */

"use strict";

function clearSelection() {
     if(document.selection && document.selection.empty) {
         document.selection.empty();
     } else if(window.getSelection) {
         var sel = window.getSelection();
         sel.removeAllRanges();
     }
 }

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
      profileImg.width=100;
      profileImg.height=100;
      nicknameElement.parentNode.insertBefore(profileImg,nicknameElement);
    }
    return true;
  }else{
    return false;
  }
}

function checkCookie(addGameKeyBindings) {

    var user = getCookie("username");
    if (user !== "") {
        showPlayerProfile();
        addGameKeyBindings();
    } else {
        // Get the modal
        var modal = document.getElementById('myModal');
        document.getElementById('blah').style.display="none";
        document.getElementById('blah_2').style.display="none";
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
        //bloquea el modal
        modal.style.display = "block";

        //mete evenetos en el nickname 
        var nickname = document.getElementById("nickname_");
        nickname.addEventListener("change",function(){setCookie("username", nickname.value, 365);});
        nickname.addEventListener("blur",function(){setCookie("username", nickname.value, 365);});
        nickname.addEventListener("focus",function(){setCookie("username", nickname.value, 365);});

        //coge la imagen del html file
        var imgProfile = document.getElementById("imgProfile");
        //si cambia utiliza lafuncion readurl
        imgProfile.addEventListener("change",function(){readURL(this);});
    }
    document.getElementById("playerRight").innerHTML= "Computer";
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/jpg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function save(){
    //aqui guardardamos la imagen oculta
  var bannerImage = document.getElementById('blah');
  var imgData = getBase64Image(bannerImage);
  localStorage.setItem("imgData", imgData);
}

function readURL(input) {
    
  if (input.files && input.files[0]) {
      
      //mostramos la foto escogida
      document.getElementById('blah_2').style.display="block";
      var reader = new FileReader();
      reader.onload = function (e) {
          
        //mete la foto en los elementos
        document.getElementById("blah").src=e.target.result;  
        document.getElementById("blah_2").src=e.target.result;
        //
          //$('#blah').attr('src', e.target.result);
          
          //utiliza una funciona save para guardar la imagen en local storage
          save();
      };
      reader.readAsDataURL(input.files[0]);
  }
}

 module.exports.clearSelection = clearSelection;
 module.exports.checkCookie = checkCookie;
