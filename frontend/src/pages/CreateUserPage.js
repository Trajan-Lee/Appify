import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import userUtils from '../utils/userUtils';

const CreateUserPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('subordinate');
  const [orgJob, setOrgJob] = useState('');
  const [managers, setManagers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchManagersAndCurrentUser = async () => {
      try {
        // Fetch the current user's ID
        const currentUserId = await userUtils.fetchUserId();
        setSelectedManagers([currentUserId]); // Auto-populate with the current user's ID

        // Fetch the list of managers
        const fetchedManagers = await userUtils.fetchManagers(); // Assuming managers are fetched similarly
        setManagers(fetchedManagers);
      } catch (err) {
        console.error('Error fetching managers or current user ID:', err);
        setError('Failed to load managers or current user ID.');
      }
    };

    fetchManagersAndCurrentUser();
  }, []);

  const handleManagersChange = (selectedOptions) => {
    setSelectedManagers(selectedOptions.map((option) => option.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email,
        password,
        username,
        role,
        orgJob,
        managers: selectedManagers,
      };

      await userUtils.createUser(userData);
      setSuccess('User created successfully!');
      setEmail('');
      setPassword('');
      setUsername('');
      setRole('subordinate');
      setOrgJob('');
      setSelectedManagers([]);
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Create User</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          >
            <option value="subordinate">Subordinate</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <label>Organization Job:</label>
          <input
            type="text"
            value={orgJob}
            onChange={(e) => setOrgJob(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </div>
        {role === 'subordinate' && (
          <div>
            <label>Assign Managers:</label>
            <Select
              isMulti
              options={managers.map((manager) => ({
                value: manager._id,
                label: manager.username,
              }))}
              onChange={handleManagersChange}
              value={managers
                .filter((manager) => selectedManagers.includes(manager._id))
                .map((manager) => ({
                  value: manager._id,
                  label: manager.username,
                }))}
              styles={{
                container: (base) => ({ ...base, marginBottom: '10px' }),
                control: (base) => ({ ...base, color: 'black' }),
                option: (base, state) => ({
                  ...base,
                  color: 'black',
                  backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                }),
              }}
            />
          </div>
        )}
        <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserPage;