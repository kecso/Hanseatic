/**
 * @author kecso / https://github.com/kecso
 */
//isTileFree
function (game, tileId) {
    var pieces = game.getAllPieces(),
        i;
    for (i = 0; i < pieces.length; i += 1) {
        if (pieces[i].on === tileId) {
            return false;
        }
    }
    return true;
}

//placePiece
function (game, position) {
    var myPieces = game.getMyPieces(),
        i;

    for (i = 0; i < myPieces.length; i += 1) {
        if (myPieces[i].on === null) {
            myPieces[i].put(position);
            return;
        }
    }
}

//winCondition
function (game) {
    var stringBoard = game.getStringBoard(),
        i;

    if ((stringBoard[0] === 'X' && stringBoard[1] === 'X' && stringBoard[2] === 'X') ||
        (stringBoard[3] === 'X' && stringBoard[4] === 'X' && stringBoard[5] === 'X') ||
        (stringBoard[6] === 'X' && stringBoard[7] === 'X' && stringBoard[8] === 'X') ||
        (stringBoard[0] === 'X' && stringBoard[3] === 'X' && stringBoard[6] === 'X') ||
        (stringBoard[1] === 'X' && stringBoard[4] === 'X' && stringBoard[7] === 'X') ||
        (stringBoard[2] === 'X' && stringBoard[5] === 'X' && stringBoard[8] === 'X') ||
        (stringBoard[0] === 'X' && stringBoard[4] === 'X' && stringBoard[8] === 'X') ||
        (stringBoard[2] === 'X' && stringBoard[4] === 'X' && stringBoard[6] === 'X')) {
        game.getPlayerByName('P1').won();
        return;
    }

    if ((stringBoard[0] === 'X' && stringBoard[1] === 'X' && stringBoard[2] === 'X') ||
        (stringBoard[3] === 'X' && stringBoard[4] === 'X' && stringBoard[5] === 'X') ||
        (stringBoard[6] === 'X' && stringBoard[7] === 'X' && stringBoard[8] === 'X') ||
        (stringBoard[0] === 'X' && stringBoard[3] === 'X' && stringBoard[6] === 'X') ||
        (stringBoard[1] === 'X' && stringBoard[4] === 'X' && stringBoard[7] === 'X') ||
        (stringBoard[2] === 'X' && stringBoard[5] === 'X' && stringBoard[8] === 'X') ||
        (stringBoard[0] === 'X' && stringBoard[4] === 'X' && stringBoard[8] === 'X') ||
        (stringBoard[2] === 'X' && stringBoard[4] === 'X' && stringBoard[6] === 'X')) {
        game.getPlayerByName('P2').won();
        return;
    }

    for (i = 0; i < 9; i += 1) {
        if (stringBoard[i] === '') {
            return;
        }
    }
    game.ended();
}