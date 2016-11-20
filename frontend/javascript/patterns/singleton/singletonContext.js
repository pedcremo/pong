"use strict";

/*jslint browser:true */
/*jslint node:true */

/**
 *  Singleton pattern aplied to context
 */
var context = require('./../../context');

var SingletonContext = (function () {
    var instance;

    function createInstance() {
        var object = new context();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = SingletonContext;
