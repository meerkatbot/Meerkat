<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEER</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to CSS -->
</head>
<body>

    <div class="container">
        <div class="user-info">
            <div class="user-avatar">M</div>
            <div class="user-balance">&#8383; 73,751</div>
        </div>

        <div class="bottom-farming">
            <button class="start-farming-btn">Start Farming</button>
            <div id="countdown">You can start farming now!</div>
        </div>

        <div class="game-section">
            <div class="game-title">Drop game</div>
            <div class="game-tickets">533</div>
            <button class="play-btn">Play</button>
        </div>
    </div>

    <div class="bottom-nav">
        <a href="#" class="nav-item">
            <img src="assets/pics/home.png" alt="Home">
            <span>Home</span>
        </a>
        <a href="earn.html" class="nav-item">
            <img src="assets/pics/task.png" alt="Earn">
            <span>Earn</span>
        </a>
        <a href="#" class="nav-item">
            <img src="assets/pics/friends.png" alt="Frens">
            <span>Frens</span>
        </a>
        <a href="#" class="nav-item">
            <img src="assets/pics/wallet.png" alt="Wallet">
            <span>Wallet</span>
        </a>
    </div>

    <script>
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
    // Hide the start farming button and show the countdown
    document.querySelector('.start-farming-btn').style.display = 'none';
    document.getElementById('countdown').style.display = 'block';

    if (!fromLoad) {
        // Start the farming process
        farmingActive = true;
        localStorage.setItem('farmingActive', true); // Save farming state
        countdown = 43200; // Reset countdown to 12 hours
        localStorage.setItem('countdown', countdown); // Save initial countdown
    }

    farmingInterval = setInterval(updateCountdown, 1000); // Update countdown every second
    updateCountdown(); // Initialize countdown display
}

// Function to update the farming balance
function updateFarming() {
    balance += 0.1; // Increment balance by 0.1
    document.querySelector('.user-balance').innerHTML = `&#8383; ${balance.toFixed(1)}`;
    localStorage.setItem('balance', balance); // Save balance to localStorage
}

// Function to update the countdown timer
function updateCountdown() {
    if (countdown > 0) {
        countdown--; // Decrease countdown

        // Call updateFarming() every second while farming is active
        updateFarming(); // Increment the balance by 0.1 every second

        // Get hours, minutes, and seconds from the countdown
        let hours = Math.floor(countdown / 3600);
        let minutes = Math.floor((countdown % 3600) / 60);
        let seconds = countdown % 60;

        // Display the countdown timer
        document.getElementById('countdown').textContent = `Next farming available in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        localStorage.setItem('countdown', countdown); // Save countdown to localStorage
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
    </script><!-- Link to JavaScript -->
</body>
  </html>
