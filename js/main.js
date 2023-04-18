import {words} from "./words.js";
const MAXIMUM_GUESSES = 6;
// let answer = getRandomWord();
let answer = "apnea";
let guessesLeft = MAXIMUM_GUESSES;
const wordInput = document.getElementById("word-input");
const displayMessage = document.getElementById("display-message");
const keyboardContainer = document.getElementById("keyboard-container");

const letterResult = {
    letter: '',
    present: false,
    correctSpot: false,
    position: undefined //undefined if not present
};

function getRandomWord(){
    let randomIndex = Math.floor(Math.random() * words.length);
    let randomWord = words[randomIndex];
    return randomWord;
}

function getAllIndices(str, char) {
    var indices = [];
    for (var i = 0; i < str.length; i++) {
      if (str.charAt(i) === char) {
        indices.push(i);
      }
    }
    return indices;
  }

//returns an array of letterResult objects
function checkGuess(guess){
    let result = [];
    for(let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const index = getAllIndices(answer, letter);
        const letterObj = Object.create(letterResult);

        letterObj.letter = letter;
        letterObj.present = index.length !== 0;
        letterObj.correctSpot = index.includes(i);
        // letterObj.position = index !== -1 ? index : undefined;
        result.push(letterObj);
    }
    return result;
}

function initBoard() {
    let board = document.getElementById("game");

    for(let i = 0; i < MAXIMUM_GUESSES; i++){
        let row = document.createElement("div");
        row.className = "letter-row";
        
        for(let j = 0; j < 5; j++){
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
}

function insertWord(word){
    word = word.toLowerCase()

    let results = checkGuess(word);

    let correct = true;
    for(let i = 0; i < 5; i++){
        if(!results[i].correctSpot){
            correct = false;
        }
    }
    

    let row = document.getElementsByClassName("letter-row")[MAXIMUM_GUESSES - guessesLeft]
    for(let i = 0; i < 5; i++){
        let box = row.children[i]
        box.textContent = word[i];
        box.classList.add("filled-box")
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
    }

    else if(guessesLeft === 0){
        wordInput.disabled = true;
        //figure out later
        displayMessage.textContent = "Out of guesses! Answer is: ";
        displayMessage.textContent += answer;
    }
    wordInput.value = "";
}

function handleTextEntry(guess){
    // if(guess.length === 5 && /^[a-zA-Z]+$/.test(guess)){ //check that guess is a valid word
    //     console.log(guess);
    // }
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

document.addEventListener("keydown", function(event) {
    wordInput.focus();
});

initBoard()
wordInput.value = "";
