import React, { useEffect, useState } from 'react';
import Navbar from '../component/Navbar';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // for viewing profile
  const [roleToUpdate, setRoleToUpdate] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/all', { credentials: 'include' })  // adjust base URL as needed
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok) {
        alert(json.message);
        setUsers(users.filter(user => user._id !== userId));
        if (selectedUser?._id === userId) setSelectedUser(null);
      } else {
        alert(json.error || 'Delete failed');
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleViewProfile = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedUser(data);
      } else {
        alert(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      alert('Failed to fetch profile');
    }
  };

  const handleRoleChange = (e) => {
    setRoleToUpdate(e.target.value);
  };

  const handleUpdateRole = async () => {
    if (!updatingUserId || !roleToUpdate) {
      alert('Select user and role first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: updatingUserId, newRole: roleToUpdate }),
      });
      const json = await res.json();
      if (res.ok) {
        alert(json.message);
        setUsers(users.map(user => user._id === updatingUserId ? json.user : user));
        setUpdatingUserId(null);
        setRoleToUpdate('');
      } else {
        alert(json.error || 'Update failed');
      }
    } catch (error) {
      alert('Error updating role');
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <h1>Admin Dashboard</h1>

      <div className="users-section">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>View Profile</th>
              <th>Update Role</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><button onClick={() => handleViewProfile(user._id)}>View</button></td>
                <td>
                  <select
                    value={updatingUserId === user._id ? roleToUpdate : user.role}
                    onChange={(e) => {
                      setUpdatingUserId(user._id);
                      setRoleToUpdate(e.target.value);
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td><button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="update-role-btn"
          onClick={handleUpdateRole}
          disabled={!updatingUserId || !roleToUpdate}
        >
          Update Role
        </button>
      </div>

      {selectedUser && (
        <div className="profile-section">
          <h2>User Profile</h2>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p><strong>Name:</strong> {selectedUser.name || 'N/A'}</p>
          <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
          <p><strong>Country:</strong> {selectedUser.country || 'N/A'}</p>
          <p><strong>University:</strong> {selectedUser.university || 'N/A'}</p>
          <button onClick={() => setSelectedUser(null)}>Close Profile</button>
        </div>
      )}

      <style>{`
        .admin-dashboard {
          max-width: 900px;
          margin: 20px auto;
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
        }
        h1, h2 {
          text-align: center;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
        }
        button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
        }
        .delete-btn {
          background-color: #dc3545;
        }
        .delete-btn:hover {
          background-color: #b52a38;
        }
        .profile-section {
          margin-top: 30px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: white;
        }
        select {
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ccc;
          cursor: pointer;
        }
        .update-role-btn {
          margin-top: 10px;
          display: block;
          width: 150px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
