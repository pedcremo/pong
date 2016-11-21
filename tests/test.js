// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Users factory', function() {
  it('has a dummy spec to test 2 + 2', function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(2+2).toEqual(4);
  });
  it('has a dummy spec to test MERDA', function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect("MERDA").toEqual("MERDA");

    var context = require('../frontend/javascript/context');
    var context_ = new context();
    //expect(context_.ball.speed).toEqual(1.4);
  });
});
