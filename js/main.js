import { words } from "./words.js";

const MAXIMUM_GUESSES = 6;
let answer = getRandomWord();
// let answer = "apnea";
let guessesLeft = MAXIMUM_GUESSES;
const wordInput = document.getElementById("word-input");
const displayMessage = document.getElementById("display-message");
const keyboardContainer = document.getElementById("keyboard-container");
const resetButton = document.getElementById("reset-button");
resetButton.style.display = "none";

const letterResult = {
    letter: '',
    present: false,
    correctSpot: false,
    position: undefined, // undefined if not present
};

function getRandomWord(){
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function getAllIndices(str, char){
    const indices = [];
    str.split('').forEach((c, i) => {
        if(c === char){
        indices.push(i);
        }
    });
    return indices;
}

// returns an array of letterResult objects
function checkGuess(guess){
    const result = [];
    const correctSpots = [];

    guess.split('').forEach((letter, i) => {
        const index = getAllIndices(answer, letter);
        const letterObj = Object.create(letterResult);

        letterObj.letter = letter;
        letterObj.present = index.length !== 0;
        if(index.includes(i)){
            correctSpots.push(letter);
        }
        letterObj.correctSpot = index.includes(i);
        result.push(letterObj);
    });

    guess.split('').forEach((letter, i) => {
        if(result[i].correctSpot){
            return;
        }
        let correctCount = 0;
        let answerCount = 0;
        let beforeCount = 0;
        correctSpots.forEach((c) => {
            if(letter === c){
                correctCount++;
            }
        });
        answer.split('').forEach((c) => {
            if(letter === c){
                answerCount++;
            }
        });
        guess.slice(0, i).split('').forEach((c) => {
            if(letter === c){
                beforeCount++;
            }
        });
        if(beforeCount >= answerCount - correctCount){
            result[i].present = false;
        }
    });

    return result;
}

function initBoard() {
    const board = document.getElementById("game");

    for(let i = 0; i < MAXIMUM_GUESSES; i++){
        const row = document.createElement("div");
        row.className = "letter-row";

        for(let j = 0; j < 5; j++){
        const box = document.createElement("div");
        box.className = "letter-box";
        row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function resetBoard() {
    answer = getRandomWord();
    guessesLeft = MAXIMUM_GUESSES;
    wordInput.disabled = false;
    wordInput.value = "";
    displayMessage.textContent = "";
    const boxes = document.getElementsByClassName("filled-box");
    while(boxes.length > 0){
        const box = boxes[0];
        box.classList.remove("filled-box", "green", "yellow", "eliminated");
        box.textContent = "";
    }
    resetKeyboard();
}

function resetKeyboard() {
    const letterButtons = document.querySelectorAll(".keyboard-button");
    letterButtons.forEach(button => {
        button.classList.remove("eliminated", "green", "yellow");
    });
}

function insertWord(word){
    word = word.toLowerCase()

    const results = checkGuess(word);
    let correct = true;

    for(let i = 0; i < 5; i++){
        const letter = document.getElementById(results[i].letter);

        if(!results[i].correctSpot){
            correct = false;
        }
        
        if(!results[i].present){
            letter.classList.add("eliminated");
        }
        else if(results[i].correctSpot){
            letter.classList.add("green");
        }
        else{
            letter.classList.add("yellow");
        }
    }

    const row = document.getElementsByClassName("letter-row")[MAXIMUM_GUESSES - guessesLeft]

    for(let i = 0; i < 5; i++){
        const box = row.children[i]
        box.textContent = word[i];
        box.classList.add("filled-box")
        box.animate([
            { width: "3.3rem", height: "3.3rem" },
            { width: "3rem", height: "3rem" }
        ], {
            duration: 100,
            easing: "ease-in",
            fill: "forwards"
        });

        if(results[i].present){
            if(results[i].correctSpot){
                box.classList.add("green");
            }
            else{
                box.classList.add("yellow");
            }
        }
    }

    guessesLeft--;

    if(correct){
        wordInput.disabled = true;
        displayMessage.textContent = `You got the answer in ${MAXIMUM_GUESSES - guessesLeft} guess(es)!`;
        resetButton.style.display = "block";
    }
    else if(guessesLeft === 0){
        wordInput.disabled = true;
        displayMessage.textContent = `Out of guesses! Answer is: ${answer}`;
        resetButton.style.display = "block";
    }

    wordInput.value = "";
}

function handleTextEntry(guess){
    if(words.includes(guess)){
        console.log(guess);
        insertWord(guess);
    }
    else{
        console.log("Invalid input!")
    }
}

/*
Handles the on-screen keyboard.
*/
keyboardContainer.addEventListener("click", function(event) {
    let button = event.target;
    let buttonText = button.textContent;

    if(!button.matches("button")){
        return; //Exit function if not button
    }
  
    if(buttonText === "Del"){
        wordInput.value = wordInput.value.slice(0, -1); //remove last character
    }
    else if(buttonText === "Enter"){
        const guess = wordInput.value.toLowerCase();
        handleTextEntry(guess);
    }
    else{ //alphabetical key clicked
        if(wordInput.value.length < 5){
            wordInput.value += buttonText;
        }
    }
});

wordInput.addEventListener("keydown", function(e) {
    if(e.key === "Enter"){
        console.log(`The ${e.key} key was pressed!`);
        const guess = wordInput.value.toLowerCase();
        handleTextEntry(guess)
    }
});

resetButton.addEventListener("click", function(e) {
    resetBoard();
    resetButton.style.display = "none";
});
  

document.addEventListener("keydown", function(event){
    wordInput.focus();
});

initBoard()
wordInput.value = "";