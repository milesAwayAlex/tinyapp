# TinyApp Project

TinyApp is an almost-full-stack (without persistent database) web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Screenshots

!["See your shortened URLs"](https://raw.githubusercontent.com/milesAwayAlex/tinyapp/main/docs/url-list.png)

!["Easily shorten moar URLs"](https://raw.githubusercontent.com/milesAwayAlex/tinyapp/main/docs/new-url.png)

## Instructions

- Clone the repository - `git clone https://github.com/milesAwayAlex/tinyapp.git`
- Open the app directory - `cd tinyapp`
- Install the dependencies - `npm install`
- Run the tests - `npm test`
- Run the server in developement mode (with nodemon watching for changes and restarting) - `npm run serve`
- Run the server in normal mode - `npm start`

## Dependencies

- Node.js
- Express
- morgan
- nanoid
- EJS
- bcryptjs
- body-parser
- cookie-session

## Testing Dependencies

- chai
- chai-http
- mocha
- nodemon
