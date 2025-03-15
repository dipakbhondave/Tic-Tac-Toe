// Selecting elements
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

const boardSize = 3; // Dynamically set board size
let turnO = true; // 'O' starts first
let gameActive = true;

// Sounds (Ensure files exist in the correct directory)
let clickSound = new Audio("sounds/click.mp3");
let winSound = new Audio("sounds/win.mp3");
let drawSound = new Audio("sounds/Draw.mp3");
let winningSong = new Audio("sounds/Winner.mp3");

// Dynamically generate win patterns for any board size
const generateWinPatterns = (size) => {
    let patterns = [];

    // Rows
    for (let i = 0; i < size; i++) {
        patterns.push([...Array(size)].map((_, j) => i * size + j));
    }

    // Columns
    for (let i = 0; i < size; i++) {
        patterns.push([...Array(size)].map((_, j) => i + j * size));
    }

    // Diagonal (Left to Right)
    patterns.push([...Array(size)].map((_, i) => i * (size + 1)));

    // Diagonal (Right to Left)
    patterns.push([...Array(size)].map((_, i) => (i + 1) * (size - 1)));

    return patterns;
};

const winPatterns = generateWinPatterns(boardSize);

// Event listener for each box
boxes.forEach((box) => {
    box.addEventListener("click", (event) => {
        if (!gameActive || event.target.innerText !== "") return;

        // Play click sound
        clickSound.pause();
        clickSound.currentTime = 0;
        clickSound.play();

        event.target.innerText = turnO ? "O" : "X";
        event.target.style.color = turnO ? "white" : "red";

        turnO = !turnO;

        checkWinner();
    });
});

// Check for Winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let pos1 = boxes[a].innerText;
        let pos2 = boxes[b].innerText;
        let pos3 = boxes[c].innerText;

        if (pos1 && pos1 === pos2 && pos2 === pos3) {
            highlightWinner(pattern);
            showWinner(pos1);
            return;
        }
    }

    // Check for Draw
    if ([...boxes].every((box) => box.innerText !== "")) {
        showDraw();
    }
};

// Highlight Winning Line
const highlightWinner = (winningPattern) => {
    winningPattern.forEach((index) => {
        boxes[index].style.border = "4px solid gold";
        boxes[index].style.boxShadow = "0 0 10px gold";
    });
};

// Show Winner
const showWinner = (winner) => {
    msg.innerText = `🎉 Congratulations, Winner is ${winner}!`;
    msgContainer.classList.remove("hide");
    gameActive = false;

    // Stop any playing sounds before playing the new one
    drawSound.pause();
    drawSound.currentTime = 0;

    winSound.pause();
    winSound.currentTime = 0;
    winSound.play();

    // Play winning song after win sound
    setTimeout(() => {
        winningSong.pause();
        winningSong.currentTime = 0;
        winningSong.play();
    }, 1000); // Delay to let win sound finish
};

// Show Draw
const showDraw = () => {
    msg.innerText = "😐 Match is a Draw!";
    msgContainer.classList.remove("hide");
    gameActive = false;

    // Stop all other sounds before playing draw sound
    winSound.pause();
    winSound.currentTime = 0;
    winningSong.pause();
    winningSong.currentTime = 0;

    drawSound.pause();
    drawSound.currentTime = 0;
    drawSound.play();
};

// Reset Game
const resetGame = () => {
    turnO = true;
    gameActive = true;
    boxes.forEach((box) => {
        box.innerText = "";
        box.style.color = "";
        box.style.border = "2px solid #f7d774"; // Reset border
        box.style.boxShadow = "none"; // Remove glow
    });
    msgContainer.classList.add("hide");

    // Stop all sounds when resetting
    winSound.pause();
    winSound.currentTime = 0;
    winningSong.pause();
    winningSong.currentTime = 0;
    drawSound.pause();
    drawSound.currentTime = 0;
};

// Event Listeners for Reset and New Game Buttons
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
