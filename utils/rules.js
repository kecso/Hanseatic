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
                j = temp.index + 2;
                good = true;
                while (j < temp.tiles.length && temp.tiles[j] !== myLetter) {
                    if (temp.tiles[j] === '') {
                        good = false;
                    }
                    j += 1;
                }
                if (j < temp.tiles.length && good) {
                    game.markTile(i);
                }
            }

            if (!good) {
                good = false;
                temp = game.getLine(i);
                if (temp.tiles[temp.index 1
                1
            ] !==
                '' && temp.tiles[temp.index - 1] !== myLetter
            )
                {
                    j = temp.index + 2;
                    good = true;
                    while (j < temp.tiles.length && temp.tiles[j] !== myLetter) {
                        if (temp.tiles[j] === '') {
                            good = false;
                        }
                        j += 1;
                    }
                    if (j < temp.tiles.length && good) {
                        game.markTile(i);
                    }
                }
            }

            if (!good) {

            }

        }
    }
}
function pieceAtCoordinate(coordinate) {
    return game.getAllPieceIdsOnTile(game.getTileIdOfCoordinate(coordinate)).length === 1;
}
function getRowOfCoordinate(coordinate) {
    if (coordinate >= 1 && coordinate <= 3) {
        return 1;
    }
    if (coordinate >= 4 && coordinate <= 6) {
        return 2;
    }
    if (coordinate >= 7 && coordinate <= 9) {
        return 3;
    }
    if (coordinate >= 10 && coordinate <= 18) {
        return 4;
    }
    if (coordinate >= 19 && coordinate <= 27) {
        return 5;
    }
    if (coordinate >= 28 && coordinate <= 36) {
        return 6;
    }
    if (coordinate >= 37 && coordinate <= 39) {
        return 7;
    }
    if (coordinate >= 40 && coordinate <= 42) {
        return 8;
    }
    if (coordinate >= 43 && coordinate <= 45) {
        return 9;
    }
}

