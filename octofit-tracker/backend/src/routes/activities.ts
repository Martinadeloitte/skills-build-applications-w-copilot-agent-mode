import { Router } from 'express';
import Activity from '../models/Activity';
import User from '../models/User';

const router = Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('userId', 'username firstName lastName')
      .sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});

// Get activities by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user activities', error });
  }
});

// Get activity by ID
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('userId', 'username firstName lastName');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error });
  }
});

// Create new activity
router.post('/', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    
    // Update user's total points
    await User.findByIdAndUpdate(
      activity.userId,
      { $inc: { totalPoints: activity.points } }
    );
    
    const populatedActivity = await Activity.findById(activity._id)
      .populate('userId', 'username firstName lastName');
    
    res.status(201).json(populatedActivity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity', error });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const oldActivity = await Activity.findById(req.params.id);
    if (!oldActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    const pointsDifference = (req.body.points || oldActivity.points) - oldActivity.points;
    
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username firstName lastName');
    
    // Update user's total points
    if (pointsDifference !== 0) {
      await User.findByIdAndUpdate(
        oldActivity.userId,
        { $inc: { totalPoints: pointsDifference } }
      );
    }
    
    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Error updating activity', error });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Subtract points from user
    await User.findByIdAndUpdate(
      activity.userId,
      { $inc: { totalPoints: -activity.points } }
    );
    
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error });
  }
});

export default router;
