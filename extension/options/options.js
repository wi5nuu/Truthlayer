document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get('settings');
  const s = data.settings || { autoAnalyze: true, showBadge: true, apiUrl: 'http://localhost:3001', tier: 'free' };

  document.getElementById('autoAnalyze').checked = s.autoAnalyze;
  document.getElementById('showBadge').checked = s.showBadge;
  document.getElementById('apiUrl').value = s.apiUrl || 'http://localhost:3001';
  document.getElementById('tier').value = s.tier || 'free';

  document.getElementById('saveBtn').addEventListener('click', async () => {
    await chrome.storage.local.set({
      settings: {
        autoAnalyze: document.getElementById('autoAnalyze').checked,
        showBadge: document.getElementById('showBadge').checked,
        apiUrl: document.getElementById('apiUrl').value || 'http://localhost:3001',
        tier: document.getElementById('tier').value
      }
    });
    const msg = document.getElementById('savedMsg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
  });
});
