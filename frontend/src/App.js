import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Alert, Button, Container, Snackbar, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import './App.css';
import { fetchLeaderboard, recalculateLeaderboard } from './services/api';

// Lazy load components
const Leaderboard = lazy(() => import('./components/Leaderboard/Leaderboard'));
const SearchBar = lazy(() => import('./components/SearchBar/SearchBar'));
const Filter = lazy(() => import('./components/Filter/Filter'));


function App() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [filterType, setFilterType] = useState('day');

  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' }); // 'success' or 'error'


  useEffect(() => {
    getLeaderboard();
  }, [filterType]);

  const getLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard(filterType, userId);
      setUsers(data);
      setAlert({ open: true, message: 'Leaderboard loaded successfully!', type: 'success' });
    } catch (error) {
      setAlert({ open: true, message: 'Failed to load leaderboard.', type: 'error' });
    }
  };
  
  const handleRecalculate = async () => {
    try {
      await recalculateLeaderboard();
      setAlert({ open: true, message: 'Leaderboard recalculated successfully!', type: 'success' });
      getLeaderboard();
    } catch (error) {
      setAlert({ open: true, message: 'Failed to recalculate leaderboard.', type: 'error' });
    }
  };
  


  return (
    <Container>
      <Suspense fallback={<h2 style={{textAlign:'center',display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 100px)',color:'Darkblue'}}>Loading...</h2>}>
        <Typography variant="h4" sx={{ my: 4 ,textAlign: 'center'}}>
          Physical Activity Leaderboard
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ mt: 2 }} onClick={handleRecalculate}>
          Recalculate
        </Button>
        <SearchBar userId={userId} setUserId={setUserId} onSearch={getLeaderboard} />
        <Filter filterType={filterType} setFilterType={setFilterType} />
        <Leaderboard users={users} />
      </Suspense>
      {/* code for the alert message  */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
