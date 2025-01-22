'use client';

import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Divider,
  Card,
  CardContent,
  Stack,
  Button
} from '@mui/material';
import { withAuth, WithAuthProps } from '@/hooks/withAuth';
import { Person as PersonIcon } from '@mui/icons-material';
import Link from 'next/link';

type UserDetailPageProps = WithAuthProps;

const UserDetailPage: React.FC<UserDetailPageProps> = ({ email, id, accessToken, name, lastLogin }) => {

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'primary.main',
            mb: 2
          }}
        >
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          User Profile
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent>
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
              <Typography variant="body1">{email}</Typography>
            </Box>
            
            <Divider />

             <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                NAME
              </Typography>
              <Typography variant="body1">{name}</Typography>
            </Box>
            
            <Divider />


            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                LAST LOGIN
              </Typography>
              <Typography variant="body1">{lastLogin}</Typography>
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ACCESS TOKEN
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  bgcolor: 'grey.50',
                  p: 2,
                  maxHeight: '100px',
                  overflow: 'auto'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-all',
                    fontFamily: 'monospace'
                  }}
                >
                  {accessToken}
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Link href={`/user-detail/${id}`} passHref>
              <Button 
                variant="contained" 
                color="primary"
              >
                Update
              </Button>
            </Link>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default withAuth(UserDetailPage);