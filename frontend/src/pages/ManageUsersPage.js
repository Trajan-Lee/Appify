import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userUtils from '../utils/userUtils';
import './styles/uniformStyles.css';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userUtils.fetchSubordinates();
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="uniform-container">
      <div className="uniform-header">
        <h1>Manage Users</h1>
        <Link to="/users/create" className="uniform-create-button">
          Create New User
        </Link>
      </div>
      <table className="uniform-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  <Link to={`/users/${user._id}`}>{user.username}</Link> {/* Make username a link */}
                </td>
                <td>{user.email}</td>
                <td>{user.orgJob}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsersPage;