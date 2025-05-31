// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const blockedSite = urlParams.get('site') || 'this website';
const isBreathingMode = urlParams.get('breathing') === 'true';

// Update UI with blocked site
document.getElementById('blocked-site').textContent = blockedSite;

// Load stats from storage
async function loadStats() {
  const { interventions = [] } = await chrome.storage.local.get('interventions');
  const today = new Date().toDateString();
  const todayInterventions = interventions.filter(i => 
    new Date(i.timestamp).toDateString() === today
  );
  
  document.getElementById('today-interventions').textContent = todayInterventions.length;
  
  // Calculate time saved (assuming 5 min saved per intervention)
  const timeSaved = todayInterventions.length * 5;
  const hours = Math.floor(timeSaved / 60);
  const minutes = timeSaved % 60;
  document.getElementById('time-saved').textContent = 
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

loadStats();

// Breathing exercise logic
let breathingInterval;
let progressInterval;
let exerciseDuration = 60; // seconds
let timeElapsed = 0;

function startBreathingExercise() {
  document.getElementById('initial-prompt').classList.add('hidden');
  document.getElementById('breathing-exercise').classList.remove('hidden');
  
  const breathingText = document.querySelector('.breathing-text');
  const progressFill = document.querySelector('.progress-fill');
  
  // Start breathing animation text
  breathingInterval = setInterval(() => {
    const phase = (timeElapsed % 8) < 4 ? 'Breathe In' : 'Breathe Out';
    breathingText.textContent = phase;
  }, 100);
  
  // Update progress bar
  progressInterval = setInterval(() => {
    timeElapsed++;
    const progress = (timeElapsed / exerciseDuration) * 100;
    progressFill.style.width = `${progress}%`;
    
    if (timeElapsed >= exerciseDuration) {
      completeExercise();
    }
  }, 1000);
}

function completeExercise() {
  clearInterval(breathingInterval);
  clearInterval(progressInterval);
  
  document.getElementById('breathing-exercise').classList.add('hidden');
  document.getElementById('completion-message').classList.remove('hidden');
  
  // Send completion message
  chrome.runtime.sendMessage({
    action: 'completeIntervention',
    site: blockedSite
  });
}

function endEarly() {
  clearInterval(breathingInterval);
  clearInterval(progressInterval);
  
  // Send skip message
  chrome.runtime.sendMessage({
    action: 'skipIntervention',
    site: blockedSite
  });
}

// Event listeners
document.getElementById('start-breathing').addEventListener('click', startBreathingExercise);
document.getElementById('skip-intervention').addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'skipIntervention',
    site: blockedSite
  });
});
document.getElementById('end-early').addEventListener('click', endEarly);
document.getElementById('continue-to-site').addEventListener('click', () => {
  window.location.href = `https://${blockedSite}`;
});
document.getElementById('stay-focused').addEventListener('click', () => {
  window.close();
});

// Auto-start if in breathing mode
if (isBreathingMode) {
  startBreathingExercise();
} 