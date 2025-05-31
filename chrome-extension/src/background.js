// Background script for Focus Guard Chrome Extension

// Default blocked sites
const DEFAULT_BLOCKED_SITES = [
  'instagram.com',
  'tiktok.com',
  'youtube.com',
  'twitter.com',
  'x.com',
  'reddit.com',
  'facebook.com',
  'netflix.com'
];

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  // Set default blocked sites
  const { blockedSites } = await chrome.storage.sync.get('blockedSites');
  if (!blockedSites) {
    await chrome.storage.sync.set({ 
      blockedSites: DEFAULT_BLOCKED_SITES,
      interventionEnabled: true,
      focusSessionActive: false
    });
  }

  // Create rules for blocking
  await updateBlockingRules();
});

// Update blocking rules based on storage
async function updateBlockingRules() {
  const { blockedSites, focusSessionActive } = await chrome.storage.sync.get(['blockedSites', 'focusSessionActive']);
  
  if (!blockedSites || blockedSites.length === 0) return;

  // Remove existing rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(rule => rule.id);
  if (ruleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });
  }

  // Only block if focus session is active or intervention is enabled
  if (focusSessionActive) {
    // Create new rules
    const rules = blockedSites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: 'redirect', redirect: { extensionPath: '/public/intervention.html?site=' + encodeURIComponent(site) } },
      condition: {
        urlFilter: `*://*.${site}/*`,
        resourceTypes: ['main_frame']
      }
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites || changes.focusSessionActive) {
    updateBlockingRules();
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startBreathingExercise') {
    // Open breathing exercise in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('public/intervention.html?breathing=true&site=' + encodeURIComponent(request.site))
    });
  } else if (request.action === 'skipIntervention') {
    // Log skip and redirect to original site
    logIntervention(request.site, false);
    chrome.tabs.update(sender.tab.id, {
      url: `https://${request.site}`
    });
  } else if (request.action === 'completeIntervention') {
    // Log completion and redirect
    logIntervention(request.site, true);
    chrome.tabs.update(sender.tab.id, {
      url: `https://${request.site}`
    });
  } else if (request.action === 'syncWithWebApp') {
    // Sync data with web app
    syncWithWebApp();
  } else if (request.action === 'startFocusSession') {
    // Start focus session
    startFocusSession(request.duration);
  }
});

// Log intervention data
async function logIntervention(site, completed) {
  const { interventions = [] } = await chrome.storage.local.get('interventions');
  interventions.push({
    site,
    timestamp: new Date().toISOString(),
    completed,
    duration: completed ? 60 : 10 // Assume 60s for complete, 10s for skip
  });
  
  await chrome.storage.local.set({ interventions });
  
  // Send to web app if connected
  syncInterventionData(interventions);
}

// Sync with web app
async function syncWithWebApp() {
  const { apiKey, userId } = await chrome.storage.sync.get(['apiKey', 'userId']);
  if (!apiKey || !userId) return;

  const { interventions = [], blockedSites = [] } = await chrome.storage.local.get(['interventions', 'blockedSites']);
  
  try {
    const response = await fetch('https://your-domain.com/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        userId,
        interventions,
        blockedSites
      })
    });

    if (response.ok) {
      // Clear synced interventions
      await chrome.storage.local.set({ interventions: [] });
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Start focus session
async function startFocusSession(duration) {
  await chrome.storage.sync.set({ 
    focusSessionActive: true,
    focusSessionEnd: Date.now() + duration * 60 * 1000
  });
  
  // Update blocking rules
  await updateBlockingRules();
  
  // Set alarm to end session
  chrome.alarms.create('focusSessionEnd', { delayInMinutes: duration });
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/public/icon-128.png',
    title: 'Focus Session Started',
    message: `All distracting sites are blocked for ${duration} minutes.`
  });
}

// Handle alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'focusSessionEnd') {
    await chrome.storage.sync.set({ focusSessionActive: false });
    await updateBlockingRules();
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/public/icon-128.png',
      title: 'Focus Session Complete!',
      message: 'Great job staying focused! Sites are now unblocked.'
    });
  }
});

// Periodic sync
chrome.alarms.create('periodicSync', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicSync') {
    syncWithWebApp();
  }
}); 