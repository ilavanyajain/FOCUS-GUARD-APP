// Load and display stats
async function loadStats() {
  const { interventions = [] } = await chrome.storage.local.get('interventions');
  const today = new Date().toDateString();
  const todayInterventions = interventions.filter(i => 
    new Date(i.timestamp).toDateString() === today
  );
  
  document.getElementById('blocked-today').textContent = todayInterventions.length;
  
  // Calculate time saved
  const timeSaved = todayInterventions.length * 5; // 5 min per intervention
  const hours = Math.floor(timeSaved / 60);
  const minutes = timeSaved % 60;
  document.getElementById('time-saved').textContent = 
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// Load blocked sites
async function loadBlockedSites() {
  const { blockedSites = [] } = await chrome.storage.sync.get('blockedSites');
  const siteList = document.getElementById('site-list');
  
  blockedSites.forEach(site => {
    const siteItem = document.createElement('div');
    siteItem.className = 'site-item';
    
    const siteName = document.createElement('div');
    siteName.className = 'site-name';
    siteName.textContent = site;
    
    const toggle = document.createElement('div');
    toggle.className = 'toggle active';
    toggle.innerHTML = '<div class="toggle-slider"></div>';
    toggle.dataset.site = site;
    
    toggle.addEventListener('click', async () => {
      const isActive = toggle.classList.contains('active');
      if (isActive) {
        toggle.classList.remove('active');
        // Remove from blocked sites
        const updatedSites = blockedSites.filter(s => s !== site);
        await chrome.storage.sync.set({ blockedSites: updatedSites });
      } else {
        toggle.classList.add('active');
        // Add to blocked sites
        blockedSites.push(site);
        await chrome.storage.sync.set({ blockedSites });
      }
    });
    
    siteItem.appendChild(siteName);
    siteItem.appendChild(toggle);
    siteList.appendChild(siteItem);
  });
}

// Start focus session
document.getElementById('start-focus').addEventListener('click', () => {
  chrome.runtime.sendMessage({ 
    action: 'startFocusSession',
    duration: 25 // 25 minutes
  });
  window.close();
});

// Open dashboard
document.getElementById('open-dashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://your-domain.com' });
});

// Initialize
loadStats();
loadBlockedSites(); 