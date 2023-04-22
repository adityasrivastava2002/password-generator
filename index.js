let password="";
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied';
    }
    catch(e){
        copyMsg.innerText='failed';
    }
    copyMsg.classList.add('active');
    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);
    
}

const lengthDisplay=document.querySelector("[data-lengthNumber]");
const inputSlider=document.querySelector("[data-lengthSlider]");
let passwordLength=10;

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}
handleSlider();

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,92));
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateInteger(){
    return getRndInteger(0,9);
}

function generateSymbols(){
    return symbols.charAt(getRndInteger(0,symbols.length));
}

const indicator=document.querySelector("[data-indicator]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function calcStrength(){
    let hasNum=false;
    let hasLower=false;
    let hasUpper=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
let checkCount=0;
setIndicator("#ccc");

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("click",()=>{
        checkCount=0;
        allCheckBox.forEach( (checkbox)=>{
            if(checkbox.checked){
                checkCount++;
            }
        });
    });
});
copyBtn.addEventListener('click',()=>{
    if(passwordLength>0){
        copyContent();
    }
})
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});
generateBtn.addEventListener('click',()=>{
    if(checkCount==0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateInteger);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    // compulsory part
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining part
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();

});
