import axios from 'axios';

// Common Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
});

// Send filter and userId in POST body instead of query params
export const fetchLeaderboard = async (filter, userId) => {
  try {
    const res = await api.post('leaderboard', {
      filter,
      userId,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Recalculate leaderboard
export const recalculateLeaderboard = async () => {
  try {
    await api.post('recalculate');
  } catch (error) {
    console.error('Error recalculating leaderboard:', error);
  }
};
