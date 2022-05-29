const leftInputBox = document.querySelector(".leftInputBx");
const wordsText = document.querySelector(".words");
const charsText = document.querySelector(".chars");
const rightInputBoxP = document.querySelector(".rightInputBx p");
const rightInputBox = document.querySelector(".rightInputBx");
const mistakesText = document.querySelector(".mistakes");
const accuracyText = document.querySelector(".accuracy");
const timesCountText = document.querySelector(".timecount");
const body = document.querySelector("body");
const tryAgainBtn = document.querySelector(".try-again");

// get modalcontainer values
const modalContainer = document.querySelector(".modal-container");
const modalWpm = document.querySelector(".wpm");
const modalCpm = document.querySelector(".cpm");
const modalPercent = document.querySelector(".percentage");
const modalExpertiseImg = document.querySelector(".expertise-img");
const modalTextHeading = document.querySelector(".text-heading");

let wordCount = 0;
let charInd = 0;
let mistakes = 0; 
let timer = 0;
let totalTime = tempTime = 60;
let isTyping = false;
let wpm = 0;
let accuracy = 0;

/* Dry runed alternate code base 
leftInputBox.addEventListener("keydown", function(e){
    // console.log(e.target.textContent)
    let inputStr = e.target.textContent;
    let wordsArr = inputStr.split(' ');
    let charsStr = inputStr.replace(/\s/g,'');
    
    wordsText.innerHTML = `${wordsArr.length}`;
    charsText.innerHTML = `${charsStr.length + 1}`;
});

*/

tryAgainBtn.addEventListener("click", resetSettings);

function resetSettings(){
    selectRandomPara();
    wordCount = charInd = mistakes = timer = 0;
    isTyping = false;
    totalTime = tempTime = 60;
    timesCountText.innerText = `${totalTime}`;
    mistakesText.innerText = mistakes;
    charsText.innerHTML = `${charInd - mistakes}`;
    wordsText.innerHTML = 0;
    leftInputBox.innerHTML = "";     

    // close the modal container
    modalContainer.classList.remove("active");
    body.classList.remove("active");
}

function selectRandomPara(){
    let randInd = Math.floor(Math.random() * paragraphs.length);

    // empty the right input container initially
    rightInputBoxP.innerHTML = "";

    paragraphs[randInd].split("").forEach(ele => {
        let spanTagEle = `<span>${ele}</span>`;
        rightInputBoxP.innerHTML += spanTagEle;
    });

    // adding focus to our typing inputBx
    document.querySelector("keydown", function(){
        leftInputBox.focus();
    });
}

function initTypingMaster(){
    let typedCharacter = leftInputBox.innerText.split("")[charInd];
    // compare character by character
    const characters = rightInputBox.querySelectorAll("span"); 
    // console.log(typedCharacter)

    // check if whether the timer expires or not || user hase typed all the words with time limit
    if(charInd < characters.length - 1 && totalTime > 0){
        if(!isTyping){
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
    
        // if pressed the backspace handle classes
        if(typedCharacter == null){
            charInd--;
            
            // to restrict mistakes counter to be positive always
            if(characters[charInd].classList.contains("Incorrect")){
                mistakes--;
            }
    
            // remove both the classes as user may type correct or incorrect word after backspace
            characters[charInd].classList.remove("correct", "Incorrect");
        }else{
            if((characters[charInd].innerText === typedCharacter) || (characters[charInd].innerText === " ")){
                characters[charInd].classList.add("correct");
            }else{
                characters[charInd].classList.add("Incorrect");
                mistakes++;
            }
            charInd++;
        }
    
        // add incremented value to element
        mistakesText.innerText = mistakes;
        charsText.innerHTML = `${charInd - mistakes}`;
        accuracyText.innerHTML = Math.round(accuracy * 10) / 100;
    
        // calculate words per minute
        // to calculate wpm first find total num of words and then divide that with total time taken to type that words
        // (charInd - mistakes) / 5) => because we are assuming the length of word to be 5 chars
        wpm = Math.round((((charInd - mistakes) / 5) / (tempTime - totalTime)) * 60);
        // if wpm has invalid value
        wordsText.innerHTML = wpm < 0 || wpm === Infinity || isNaN(wpm) ? 0 : wpm;
        accuracy = ((charInd - mistakes) / charInd) * 100;
    }else{
        // clear the timer
        clearInterval(timer);
        leftInputBox.innerHTML = "";       
    }

    if(totalTime == 0){
        modalContainer.classList.add("active");
        body.classList.add("active");
        if(modalContainer.classList.contains("active")){
            let calc = Math.round(accuracy * 100) / 100;
            if(wpm > 40){
                modalExpertiseImg.src = "./imgs/octopus.svg";
                modalTextHeading.innerText = 'You"re an Octopus';
                modalPercent.innerHTML = `${calc}%`;
            }else{
                modalExpertiseImg.src = "./imgs/turtle.svg";
                modalTextHeading.innerText = 'You"re an Turtle';
                modalPercent.innerHTML = `${calc}%`;
            }
        }
        // activate modal 
        modalWpm.innerHTML = `${wpm < 0 || wpm === Infinity || isNaN(wpm) ? 0 : wpm} wpm`;
        modalCpm.innerHTML = ` (${charInd - mistakes} CPM)`;
    }
}

selectRandomPara();

function initTimer(){
    if(totalTime > 0){
        totalTime--;
        timesCountText.innerText = `${totalTime}`;
    }else{
        // clear the initTimer intervla
        clearInterval(timer);
    }
}

leftInputBox.addEventListener("input", initTypingMaster);

// adding focus on div having content-editable = true when documents loads
window.onload = function(){
    leftInputBox.focus();
}