function getColumnOfCoordinate(coordinate) {
    switch (coordinate) {
        case 1:
            return 4;
        case 2:
            return 5;
        case 3:
            return 6;
        case 4:
            return 4;
        case 5:
            return 5;
        case 6:
            return 6;
        case 7:
            return 4;
        case 8 :
            return 5;
        case 9:
            return 6;
        case 10:
            return 1;
        case 11:
            return 2;
        case 12:
            return 3;
        case 13:
            return 4;
        case 14:
            return 5;
        case 15:
            return 6;
        case 16:
            return 7;
        case 17:
            return 8;
        case 18:
            return 9;
        case 19:
            return 1;
        case 20:
            return 2;
        case 21:
            return 3;
        case 22:
            return 4;
        case 23:
            return 5;
        case 24:
            return 6;
        case 25:
            return 7;
        case 26:
            return 8;
        case 27:
            return 9;
        case 28:
            return 1;
        case 29:
            return 2;
        case 30:
            return 3;
        case 31:
            return 4;
        case 32:
            return 5;
        case 33:
            return 6;
        case 34:
            return 7;
        case 35:
            return 8;
        case 36:
            return 9;
        case 37:
            return 4;
        case 38:
            return 5;
        case 39:
            return 6;
        case 40:
            return 4;
        case 41:
            return 5;
        case 42:
            return 6;
        case 43:
            return 4;
        case 44:
            return 5;
        case 45:
            return 6;
    }
}
function getCoordinate(row, column) {
    switch (row) {
        case 1:
            if (column === 4) {
                return 1;
            } else if (column === 5) {
                return 2;
            } else if (column === 6) {
                return 3;
            } else {
                return -1;
            }
            break;
        case 2:
            if (column === 4) {
                return 4;
            } else if (column === 5) {
                return 5;
            } else if (column === 6) {
                return 6;
            } else {
                return -1;
            }
            break;
        case 3:
            if (column === 4) {
                return 7;
            } else if (column === 5) {
                return 8;
            } else if (column === 6) {
                return 9;
            } else {
                return -1;
            }
            break;
        case 4:
            switch (column) {
                case 1:
                    return 10;
                case 2:
                    return 11;
                case 3:
                    return 12;
                case 4:
                    return 13;
                case 5:
                    return 14;
                case 6:
                    return 15;
                case 7:
                    return 16;
                case 8:
                    return 17;
                case 9:
                    return 18;
                default:
                    return -1;
            }
            break;
        case 5:
            switch (column) {
                case 1:
                    return 19;
                case 2:
                    return 20;
                case 3:
                    return 21;
                case 4:
                    return 22;
                case 5:
                    return 23;
                case 6:
                    return 24;
                case 7:
                    return 25;
                case 8:
                    return 26;
                case 9:
                    return 27;
                default:
                    return -1;
            }
            break;
        case 6:
            switch (column) {
                case 1:
                    return 28;
                case 2:
                    return 29;
                case 3:
                    return 30;
                case 4:
                    return 31;
                case 5:
                    return 32;
                case 6:
                    return 33;
                case 7:
                    return 34;
                case 8:
                    return 35;
                case 9:
                    return 36;
                default:
                    return -1;
            }
            break;
        case 7:
            if (column === 4) {
                return 37;
            } else if (column === 5) {
                return 38;
            } else if (column === 6) {
                return 39;
            } else {
                return -1;
            }
            break;
        case 8:
            if (column === 4) {
                return 40;
            } else if (column === 5) {
                return 41;
            } else if (column === 6) {
                return 42;
            } else {
                return -1;
            }
            break;
        case 9:
            if (column === 4) {
                return 43;
            } else if (column === 5) {
                return 44;
            } else if (column === 6) {
                return 45;
            } else {
                return -1;
            }
            break;
    }
}
function canMove(from, to) {
    var coordinate;
    if (!pieceAtCoordinate(from)) {
        return false;
    }
    if (pieceAtCoordinate(to)) {
        return false;
    }

    if (getRowOfCoordinate(from) === getRowOfCoordinate(to)) {
        if (getColumnOfCoordinate(from) + 2 === getColumnOfCoordinate(to) ||
            getColumnOfCoordinate(from) === getColumnOfCoordinate(to) + 2) {
            coordinate = getCoordinate(getRowOfCoordinate(from),
                (getColumnOfCoordinate(from) + getColumnOfCoordinate(to)) / 2);
            if (coordinate !== -1 && pieceAtCoordinate(coordinate)) {
                return true;
            }
        }
    } else if (getColumnOfCoordinate(from) === getColumnOfCoordinate(to)) {
        if (getRowOfCoordinate(from) + 2 === getRowOfCoordinate(to) ||
            getRowOfCoordinate(from) === getRowOfCoordinate(to) + 2) {
            coordinate = getCoordinate((getRowOfCoordinate(from) + getRowOfCoordinate(to)) / 2,
                getColumnOfCoordinate(from));
            if (coordinate !== -1 && pieceAtCoordinate(coordinate)) {
                return true;
            }
        }
    }
    return false;
}
function move(from, to) {
    var zeroTile = game.getTileIdOfCoordinate(0),
        toTile = game.getTileIdOfCoordinate(to),
        fromPiece = game.getAllPieceIdsOnTile(game.getTileIdOfCoordinate(from))[0],
        params, middlePiece, coordinate;

    if (getRowOfCoordinate(from) === getRowOfCoordinate(to)) {
        if (getColumnOfCoordinate(from) + 2 === getColumnOfCoordinate(to) ||
            getColumnOfCoordinate(from) === getColumnOfCoordinate(to) + 2) {
            coordinate = getCoordinate(getRowOfCoordinate(from),
                (getColumnOfCoordinate(from) + getColumnOfCoordinate(to)) / 2);

            middlePiece = game.getAllPieceIdsOnTile(game.getTileIdOfCoordinate(coordinate))[0];
        }
    } else if (getColumnOfCoordinate(from) === getColumnOfCoordinate(to)) {
        if (getRowOfCoordinate(from) + 2 === getRowOfCoordinate(to) ||
            getRowOfCoordinate(from) === getRowOfCoordinate(to) + 2) {
            coordinate = getCoordinate((getRowOfCoordinate(from) + getRowOfCoordinate(to)) / 2,
                getColumnOfCoordinate(from));
            middlePiece = game.getAllPieceIdsOnTile(game.getTileIdOfCoordinate(coordinate))[0];
        }
    }

    params = {parentId: zeroTile};
    params[middlePiece] = {};
    game.moveMoreNodes(params, 'removing middle piece from visible table');

    params = {parentId: toTile};
    params[fromPiece] = {};
    game.moveMoreNodes(params, 'moving piece');
}