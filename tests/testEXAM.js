// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('TEST 2nd DAW', function() {
    var audioOriginal, audioMock;
    var context;
  // inject the HTML fixture for the tests
  beforeEach(function() {

    $.get("http://localhost:3000/template/game-over",function(data,status){
        document.body.insertAdjacentHTML(
          'afterbegin',
          data);
         done();
    });

    var fixture = '<div id ="fixture"><img id="profileImg"  src="images/squareWhite.png" /> '+
    '<img id="bola" style="position:absolute" src="images/squareWhite.png" />'+
    '<img id="stickLeft" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerLeft"></h2>'+
    '<p id="scorePlayerLeft">0</p>'+
    '<img id="stickRight" style="position:absolute" src="images/stickWhite.png" />'+
    '<h2 id="playerRight">v</h2>'+
    '<p id="scorePlayerRight">0</p>'+
    '<div id="vertical"></div></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);

    audioOriginal = window.Audio;
    audioMock = {play:function(){},pause:function(){}};
    window.Audio = function() { return audioMock; };

    context = require('../frontend/javascript/context');
    this.context_ = new context();

    jasmine.clock().install();
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
    window.Audio = audioOriginal;
    jasmine.clock().uninstall();
  });


  it('1. If stick is in autopilot mode profile nickname should be "PC RIGHT" or "PC LEFT" otherwise stored cookie nickname (3 points)', function() {
    expect(this.context_.stickLeft.setAutopilot).toBeDefined();
    expect(this.context_.stickRight.setAutopilot).toBeDefined();

    if (this.context_.stickLeft.autopilot){
        expect($("#playerLeft").text()).toEqual("PC LEFT");
        this.context_.stickLeft.setAutopilot(false);
        expect($("#playerLeft").text()).not.toEqual("PC LEFT");
    }else{
        expect($("#playerLeft").text()).not.toEqual("PC LEFT");
        this.context_.stickLeft.setAutopilot(true);
        expect($("#playerLeft").text()).toEqual("PC LEFT");
    }

    if (this.context_.stickRight.autopilot){
        expect($("#playerRight").text()).toEqual("PC RIGHT");
        this.context_.stickRight.setAutopilot(false);
        expect($("#playerRight").text()).not.toEqual("PC RIGHT");
    }else{
        expect($("#playerRight").text()).not.toEqual("PC RIGHT");
        this.context_.stickRight.setAutopilot(true);
        expect($("#playerRight").text()).toEqual("PC RIGHT");
    }

    this.context_.stickRight.setAutopilot(true);
    this.context_.stickLeft.setAutopilot(true);
    expect($("#profileImg").is(":visible")).toBe(false);
    this.context_.stickLeft.setAutopilot(false);
    expect($("#profileImg").is(":visible")).toBe(true);
    this.context_.stickLeft.setAutopilot(true);
    expect($("#profileImg").is(":visible")).toBe(false);
    this.context_.stickRight.setAutopilot(false);
    expect($("#profileImg").is(":visible")).toBe(true);

  });

  it("2. Scores font-size should be proportional to viewPort height. Exactly 20% (1 point)", function(){
      spyOn(context.prototype, 'restart');
      this.context_.restart();
      expect(context.prototype.restart).toHaveBeenCalled();
      expect(parseInt($("#scorePlayerRight").css("font-size"))).not.toBeLessThan(Math.floor(this.context_.viewPortHeight*0.2));
  });

  it("3. Play a sound when ball bounce on any paddle (1 point)", function(){
      var ball = this.context_.ball;
      expect(ball.bounceSound).toBeDefined();
      spyOn(ball.bounceSound,"play");
      ball.bounce();
      expect(ball.bounceSound.play).toHaveBeenCalled();
  });

  it("4. Play sound when point is lost(1 point)", function(){
       expect(this.context_.lostPointSound).toBeDefined();
      spyOn(this.context_.lostPointSound,"play");
      this.context_.increaseScore("left");
      expect(this.context_.lostPointSound.play).toHaveBeenCalled();
  });


  it("5. Game starts automatically, in fact just before we choose single player. Once we choose single mode we should restart scores (1 point)", function(){

      spyOn(context.prototype,"resetScores");
      spyOn($, "ajax").and.callFake(function(e) {
               e.success({});
      });

      var utils = require('../frontend/javascript/utils');
      utils.chooseGameMode(this.context_);

      expect(this.context_.state).toEqual("run");
      setTimeout(function(){
          expect($('#single').length).toBeGreaterThan(0);

          var spyEvent = spyOnEvent('#single', 'click');
          $('#single').trigger( "click" );

          expect('click').toHaveBeenTriggeredOn('#single');
        
      },1000) ;
      setTimeout(function(){

          expect(context.prototype.resetScores).toHaveBeenCalled();
      },4000);
  });

  it("6. Game over animation and show (2 points)", function(){
      expect(this.context_.gameOverSound).toBeDefined();
      spyOn(this.context_.gameOverSound,"play");
      expect(this.context_.gameOver).toBeDefined();
      this.context_.gameOver();
      expect(this.context_.gameOverSound.play).toHaveBeenCalled();

      setTimeout(function(){
          expect($('#game-over').length).toBeGreaterThan(0);
      },4000);
  });




});
