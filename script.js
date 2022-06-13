(function connectFourGame() {
    var playerOne;
    var playerTwo;
    var currentPlayer;
    var lastPlayer;
    var roundCount;
    var gameOver = false;

    // defining players name
    var promptPlayerOne = prompt(
        "PLAYER 1, your color is 🔴 RED. Please choose your NAME. \nIf not, your name will be automatically player 1."
    );
    var promptPlayerTwo = prompt(
        "PLAYER 2, your color is 🔵 BLUE. Please choose your NAME. \nIf not, your name will be automatically player 2."
    );
    if (promptPlayerOne == "") {
        playerOne = "player 1";
        $("#player1").text(playerOne);
    } else {
        playerOne = promptPlayerOne;
        $("#player1").text(playerOne);
    }
    if (promptPlayerTwo == "") {
        playerTwo = "player 2";
        $("#player2").text(playerTwo);
    } else {
        playerTwo = promptPlayerTwo;
        $("#player2").text(playerTwo);
    }

    // 1st player to move according to round count (even or odd)
    if (playerOne && playerTwo) {
        if (roundCount % 2 != 0) {
            currentPlayer = "player1";
            $("#currentPlayer").text("🔴 " + playerOne);
        } else {
            currentPlayer = "player2";
            $("#currentPlayer").text("🔵 " + playerTwo);
        }
        if (typeof roundCount == "undefined") {
            roundCount = 1;
            $("#roundCount").text(roundCount);
        }
    }

    // players win count
    var player1WinCount = 0;
    var player2WinCount = 0;
    $("#p1win").text(player1WinCount);
    $("#p2win").text(player2WinCount);
    var board = $("#board");
    var bordSlots = board.find(".slot");

    // track the current player after each click
    function switchPlayers() {
        if (!gameOver) {
            if (currentPlayer == "player1") {
                lastPlayer = playerTwo;
                currentPlayer = "player2";
                $("#currentPlayer").text("🔵 " + playerTwo);
            } else {
                lastPlayer = playerOne;
                currentPlayer = "player1";
                $("#currentPlayer").text("🔴 " + playerOne);
            }
        }
    }

    $(".column").on("click", function (e) {
        // search for the first empty slot
        var clickedColumn = $(e.currentTarget);
        var slotsInColumn = clickedColumn.children();
        if (!gameOver) {
            for (var i = slotsInColumn.length - 1; i >= 0; i--) {
                if (
                    !slotsInColumn.eq(i).hasClass("player1") &&
                    !slotsInColumn.eq(i).hasClass("player2")
                ) {
                    slotsInColumn.eq(i).addClass(currentPlayer);
                    break;
                }
            }
        }

        // stop adding class if column full
        if (i === -1) {
            alert("Column full! Please choose another column");
            return;
        }

        // straight line of four own pieces count
        function checkForVictory(slots) {
            var count = 0;
            for (var i = 0; i < slots.length; i++) {
                if (slots.eq(i).hasClass(currentPlayer)) {
                    count++;
                    if (count === 4) {
                        // animation for the four pieces which satisfied the victory condition
                        slots.eq(i).children().addClass("straightLine");
                        slots
                            .eq(i - 1)
                            .children()
                            .addClass("straightLine");

                        slots
                            .eq(i - 2)
                            .children()
                            .addClass("straightLine");
                        slots
                            .eq(i - 3)
                            .children()
                            .addClass("straightLine");
                        return true;
                    }
                } else {
                    count = 0;
                }
            }
        }

        // check vertical victory
        if (checkForVictory(slotsInColumn)) {
            gameOver = true;
            startWinningAnimation();
            if (lastPlayer == playerOne) {
                $("#p1win").text((player1WinCount += 1));
            } else if (lastPlayer == playerTwo) {
                $("#p2win").text((player2WinCount += 1));
            }
            newRound();
            return;
        } else {
            // check horizontal victory
            var slotsInRow = $(".row" + i);
            if (checkForVictory(slotsInRow)) {
                gameOver = true;
                startWinningAnimation();
                if (lastPlayer == playerOne) {
                    $("#p1win").text((player1WinCount += 1));
                } else if (lastPlayer == playerTwo) {
                    $("#p2win").text((player2WinCount += 1));
                }
                newRound();
                return;
            } else {
                diagonalCheckForVictory();
            }
        }

        // check diagonal victory
        function diagonalCheckForVictory() {
            var diagonalVictories = [
                [0, 7, 14, 21],
                [1, 8, 15, 22],
                [2, 9, 16, 23],
                [3, 8, 13, 18],
                [4, 9, 14, 19],
                [5, 10, 15, 20],
                [6, 13, 20, 27],
                [7, 14, 21, 28],
                [8, 15, 22, 29],
                [9, 14, 19, 24],
                [10, 15, 20, 25],
                [11, 16, 21, 26],
                [12, 19, 26, 33],
                [13, 20, 27, 34],
                [14, 21, 28, 35],
                [15, 20, 25, 20],
                [16, 21, 26, 31],
                [17, 22, 27, 32],
                [18, 25, 32, 39],
                [19, 26, 33, 40],
                [20, 27, 34, 41],
                [21, 26, 31, 36],
                [22, 27, 32, 37],
                [23, 28, 33, 38],
            ];
            for (var i = 0; i < diagonalVictories.length; i++) {
                var slots = $(".slot", "#board");
                var slot1 = slots.eq(diagonalVictories[i][0]);
                var slot2 = slots.eq(diagonalVictories[i][1]);
                var slot3 = slots.eq(diagonalVictories[i][2]);
                var slot4 = slots.eq(diagonalVictories[i][3]);

                if (
                    slot1.hasClass(currentPlayer) &&
                    slot2.hasClass(currentPlayer) &&
                    slot3.hasClass(currentPlayer) &&
                    slot4.hasClass(currentPlayer)
                ) {
                    //change the color of the four pieces which satisfied the victory condition
                    slot1.children().addClass("straightLine");
                    slot2.children().addClass("straightLine");
                    slot3.children().addClass("straightLine");
                    slot4.children().addClass("straightLine");
                    gameOver = true;
                    startWinningAnimation();
                    // alert(lastPlayer + " won!!!");
                    if (lastPlayer == playerOne) {
                        $("#p1win").text((player1WinCount += 1));
                    } else if (lastPlayer == playerTwo) {
                        $("#p2win").text((player2WinCount += 1));
                    }
                    newRound();
                    return true;
                }
            }
        }

        switchPlayers();
    });

    // start animations when a player win
    function startWinningAnimation() {
        $(".displayNone").removeClass("displayNone");
        if (currentPlayer === "player1") {
            $("#redWin").css({ visibility: "visible" });
            $("#player1won").css({ visibility: "visible" });
            $("#player1won").text(playerOne + " won!!!");
        } else {
            $("#blueWin").css({ visibility: "visible" });
            $("#player2won").css({ visibility: "visible" });
            $("#player2won").text(playerTwo + " won!!!");
        }
    }

    // start new round
    function newRound() {
        if (typeof roundCount == undefined || roundCount % 2 != 0) {
            $("#currentPlayer").text("🔴 " + playerOne);
            currentPlayer = "player1";
        } else {
            $("#currentPlayer").text("🔵 " + playerTwo);
            currentPlayer = "player2";
        }
    }
    $("#newRound").click(function () {
        // remove full slots, animations and new round button
        bordSlots.removeClass("player1");
        bordSlots.removeClass("player2");
        $(".straightLine").removeClass("straightLine");
        $(".hole").css({ backgroundColor: "" });
        $("#redWin, #player1won, #blueWin, #player2won").css({
            visibility: "hidden",
        });
        $("#newRound").addClass("displayNone");

        // update round count
        roundCount = isNaN(roundCount) ? 0 : roundCount;
        roundCount++;
        $("#roundCount").text(roundCount);

        // start new round
        newRound();
        gameOver = false;
    });

    // restart game
    $("#restartGame").on("click", function () {
        if (
            window.confirm(
                "Do you really wanna restart the game? \nWarning: proceeding will reset the round and win count, as well as the name of the players."
            )
        ) {
            location.reload();
            gameOver = false;
        }
    });
})();
