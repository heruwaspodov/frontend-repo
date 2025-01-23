'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, CardContent, Divider, Paper, Stack, TextField, Typography, Box } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useParams } from 'next/navigation'; 
import { apiClient, apiBaseUrl } from '@/apis/apiClient';
import { UserData, WithAuthProps } from '@my-turborepo/shared-types';
import { withAuth } from '@/hooks/withAuth';
import Toast from '@/components/toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { logout } from '@/store/userSlice';

type UserDetailPageProps = WithAuthProps;

const UserDetailPage: React.FC<UserDetailPageProps> = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState({
    email: '',
    name: '',
    lastLogin: '',
    accessToken: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const url = `${apiBaseUrl}/api/users/fetch-user-data?userId=${id}`
        
        const response = await apiClient.get<UserData>(url);
        const data = response.data;
        
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = `${apiBaseUrl}/api/users/update-user-data`
      const response = await apiClient.post<UserData>(url, user);
      const data = response.data;
      
      setUser(data);
      setToast({ open: true, message: 'User data updated successfully!', severity: 'success' });
    } catch (error) {
      console.log(error)
      setToast({ open: true, message: 'Failed to update user data.', severity: 'error' });
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          User Profile
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  USER ID
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {id}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  EMAIL ADDRESS
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {user.email}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  NAME
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  LAST LOGIN
                </Typography>
                <Typography variant="body1">{user.lastLogin}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ACCESS TOKEN
                </Typography>
                <Paper
                  elevation={0}
                  sx={{ bgcolor: 'grey.50', p: 2, maxHeight: '100px', overflow: 'auto' }}
                >
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {user.accessToken}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" color="success" type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Data'}
                </Button>
                <Button variant="contained" color="error" onClick={() => handleLogout()}>
                  Logout
                </Button>
              </Box>
            </Stack>
          </form>
          <Toast
            open={toast.open}
            message={toast.message}
            severity={toast.severity}
            onClose={handleCloseToast}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default withAuth(UserDetailPage);
