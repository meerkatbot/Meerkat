// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCstPBoZjDt6wa-iGh7Ck5JN2Ld8tPO198",
    authDomain: "myprojet-c972a.firebaseapp.com",
    databaseURL: "https://myprojet-c972a-default-rtdb.firebaseio.com",
    projectId: "myprojet-c972a",
    storageBucket: "myprojet-c972a.appspot.com",
    messagingSenderId: "948045417455",
    appId: "1:948045417455:web:173b2c3033d0dd4a64841a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Access services
const auth = firebase.auth();
const database = firebase.database();

let userUid;
let localBalance = 0;
let isFarming = false;
let lastUpdateTime = Date.now(); 

// Function to display user balance and UID
function displayUserInfo() {
    userUid = localStorage.getItem('userUid');

    if (userUid) {
        document.getElementById('user-uid').textContent = 'UID: ' + userUid;
        checkFarmingStatus();
        // Start real-time balance update
        updateBalance();
    } else {
        window.location.href = "login.html"; // Redirect to login if not logged in
    }
}

// Function to update balance display
function updateBalance() {
    database.ref('users/' + userUid + '/balance').on('value', (snapshot) => {
        localBalance = snapshot.val() || 0;
        document.getElementById('user-balance').textContent = '₿ ' + localBalance.toFixed(2);
        lastUpdateTime = Date.now();
    }, (error) => {
        console.error("Error fetching user data: ", error.message);
    });
}

// Function to delete user info
function deleteUserInfo() {
    if (userUid) {
        // Remove user data from Firebase
        database.ref('users/' + userUid).remove()
            .then(() => {
                console.log("User data deleted successfully.");
                // Clear local storage
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userUid');
                localStorage.removeItem('userBalance');
                // Redirect to login page
                window.location.href = "login.html";
            })
            .catch((error) => {
                console.error("Error deleting user data: ", error.message);
            });
    }
}

// Function to toggle farming
function toggleFarming() {
    isFarming = !isFarming;
    database.ref('users/' + userUid + '/farming').set(isFarming)
        .then(() => {
            updateFarmingUI();
            if (isFarming) {
                startLocalFarming();
            }
        })
        .catch((error) => {
            console.error("Error toggling farming status: ", error.message);
        });
}

// Function to check and update farming status
function checkFarmingStatus() {
    database.ref('users/' + userUid + '/farming').on('value', (snapshot) => {
        isFarming = snapshot.val() || false;
        updateFarmingUI();
        if (isFarming) {
            startLocalFarming();
        }
    });
}

// Function to update farming UI
function updateFarmingUI() {
    const button = document.getElementById('toggle-farming-btn');
    const status = document.getElementById('farming-status');
    
    if (isFarming) {
        button.textContent = 'Stop Farming';
        button.classList.add('active');
        status.textContent = 'Farming in progress...';
    } else {
        button.textContent = 'Start Farming';
        button.classList.remove('active');
        status.textContent = 'Farming stopped';
    }
}

// Function to start local farming
function startLocalFarming() {
    clearInterval(window.farmingInterval);
    window.farmingInterval = setInterval(updateLocalBalance, 1000); // Call updateLocalBalance every second
}

// Function to update local balance
function updateLocalBalance() {
    if (isFarming) {
        const now = Date.now();
        const secondsPassed = (now - lastUpdateTime) / 1000;
        localBalance += 0.01 * secondsPassed;
        document.getElementById('user-balance').textContent = '₿ ' + localBalance.toFixed(2);
        lastUpdateTime = now;

        // Save the updated balance to the database every second
        database.ref('users/' + userUid + '/balance').set(localBalance)
            .catch((error) => {
                console.error("Error updating balance: ", error.message);
            });
    }
}

// Attach event listeners
document.getElementById('delete-user-btn').addEventListener('click', deleteUserInfo);
document.getElementById('toggle-farming-btn').addEventListener('click', toggleFarming);

// Display user information on page load
displayUserInfo();
