// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Stick testing bench', function() {

  // inject the HTML fixture for the tests
  beforeEach(function() {
    var fixture = '<div id ="fixture"><img id="bola" style="position:absolute" src="images/squareWhite.png" />'+
    '<img id="stick" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerLeft"></h2>'+
    '<p id="scorePlayerLeft">0</p>'+
    '<img id="stick2" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerRight">v</h2>'+
    '<p id="scorePlayerRight">0</p>'+
    '<div id="vertical"></div></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
    //In this contextmock socket is a real socket.io object  
    this.contextMock = {'viewPortWidth':200,'viewPortHeight':200,'socket':io()};
    var stick = require('../frontend/javascript/stick');
    this.stick_ = new stick("stick","left",this.contextMock,false);
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });


  it('has a dummy spec to test 2 + 2', function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(2+2).toEqual(4);
  });
  it('Testing Stick constructor', function() {
    expect(this.stick_.score).toEqual(0);
    expect(this.stick_.sideLocation).toEqual('left');
    expect(this.stick_.Update).toBeDefined();
    expect(this.stick_.imageStickView.height).toBeGreaterThan(0);
  });
  it('Testing Stick locate and getPosition', function() {
    var stickPosition = this.stick_.getPosition();
    expect(stickPosition.x).toBeLessThan(200);
    expect(stickPosition.y).toBeLessThan(200);

    this.stick_.locate(50,70);
    stickPosition = this.stick_.getPosition();
    expect(stickPosition.x).toEqual(50);
    expect(stickPosition.y).toEqual(70);

    //If stick get out of boundaries on Y axe we dont allow it
    this.stick_.locate(50,this.contextMock.viewPortHeight+70);
    stickPosition = this.stick_.getPosition();
    expect(stickPosition.y).toEqual(this.contextMock.viewPortHeight-this.stick_.imageStickView.height);
  });

  it('Testing Stick score', function() {
    this.stick_.increaseScore();
    expect(this.stick_.score).toEqual(1);
    this.stick_.increaseScore();
    this.stick_.increaseScore();
    expect(this.stick_.score).toEqual(3);
  });
  it('Testing Stick rescale', function() {
  });
});
