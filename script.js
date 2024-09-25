// Initialize variables
let balance = parseFloat(localStorage.getItem('balance')) || 73751.0; // Load balance from localStorage
let farmingActive = JSON.parse(localStorage.getItem('farmingActive')) || false; // Load farming status
let countdown = parseInt(localStorage.getItem('countdown')) || 0; // Load countdown
let farmingInterval;

// Function to load the initial state
function loadInitialState() {
    // Update balance display
    document.querySelector('.user-balance').innerHTML = `&#8383; ${balance.toFixed(1)}`;

    if (farmingActive) {
        startFarming(true); // Start farming if it was active
    } else {
        document.getElementById('countdown').textContent = 'You can start farming now!';
        document.querySelector('.start-farming-btn').style.display = 'block'; // Show the start farming button
    }
}

// Function to start farming
function startFarming(fromLoad = false) {
    console.log("Start Farming button clicked.");
    
    // Hide the start farming button and show the countdown
    document.querySelector('.start-farming-btn').style.display = 'none';
    document.getElementById('countdown').style.display = 'block';

    if (!fromLoad) {
        // Start the farming process
        farmingActive = true;
        localStorage.setItem('farmingActive', true); // Save farming state
        countdown = 43200; // Reset countdown to 12 hours
        localStorage.setItem('countdown', countdown); // Save initial countdown
        console.log("Farming started, countdown set to 43200 seconds."); // Log farming state
    }

    farmingInterval = setInterval(updateCountdown, 1000); // Update countdown every second
    updateCountdown(); // Initialize countdown display
}

// Function to update the farming balance
function updateFarming() {
    balance += 0.1; // Increment balance by 0.1
    console.log(`New balance: &#8383; ${balance.toFixed(1)}`); // Log new balance
    document.querySelector('.user-balance').innerHTML = `&#8383; ${balance.toFixed(1)}`;
    localStorage.setItem('balance', balance); // Save balance to localStorage
}

// Function to update the countdown timer
function updateCountdown() {
    if (countdown > 0) {
        countdown--; // Decrease countdown
        updateFarming(); // Call this to update farming balance

        // Get hours, minutes, and seconds from the countdown
        let hours = Math.floor(countdown / 3600);
        let minutes = Math.floor((countdown % 3600) / 60);
        let seconds = countdown % 60;

        // Display the countdown timer
        document.getElementById('countdown').textContent = `Next farming available in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        localStorage.setItem('countdown', countdown); // Save countdown to localStorage
        console.log(`Countdown: ${countdown} seconds remaining.`); // Log countdown value
    } else {
        clearInterval(farmingInterval);
        farmingActive = false;
        localStorage.setItem('farmingActive', false); // Update farming state
        document.getElementById('countdown').textContent = 'You can start farming now!';
        document.querySelector('.start-farming-btn').style.display = 'block'; // Show the start farming button again
    }
}

// Add event listener to the Start Farming button
document.querySelector('.start-farming-btn').addEventListener('click', startFarming);

// Load initial state on page load
loadInitialState();