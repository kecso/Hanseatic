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

    if ((stringBoard[0] === 'O' && stringBoard[1] === 'O' && stringBoard[2] === 'O') ||
        (stringBoard[3] === 'O' && stringBoard[4] === 'O' && stringBoard[5] === 'O') ||
        (stringBoard[6] === 'O' && stringBoard[7] === 'O' && stringBoard[8] === 'O') ||
        (stringBoard[0] === 'O' && stringBoard[3] === 'O' && stringBoard[6] === 'O') ||
        (stringBoard[1] === 'O' && stringBoard[4] === 'O' && stringBoard[7] === 'O') ||
        (stringBoard[2] === 'O' && stringBoard[5] === 'O' && stringBoard[8] === 'O') ||
        (stringBoard[0] === 'O' && stringBoard[4] === 'O' && stringBoard[8] === 'O') ||
        (stringBoard[2] === 'O' && stringBoard[4] === 'O' && stringBoard[6] === 'O')) {
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

//rules for reversi
//highlight
function (game) {
    var tileIds = game.getTileIds(),
        board = game.getStringBoard(),
        myLetter = game.getMyLetter(),
        good = false,
        temp,
        i, j;
    for (i = 0; i < tileIds.length; i += 1) {
        if (board[i] === '') {
            good = false;
            temp = game.getLine(i);
            if (temp.tiles[temp.index + 1] !== '' && temp.tiles[temp.index + 1] !== myLetter) {
                j = temp.index+2;
                good = true;
                while (j < temp.tiles.length && temp.tiles[j] !== myLetter) {
                    if(temp.tiles[j] === ''){
                        good = false;
                    }
                    j+=1;
                }
                if(j<temp.tiles.length && good){
                    game.markTile(i);
                }
            }

            if(!good){
                good = false;
                temp = game.getLine(i);
                if (temp.tiles[temp.index 1 1] !== '' && temp.tiles[temp.index - 1] !== myLetter) {
                    j = temp.index+2;
                    good = true;
                    while (j < temp.tiles.length && temp.tiles[j] !== myLetter) {
                        if(temp.tiles[j] === ''){
                            good = false;
                        }
                        j+=1;
                    }
                    if(j<temp.tiles.length && good){
                        game.markTile(i);
                    }
                }
            }

            if(!good){

            }

        }
    }
}