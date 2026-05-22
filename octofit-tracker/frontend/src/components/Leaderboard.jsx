import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function Leaderboard() {
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const [usersRes, teamsRes] = await Promise.all([
        axios.get(`${API_URL}/users/leaderboard/top?limit=20`),
        axios.get(`${API_URL}/teams/leaderboard/top?limit=20`)
      ]);

      setUserLeaderboard(usersRes.data);
      setTeamLeaderboard(teamsRes.data);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    }
  };

  const getMedalIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="leaderboard">
      <h1 className="mb-4">🏆 Leaderboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👤 Individual
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            👥 Teams
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Individual Leaderboard</h5>
          </div>
          <div className="card-body p-0">
            {userLeaderboard.length === 0 ? (
              <p className="text-muted p-3">No users yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Fitness Level</th>
                      <th className="text-end">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLeaderboard.map((user, index) => (
                      <tr key={user._id} className="leaderboard-item">
                        <td>
                          <span className="fs-5">{getMedalIcon(index)}</span>
                        </td>
                        <td><strong>{user.firstName} {user.lastName}</strong></td>
                        <td>@{user.username}</td>
                        <td>
                          <span className={`badge ${
                            user.fitnessLevel === 'advanced' ? 'bg-success' :
                            user.fitnessLevel === 'intermediate' ? 'bg-warning' : 'bg-info'
                          }`}>
                            {user.fitnessLevel || 'beginner'}
                          </span>
                        </td>
                        <td className="text-end">
                          <span className="badge bg-primary fs-6">{user.totalPoints}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Team Leaderboard</h5>
          </div>
          <div className="card-body p-0">
            {teamLeaderboard.length === 0 ? (
              <p className="text-muted p-3">No teams yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Rank</th>
                      <th>Team Name</th>
                      <th>Captain</th>
                      <th>Members</th>
                      <th className="text-end">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeaderboard.map((team, index) => (
                      <tr key={team._id} className="leaderboard-item">
                        <td>
                          <span className="fs-5">{getMedalIcon(index)}</span>
                        </td>
                        <td><strong>{team.name}</strong></td>
                        <td>
                          {team.captainId?.firstName} {team.captainId?.lastName}
                        </td>
                        <td>{team.members?.length || 0}</td>
                        <td className="text-end">
                          <span className="badge bg-info fs-6">{team.totalPoints}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
