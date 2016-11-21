# PONG game using javascript and nodeJS with require

## Introduction
We are going to implement PONG. One of first console games in history
Take a look at [www.ponggame.org](http://www.ponggame.org/)

We are using nodeJS ecosystem in this project in an unusual way. Mostly focused on client side web development. We use requirejs module very useful in order to architect our project in a more scalable way.

LIVE DEMO: https://pong2.herokuapp.com/

## Run the project
In order to run for first time the project , you should install nodejs and npm in your computer:

1. Run `npm install` in the provided sample code
2. Browserify your code `./node_modules/gulp/bin/gulp.js browserify` this is going to create the only required javascript file on bin/main.js
3. If we are going to change the project regularly it is recommended to launch `./node_modules/gulp/bin/gulp.js watch` .With this task executed on background, every time we do a change on every single script inside javascript folder this will be automatically transpiled to bin/main.js.
4. Launch local server `node backend/index.js` and open [http://localhost:3000]

** Note ** that every time we change any .js and we don't have watch gulp task on execution we should "transpile" manually executing:

`frontend$ ./node_modules/gulp/bin/gulp.js browserify`

Resulting file will be in bin/index.js embedding all project .js

NOTE: Deploy the webapp on a web server. The minimum files required to run the project are:
bin/main.js
images/**
styles/**
index.html

The other files are only required for development purposes

## Run the tests

`./node_modules/gulp/bin/gulp.js tdd`

## Generate project documentation

`./node_modules/gulp/bin/gulp.js doc`


## Deploy project automatically to heroku
Everytime we do a push to master branch on github DEMO: https://pong2.herokuapp.com/ gets updated with latest changes. We have created an app on heroku and We've linked to our gitthub repository.

##TODO

NICE TO READ: https://www.devbridge.com/articles/dependency-injection-in-javascript/
