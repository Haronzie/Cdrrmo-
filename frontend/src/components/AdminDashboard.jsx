import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // Make sure Spinner.jsx and Spinner.css exist in your project

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // States for "Add User"
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // States for "Update User"
  const [oldUsername, setOldUsername] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedPassword, setUpdatedPassword] = useState('');

  // State for "Delete User"
  const [deleteUsername, setDeleteUsername] = useState('');

  // State for "Assign Admin"
  const [assignUsername, setAssignUsername] = useState('');

  // State for file upload
  const [uploadFile, setUploadFile] = useState(null);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState('');

  // Get username from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj && userObj.username) {
        setCurrentUser(userObj.username);
      }
    }
  }, []);

  // Fetch users from the back-end
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  // Fetch files from the back-end
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data || []); // Default to empty array if no files
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  // Refresh data on tab change
  useEffect(() => {
    setError('');
    setMessage('');
    if (activeTab === 'users') {
      fetchUsers();
    }
    if (activeTab === 'files') {
      fetchFiles();
    }
  }, [activeTab, fetchUsers, fetchFiles]);

  // Add User handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to add user');
      }
      const data = await response.json();
      setMessage(data.message);
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update User handler
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_username: oldUsername,
          new_username: updatedUsername,
          new_password: updatedPassword,
        }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to update user');
      }
      const data = await response.json();
      setMessage(data.message);
      setOldUsername('');
      setUpdatedUsername('');
      setUpdatedPassword('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete User handler with self-deletion check
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    // Prevent deleting the current admin account.
    if (deleteUsername.trim().toLowerCase() === currentUser.trim().toLowerCase()) {
      setError("Cannot delete your own admin account. Please assign another admin before deleting your account.");
      return;
    }
  
    // Check if the user exists in the fetched user list.
    const userExists = users.some((u) => {
      // Handle if users are returned as objects (with username property) or strings.
      if (typeof u === 'object' && u.username) {
        return u.username.toLowerCase() === deleteUsername.trim().toLowerCase();
      }
      return u.toLowerCase() === deleteUsername.trim().toLowerCase();
    });
    if (!userExists) {
      setError("User does not exist.");
      return;
    }
  
    // Proceed with deletion if the user exists.
    try {
      const response = await fetch('/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: deleteUsername }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to delete user');
      }
      const data = await response.json();
      setMessage(data.message);
      setDeleteUsername('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Assign Admin handler
  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('/assign-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: assignUsername }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to assign admin');
      }
      const data = await response.json();
      setMessage(data.message);
      setAssignUsername('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Upload File handler
  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!uploadFile) {
      setError('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', uploadFile);
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to upload file');
      }
      const data = await response.json();
      setMessage(data.message);
      setUploadFile(null);
      fetchFiles();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete File handler
  const handleDeleteFile = async (file) => {
    setError('');
    setMessage('');
    // Only show the delete button if the current user is the uploader
    if (currentUser.trim() !== file.uploader.trim()) {
      setError('You are not allowed to delete this file.');
      return;
    }
    try {
      const response = await fetch('/delete-file', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: file.file_name }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to delete file');
      }
      const data = await response.json();
      setMessage(data.message);
      fetchFiles();
    } catch (err) {
      setError(err.message);
    }
  };

  // Download File handler
  const handleDownload = (file) => {
    setError('');
    setMessage('');
    try {
      const downloadUrl = `/download?filename=${encodeURIComponent(file.file_name)}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setError('');
    setMessage('');
    try {
      const response = await fetch('/logout', {
        method: 'POST',
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to logout');
      }
      const data = await response.json();
      setMessage(data.message);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  // Forgot Password handler
  const handleForgotPassword = async () => {
    const newPassword = window.prompt("Enter your new password:");
    if (!newPassword) return;
    setError('');
    setMessage('');
    try {
      const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to reset password');
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Admin Dashboard</h2>
      <nav style={{ marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('users')}>View Users</button>
        <button onClick={() => setActiveTab('addUser')}>Add User</button>
        <button onClick={() => setActiveTab('updateUser')}>Update User</button>
        <button onClick={() => setActiveTab('deleteUser')}>Delete User</button>
        <button onClick={() => setActiveTab('assignAdmin')}>Assign Admin</button>
        <button onClick={() => setActiveTab('files')}>View Files</button>
        <button onClick={() => setActiveTab('uploadFile')}>Upload File</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleForgotPassword}>Forgot Password</button>
      </nav>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {activeTab === 'users' && (
        <div>
          <h3>User List</h3>
          {isLoading ? (
            <Spinner />
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  {typeof user === 'object'
                  ? `${user.username} (${user.role})`
                  : user}
                  </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'files' && (
        <div>
          <h3>Files</h3>
          {isLoading ? (
            <Spinner />
          ) : files.length === 0 ? (
            <p>No files found.</p>
          ) : (
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.file_name} - {file.size} bytes - Uploaded by: {file.uploader}{' '}
                  <button onClick={() => handleDownload(file)}>Download</button>
                  {currentUser.trim() === file.uploader.trim() && (
                    <button onClick={() => handleDeleteFile(file)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'addUser' && (
        <div>
          <h3>Add User</h3>
          <form onSubmit={handleAddUser}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password: </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit">Add User</button>
          </form>
        </div>
      )}

      {activeTab === 'updateUser' && (
        <div>
          <h3>Update User</h3>
          <form onSubmit={handleUpdateUser}>
            <div>
              <label>Old Username: </label>
              <input
                type="text"
                value={oldUsername}
                onChange={(e) => setOldUsername(e.target.value)}
              />
            </div>
            <div>
              <label>New Username: </label>
              <input
                type="text"
                value={updatedUsername}
                onChange={(e) => setUpdatedUsername(e.target.value)}
              />
            </div>
            <div>
              <label>New Password: </label>
              <input
                type="password"
                value={updatedPassword}
                onChange={(e) => setUpdatedPassword(e.target.value)}
              />
            </div>
            <button type="submit">Update User</button>
          </form>
        </div>
      )}

      {activeTab === 'deleteUser' && (
        <div>
          <h3>Delete User</h3>
          <form onSubmit={handleDeleteUser}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                value={deleteUsername}
                onChange={(e) => setDeleteUsername(e.target.value)}
              />
            </div>
            <button type="submit">Delete User</button>
          </form>
        </div>
      )}

      {activeTab === 'assignAdmin' && (
        <div>
          <h3>Assign Admin Role</h3>
          <form onSubmit={handleAssignAdmin}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                value={assignUsername}
                onChange={(e) => setAssignUsername(e.target.value)}
              />
            </div>
            <button type="submit">Assign Admin</button>
          </form>
        </div>
      )}

      {activeTab === 'uploadFile' && (
        <div>
          <h3>Upload File</h3>
          <form onSubmit={handleUpload}>
            <div>
              <label>Select File: </label>
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
              />
            </div>
            <button type="submit">Upload</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
