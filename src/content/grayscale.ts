// Check if we're in bedtime mode
async function checkBedtimeMode() {
  try {
    const settings = await chrome.storage.sync.get('settings');
    const bedtime = settings.settings?.bedtime;

    // If settings or bedtime is not initialized, remove grayscale and return
    if (!settings.settings || !bedtime) {
      removeGrayscaleFilter();
      return;
    }

    if (!bedtime.enabled) {
      removeGrayscaleFilter();
      return;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = bedtime.startTime.split(':').map(Number);
    const [endHour, endMinute] = bedtime.endTime.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Handle overnight bedtime (e.g., 23:00 to 06:00)
    if (startTime > endTime) {
      if (currentTime >= startTime || currentTime < endTime) {
        applyGrayscaleFilter();
      } else {
        removeGrayscaleFilter();
      }
    } else {
      if (currentTime >= startTime && currentTime < endTime) {
        applyGrayscaleFilter();
      } else {
        removeGrayscaleFilter();
      }
    }
  } catch (error) {
    console.error('Error checking bedtime mode:', error);
    removeGrayscaleFilter();
  }
}

// Apply grayscale filter to the page
function applyGrayscaleFilter() {
  const style = document.getElementById('prodi-grayscale-style');
  if (!style) {
    const newStyle = document.createElement('style');
    newStyle.id = 'prodi-grayscale-style';
    newStyle.textContent = `
      html {
        filter: grayscale(100%) !important;
        -webkit-filter: grayscale(100%) !important;
      }
    `;
    document.head.appendChild(newStyle);
  }
}

// Remove grayscale filter from the page
function removeGrayscaleFilter() {
  const style = document.getElementById('prodi-grayscale-style');
  if (style) {
    style.remove();
  }
}

// Run immediately when the script loads
document.addEventListener('DOMContentLoaded', () => {
  checkBedtimeMode();
});

// Also run immediately in case DOMContentLoaded already fired
checkBedtimeMode();

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    checkBedtimeMode();
  }
});

// Check every minute to handle time changes
setInterval(checkBedtimeMode, 60000);
