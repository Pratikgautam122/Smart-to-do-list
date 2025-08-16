// notificationService.js

export const notificationService = {
  // Request notification permission
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  },

  // Schedule a notification for a task
  scheduleNotification(task) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    if (!task.dueDate || !task.reminder) {
      return;
    }

    // Create due date time
    const dueDateTime = new Date(task.dueDate);
    
    // If task has a specific time, use it; otherwise default to end of day
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      dueDateTime.setHours(23, 59, 59, 999);
    }

    const currentTime = Date.now();
    const reminderMinutes = parseInt(task.reminderTime || '30');
    
    // Calculate reminder time (subtract reminder minutes from due time)
    const reminderTime = dueDateTime.getTime() - (reminderMinutes * 60 * 1000);
    const timeDiffToReminder = reminderTime - currentTime;
    
    // Schedule reminder notification
    if (timeDiffToReminder > 0) {
      setTimeout(() => {
        const timeUntilDue = Math.round((dueDateTime.getTime() - Date.now()) / (1000 * 60));
        let reminderText;
        
        if (timeUntilDue <= 0) {
          reminderText = 'is due now!';
        } else if (timeUntilDue < 60) {
          reminderText = `is due in ${timeUntilDue} minute${timeUntilDue !== 1 ? 's' : ''}!`;
        } else {
          const hours = Math.floor(timeUntilDue / 60);
          const mins = timeUntilDue % 60;
          if (mins === 0) {
            reminderText = `is due in ${hours} hour${hours !== 1 ? 's' : ''}!`;
          } else {
            reminderText = `is due in ${hours}h ${mins}m!`;
          }
        }

        new Notification('Task Reminder', {
          body: `"${task.text}" ${reminderText}`,
          icon: '/favicon.ico',
          tag: task.id,
          requireInteraction: true,
          actions: [
            { action: 'complete', title: 'Mark Complete' },
            { action: 'snooze', title: 'Snooze 10m' }
          ]
        });
      }, timeDiffToReminder);
    }

    // Also schedule a notification at the exact due time
    const timeDiffToDue = dueDateTime.getTime() - currentTime;
    if (timeDiffToDue > 0) {
      setTimeout(() => {
        new Notification('Task Due Now!', {
          body: `"${task.text}" is due now!`,
          icon: '/favicon.ico',
          tag: `${task.id}-due`,
          requireInteraction: true,
          urgency: 'high'
        });
      }, timeDiffToDue);
    }
  },

  // Show immediate notification
  showNotification(title, body, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        body,
        icon: '/favicon.ico',
        ...options
      });
    }
  },

  // Format time for display
  formatReminderTime(minutes) {
    const mins = parseInt(minutes);
    if (mins < 60) {
      return `${mins} minute${mins !== 1 ? 's' : ''} before`;
    } else if (mins < 1440) {
      const hours = Math.floor(mins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} before`;
    } else {
      const days = Math.floor(mins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} before`;
    }
  }
};