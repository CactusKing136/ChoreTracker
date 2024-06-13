import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getDatabase, ref, set, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyANOG9zQJYBHAWpKhAcHr5L5ANv9aYWZa4",
    authDomain: "choretracker-541fb.firebaseapp.com",
    databaseURL: "https://choretracker-541fb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "choretracker-541fb",
    storageBucket: "choretracker-541fb.appspot.com",
    messagingSenderId: "75761492865",
    appId: "1:75761492865:web:3692d99ec5f24b1f0dbe80"
  }

const app = initializeApp(firebaseConfig)
const database = getDatabase()
const choresListInDB = ref(database, "chores")
const tokensListInDB = ref(database, "tokens")

const carsBtn = document.querySelector(".car-wash-btn")
const kitchenBtn = document.querySelector(".kitchen-btn")
const washingBtn = document.querySelector(".washing-btn")
const carTokensEl = document.querySelector(".car-tokens")
const kitchenTokensEl = document.querySelector(".kitchen-tokens")
const washingTokensEl = document.querySelector(".washing-tokens")
const choreListEl = document.querySelector(".chores-list")

let carTokens = 0
let kitchenTokens = 0
let washingTokens = 0

onValue(choresListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let choresArray = Object.entries(snapshot.val())
    
        clearChoreListEl()
        
        for (let i = 0; i < choresArray.length; i++) {
            let currentChore = choresArray[i]
            let currentChoreID = currentChore[0]
            let currentChoreValue = currentChore[1]
            
            appendItemToChoreListEl(currentChore)
        }    
    } else {
        choreListEl.innerHTML = "No chores here... yet"
    }
})

onValue(tokensListInDB, (snapshot) => {
    let tokensArray = Object.entries(snapshot.val())
    
    for (let i = 0; i < tokensArray.length; i++) {
        let currentToken = tokensArray[i]
        let currentTokenID = currentToken[0]
        let currentTokenValue = currentToken[1]

        renderToken(currentToken)
    }

    
})

function clearChoreListEl() {
    choreListEl.innerHTML = ""
}

function renderToken(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    if (itemID === "car") {
        carTokensEl.textContent = `Tokens: ${itemValue}`
        carTokens = itemValue
    } else if (itemID === "kitchen") {
        kitchenTokensEl.textContent = `Tokens: ${itemValue}`
        kitchenTokens = itemValue
    } else {
        washingTokensEl.textContent = `Tokens: ${itemValue}`
        washingTokens = itemValue
    }
}

carsBtn.addEventListener("click", () => {
    if (carTokens != 0) {
        carTokens--
        writeTokenData(carTokens, "car")
    }

    push(choresListInDB, "Clean all cars")
})

kitchenBtn.addEventListener("click", () => {
    if (kitchenTokens != 0) {
        kitchenTokens--
        writeTokenData(kitchenTokens, "kitchen")
    }

    push(choresListInDB, "Clean the kitchen")
})

washingBtn.addEventListener("click", () => {
    if (washingTokens != 0) {
        washingTokens--
        writeTokenData(washingTokens, "washing")
    }

    push(choresListInDB, "Do the washing")
})

function writeTokenData(tokens, tokenID) {
    const db = getDatabase()
    const reference = ref(db, `tokens`)
    if (tokenID === "car") {
        set(reference, {
            car: tokens,
            kitchen: kitchenTokens,
            washing: washingTokens
        })
    } else if (tokenID === "kitchen") {
        set(reference, {
            car: carTokens,
            kitchen: tokens,
            washing: washingTokens
        })
    } else {
        set(reference, {
            car: carTokens,
            kitchen: kitchenTokens,
            washing: tokens
        })
    }
}

function appendItemToChoreListEl(chore) {
    let choreID = chore[0]
    console.log(choreID)
    let choreValue = chore[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = choreValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfChoreInDB = ref(database, `chores/${choreID}`)
        
        remove(exactLocationOfChoreInDB)
    })
    
    choreListEl.append(newEl)
}


