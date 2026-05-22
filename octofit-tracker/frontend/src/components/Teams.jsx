import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    captainId: ''
  });

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
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
      await axios.post(`${API_URL}/teams`, formData);
      setShowForm(false);
      setFormData({ name: '', description: '', captainId: '' });
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`${API_URL}/teams/${id}`);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  return (
    <div className="teams">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>👥 Teams</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ Create Team'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create New Team</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter team name..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Team Captain</label>
                <select
                  className="form-select"
                  value={formData.captainId}
                  onChange={(e) => setFormData({ ...formData, captainId: e.target.value })}
                  required
                >
                  <option value="">Select a captain...</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} (@{user.username})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                ✓ Create Team
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {teams.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No teams created yet. Click "Create Team" to get started!
            </div>
          </div>
        ) : (
          teams.map(team => (
            <div key={team._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">👥 {team.name}</h5>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(team._id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="card-body">
                  {team.description && (
                    <p className="card-text text-muted">{team.description}</p>
                  )}
                  <div className="mb-2">
                    <strong>Captain:</strong> {team.captainId?.firstName} {team.captainId?.lastName}
                  </div>
                  <div className="mb-2">
                    <strong>Members:</strong> {team.members?.length || 0}
                  </div>
                  <div className="mb-3">
                    <strong>Total Points:</strong>{' '}
                    <span className="badge bg-info fs-6">{team.totalPoints}</span>
                  </div>
                  
                  {team.members && team.members.length > 0 && (
                    <div>
                      <strong>Team Members:</strong>
                      <ul className="list-group list-group-flush mt-2">
                        {team.members.map(member => (
                          <li key={member._id} className="list-group-item p-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                {member.firstName} {member.lastName}
                                <br />
                                <small className="text-muted">@{member.username}</small>
                              </span>
                              <span className="badge bg-primary">
                                {member.totalPoints} pts
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
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

export default Teams;
