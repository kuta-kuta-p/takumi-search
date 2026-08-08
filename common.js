// Initialize scores
const scores = {
    1: 1,
    2: 1
};

// Constraints
const MIN_SCORE = -99;
const MAX_SCORE = 99;

// DOM Elements
const scoreElements = {
    1: document.getElementById('score-1'),
    2: document.getElementById('score-2')
};

/**
 * Updates the score for a player and triggers a re-render.
 * @param {string|number} player - The player ID (1 or 2)
 * @param {number} change - The amount to change (-1 or 1)
 */
function updateScore(player, change) {
    let newScore = scores[player] + change;
    
    // Clamp values between min and max
    if (newScore > MAX_SCORE) {
        newScore = MAX_SCORE;
    } else if (newScore < MIN_SCORE) {
        newScore = MIN_SCORE;
    }
    
    // Only update and animate if the score actually changed
    if (newScore !== scores[player]) {
        scores[player] = newScore;
        renderScore(player, change > 0 ? 'up' : 'down');
    }
}

/**
 * Updates the text content of the score element and triggers a micro-animation.
 * @param {string|number} player - The player ID
 * @param {string} direction - 'up' for increase, 'down' for decrease
 */
function renderScore(player, direction) {
    const el = scoreElements[player];
    el.textContent = scores[player];
    
    // Remove both animation classes to reset state
    el.classList.remove('pop-up', 'pop-down');
    
    // Trigger a reflow to restart the animation
    void el.offsetWidth;
    
    // Add the appropriate animation class
    if (direction === 'up') {
        el.classList.add('pop-up');
    } else if (direction === 'down') {
        el.classList.add('pop-down');
    }
}

/**
 * Resets both players' scores to 1.
 */
function resetScores() {
    scores[1] = 1;
    scores[2] = 1;
    
    // Reset DOM without animation (or could use a special reset animation)
    scoreElements[1].textContent = scores[1];
    scoreElements[2].textContent = scores[2];
    
    scoreElements[1].classList.remove('pop-up', 'pop-down');
    scoreElements[2].classList.remove('pop-up', 'pop-down');

    // Reset Advantage states
    document.querySelectorAll('.advantage-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.advantage-display').forEach(disp => disp.classList.remove('active'));
}

// Event Listeners for tap areas
document.querySelectorAll('.hit-area').forEach(area => {
    // We use click here which works for both mouse clicks and touch taps.
    // CSS touch-action: manipulation prevents the 300ms tap delay on mobile.
    area.addEventListener('click', (e) => {
        const player = e.target.dataset.player;
        if (e.target.classList.contains('decrease')) {
            updateScore(player, -1);
        } else if (e.target.classList.contains('increase')) {
            updateScore(player, 1);
        }
    });
});

// Event Listener for reset button
document.getElementById('reset-btn').addEventListener('click', () => {
    // Add a slight delay for better UX feel on reset
    setTimeout(resetScores, 50);
});

// Event Listeners for Player Name to set First/Second player
document.querySelectorAll('.player-name-container').forEach(container => {
    container.addEventListener('click', (e) => {
        const clickedPlayer = container.dataset.player;
        const otherPlayer = clickedPlayer === '1' ? '2' : '1';
        
        // Update Roles
        const roleEl1 = document.getElementById(`role-${clickedPlayer}`);
        roleEl1.textContent = '先行';
        roleEl1.classList.remove('second');
        roleEl1.classList.add('active', 'first');
        
        const roleEl2 = document.getElementById(`role-${otherPlayer}`);
        roleEl2.textContent = '後攻';
        roleEl2.classList.remove('first');
        roleEl2.classList.add('active', 'second');
    });
});

// Event Listeners for Advantage Buttons
document.querySelectorAll('.advantage-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the player name click
        
        const player = btn.dataset.player;
        const otherPlayer = player === '1' ? '2' : '1';
        
        // Toggle this button
        btn.classList.toggle('active');
        const advDisp = document.getElementById(`adv-disp-${player}`);
        advDisp.classList.toggle('active');
        
        // Ensure the other player's advantage is deactivated (mutually exclusive)
        if (btn.classList.contains('active')) {
            document.getElementById(`adv-btn-${otherPlayer}`).classList.remove('active');
            document.getElementById(`adv-disp-${otherPlayer}`).classList.remove('active');
        }
    });
});
