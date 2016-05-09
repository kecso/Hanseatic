# Hanseatic
A game marketplace, creation, and play environment.
You can find the classic games here, or you can create your own, and let your friends play with it!

## setup
To be able to run your server on your machine you need to have, nodejs, npm, mongoDB, and webpack.
* download the repo
* in the main directory run npm install
* from the main directory execute 'node utils/initHanseatic.js' to make necessary configurations
* run the webpack to make your client code bundled
* start your server with 'node src/server/index.js'
* go to http://localhost:9091 and start discovering the world of HANSEATIC


##userStories
The aim of the project is to implement a system that can allow users the following functionalities:
* A user after registration can log in and initiate any game that is available on the server.
* The user after login will be able connect to any starting games.
* A user can create a game where she/he can define the board, the pieces, the rules and the winning criteria fo the game.
* A user after finishing a game creation, can make it available to every other user to play
* A user will be able to check recent games (step-by-step tracking) from the archive

##futurePlans
We list here those features that would be nice to have in the long run, to make hanseatic even mora appealing to everybody!
* If the HanseaticGame language evolves it could be possible to define AI for every game, so it would be possible to play against bots.
* The language can expand in a way that it will be able to describe not only board based games, but more 'complicated' ones as well.

##contact information
If you have questions or would like to contribute, send an e-mail to tamas.kecskes@vanderbilt.edu or create an issue.
