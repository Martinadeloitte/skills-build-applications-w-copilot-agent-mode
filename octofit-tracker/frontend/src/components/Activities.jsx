import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    activityType: 'running',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/activities`, formData);
      setShowForm(false);
      setFormData({
        userId: '',
        activityType: 'running',
        duration: '',
        distance: '',
        calories: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Error creating activity');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`${API_URL}/activities/${id}`);
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      running: '🏃',
      walking: '🚶',
      cycling: '🚴',
      swimming: '🏊',
      strength: '💪',
      yoga: '🧘',
      other: '⚡'
    };
    return icons[type] || '⚡';
  };

  return (
    <div className="activities">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📝 Activities</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ Log Activity'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Log New Activity</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">User</label>
                  <select
                    className="form-select"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                  >
                    <option value="">Select a user...</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} (@{user.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Activity Type</label>
                  <select
                    className="form-select"
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    required
                  >
                    <option value="running">🏃 Running</option>
                    <option value="walking">🚶 Walking</option>
                    <option value="cycling">🚴 Cycling</option>
                    <option value="swimming">🏊 Swimming</option>
                    <option value="strength">💪 Strength</option>
                    <option value="yoga">🧘 Yoga</option>
                    <option value="other">⚡ Other</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes..."
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                ✓ Save Activity
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {activities.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No activities logged yet. Click "Log Activity" to get started!
            </div>
          </div>
        ) : (
          activities.map(activity => (
            <div key={activity._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card activity-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">
                      {getActivityIcon(activity.activityType)} {activity.activityType}
                    </h5>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(activity._id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="card-text">
                    <strong>{activity.userId?.firstName} {activity.userId?.lastName}</strong>
                    <br />
                    <small className="text-muted">@{activity.userId?.username}</small>
                  </p>
                  <ul className="list-unstyled">
                    <li>⏱️ Duration: {activity.duration} min</li>
                    {activity.distance && <li>📏 Distance: {activity.distance} km</li>}
                    {activity.calories && <li>🔥 Calories: {activity.calories}</li>}
                    <li>🏆 Points: <span className="badge bg-success">{activity.points}</span></li>
                    <li>📅 {new Date(activity.date).toLocaleDateString()}</li>
                  </ul>
                  {activity.notes && (
                    <p className="card-text">
                      <small className="text-muted">{activity.notes}</small>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Activities;
