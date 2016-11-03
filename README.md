PONG game using javascript and nodeJS with require
==================================================

We are going to implement PONG. First console game in history
Take a look at http://www.ponggame.org/

In order to run for first time the project , you should:

1. Run `npm install` in the provided sample code
2. Start gulp using `./node_modules/gulp/bin/gulp.js watch` (with this task executed on background, every time we do a change on every single script inside javascript folder this will be automatically transpiled to bin/main.js the only javascript file included in our deployed webapp project )


```

Note that every time we change any .js and we don't have watch gulp task on execution we should "transpile" using:

frontend$ ./node_modules/gulp/bin/gulp.js browserify

Result will be  bin/index.js file embedding all project .js

We are using nodeJS ecosystem in this project in an unusual way. Only for client web development. Using requirejs useful module to be able to architect our project in a morescalable way.
