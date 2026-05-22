import { Router } from 'express';
import User from '../models/User';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const { password, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// Get leaderboard (top users by points)
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await User.find()
      .sort({ totalPoints: -1 })
      .limit(limit)
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
});

export default router;
