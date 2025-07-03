const express = require('express');
const router = express.Router();

// Mock notifications data
const notifications = [];

// Get all notifications
router.get('/', (req, res) => {
  try {
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Create notification
router.post('/', (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    
    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({ error: 'Title, message, and type are required' });
    }
    
    const notification = {
      id: notifications.length + 1,
      title,
      message,
      type,
      userId,
      read: false,
      createdAt: new Date()
    };

    notifications.push(notification);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const notification = notifications.find(n => n.id === parseInt(req.params.id));
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router; 