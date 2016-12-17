
//Stubbing socket.io
/*var socket = function(){};
socket.prototype = {
        on: function(message,functionObject){
            return true;
        },
        emit: function(object,object){
                return true;
        }
};
function io(){
    return new socket();
}*/

// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Context testing bench', function() {

  // inject the HTML fixture for the tests
  beforeEach(function() {
    var fixture = '<div id ="fixture"><img id="bola" style="position:absolute" src="images/squareWhite.png" />'+
    '<img id="stickLeft" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerLeft"></h2>'+
    '<p id="scorePlayerLeft">0</p>'+
    '<img id="stickRight" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerRight">v</h2>'+
    '<p id="scorePlayerRight">0</p><div id="vertical"></div>'+
    '<div id="banner" style="display:none"></div></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);


    var context = require('../frontend/javascript/context');
    this.context_ = new context();
    jasmine.clock().install();
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
    jasmine.clock().uninstall();
  });


  it('Banners methods (hideBanner and showBanner) are present', function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(this.context_.hideBanner).toBeDefined();
    expect(this.context_.showBanner).toBeDefined();
  });

  it('hideBanner works properly', function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    var bannerElement = document.getElementById("banner");
    expect(bannerElement.style.display).toEqual("none");
    bannerElement.style.display ="block";
    expect(bannerElement.style.display).not.toEqual("none");
    this.context_.hideBanner();
    expect(bannerElement.style.display).toEqual("none");
  });

  it('showBanner works properly and display a message in the expected expiring time', function() {
    this.context_.hideBanner();
    this.context_.showBanner("Dummy message",5);
    var bannerElement = document.getElementById("banner");
    expect(bannerElement.style.display).not.toEqual("none");
    expect(bannerElement.innerHTML).toEqual("Dummy message");
    jasmine.clock().tick(6);
    expect(bannerElement.style.display).toEqual("none");
  });

  it('showbanner after 0 ms that mean until is hidden',function() {
      this.context_.hideBanner();
      this.context_.showBanner("Dummy message2",0);
      var bannerElement = document.getElementById("banner");
      jasmine.clock().tick(13);
      expect(bannerElement.style.display).not.toEqual("none");
  });

  it('Speed increasing mechanism defined',function(){
    expect(this.context_.increaseSpeed).toBeDefined();
    expect(this.context_.incSpeed).toEqual(0);
  });
  it('Speed increase works',function(){
    this.context_.increaseSpeed();
    expect(this.context_.incSpeed).toEqual(0.1);
  });

});
