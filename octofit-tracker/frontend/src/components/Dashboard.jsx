import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalTeams: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, activitiesRes, teamsRes, leaderboardRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/activities`),
        axios.get(`${API_URL}/teams`),
        axios.get(`${API_URL}/users/leaderboard/top?limit=5`)
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalActivities: activitiesRes.data.length,
        totalTeams: teamsRes.data.length
      });

      setRecentActivities(activitiesRes.data.slice(0, 5));
      setTopUsers(leaderboardRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="mb-4">📊 Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card stats-card text-white">
            <div className="card-body">
              <h5 className="card-title">👥 Total Users</h5>
              <p className="display-4">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">🏃 Total Activities</h5>
              <p className="display-4">{stats.totalActivities}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">👫 Total Teams</h5>
              <p className="display-4">{stats.totalTeams}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">🏆 Top Performers</h5>
            </div>
            <div className="card-body">
              {topUsers.length === 0 ? (
                <p className="text-muted">No users yet</p>
              ) : (
                <div className="list-group list-group-flush">
                  {topUsers.map((user, index) => (
                    <div key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-primary me-2">{index + 1}</span>
                        <strong>{user.firstName} {user.lastName}</strong>
                        <br />
                        <small className="text-muted">@{user.username}</small>
                      </div>
                      <span className="badge bg-success rounded-pill">{user.totalPoints} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">📝 Recent Activities</h5>
            </div>
            <div className="card-body">
              {recentActivities.length === 0 ? (
                <p className="text-muted">No activities yet</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity) => (
                    <div key={activity._id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">
                          <span className="badge badge-activity bg-primary">{activity.activityType}</span>
                        </h6>
                        <small>{new Date(activity.date).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">
                        {activity.userId?.firstName} {activity.userId?.lastName} - {activity.duration} min
                      </p>
                      <small className="text-muted">{activity.points} points</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
