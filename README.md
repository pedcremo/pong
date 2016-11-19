# PONG game using javascript and nodeJS with require

## Introduction

We are going to implement PONG. One of first console games in history
Take a look at [www.ponggame.org](http://www.ponggame.org/)

We are using nodeJS ecosystem in this project in an unusual way. Only for client web development. We use requirejs module very useful in order to architect our project in a more scalable way.

## Run the project
In order to run for first time the project , you should:

1. Run `npm install` in the provided sample code
2. Start gulp using `./node_modules/gulp/bin/gulp.js watch` (with this task executed on background, every time we do a change on every single script inside javascript folder this will be automatically transpiled to bin/main.js the only javascript file included in our deployed webapp project )

** Note ** that every time we change any .js and we don't have watch gulp task on execution we should "transpile" manually executing:

`frontend$ ./node_modules/gulp/bin/gulp.js browserify`

Result will be  bin/index.js file embedding all project .js

## Run the tests

`./node_modules/gulp/bin/gulp.js tdd`

## Generate project documentation

`./node_modules/gulp/bin/gulp.js doc`
