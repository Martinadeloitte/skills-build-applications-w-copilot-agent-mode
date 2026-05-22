import { Router } from 'express';
import Team from '../models/Team';
import User from '../models/User';

const router = Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team', error });
  }
});

// Create new team
router.post('/', async (req, res) => {
  try {
    const team = new Team({
      ...req.body,
      members: [req.body.captainId]
    });
    await team.save();
    
    // Update captain's teamId
    await User.findByIdAndUpdate(req.body.captainId, { teamId: team._id });
    
    const populatedTeam = await Team.findById(team._id)
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');
    
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(400).json({ message: 'Error creating team', error });
  }
});

// Add member to team
router.post('/:id/members', async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in team' });
    }
    
    team.members.push(userId);
    await team.save();
    
    // Update user's teamId
    await User.findByIdAndUpdate(userId, { teamId: team._id });
    
    // Recalculate team points
    const members = await User.find({ _id: { $in: team.members } });
    team.totalPoints = members.reduce((sum, member) => sum + member.totalPoints, 0);
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');
    
    res.json(populatedTeam);
  } catch (error) {
    res.status(400).json({ message: 'Error adding member to team', error });
  }
});

// Remove member from team
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== req.params.userId
    );
    await team.save();
    
    // Remove teamId from user
    await User.findByIdAndUpdate(req.params.userId, { $unset: { teamId: 1 } });
    
    // Recalculate team points
    const members = await User.find({ _id: { $in: team.members } });
    team.totalPoints = members.reduce((sum, member) => sum + member.totalPoints, 0);
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');
    
    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Error removing member from team', error });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Remove teamId from all members
    await User.updateMany(
      { _id: { $in: team.members } },
      { $unset: { teamId: 1 } }
    );
    
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error });
  }
});

// Get team leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const teams = await Team.find()
      .sort({ totalPoints: -1 })
      .limit(limit)
      .populate('captainId', 'username firstName lastName')
      .populate('members', 'username firstName lastName totalPoints');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team leaderboard', error });
  }
});

export default router;
