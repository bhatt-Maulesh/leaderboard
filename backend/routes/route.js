const db = require('../config/db')
const express = require('express')
const apiRoutes = express.Router();

//API routes

// Recalculate Leaderboard
apiRoutes.post('/recalculate', (req, res) => {
    // Get all users
    const getUsersQuery = `SELECT * FROM users`;
  
    db.query(getUsersQuery, (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Error fetching users' });
      }
  
      if (!users.length) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      // calculate users total points
      const userIds = users.map(u => u.id);
      const getActivitiesQuery = `SELECT * FROM activities WHERE user_id IN (${userIds.join(',')})`;
  
      db.query(getActivitiesQuery, (err, activities) => {
        if (err) {
          console.error('Error fetching activities:', err);
          return res.status(500).json({ message: 'Error fetching activities' });
        }
  
        // Calculate total points manually per user
        const pointsMap = {};
  
        activities.forEach(activity => {
          if (!pointsMap[activity.user_id]) {
            pointsMap[activity.user_id] = 0;
          }
          pointsMap[activity.user_id] += activity.points;
        });
  
        // Prepare leaderboard data
        const leaderboardData = users.map(user => ({
          user_id: user.id,
          full_name: user.full_name,
          total_points: pointsMap[user.id] || 0,
        }));
  
        // Step 5: Sort by total_points descending and assign ranks
        leaderboardData.sort((a, b) => b.total_points - a.total_points);
  
        let currentRank = 1;
        let actualRank = 1;
        let previousPoints = null;
  
        const finalData = leaderboardData.map(user => {
          if (user.total_points !== previousPoints) {
            actualRank = currentRank;
          }
          previousPoints = user.total_points;
          currentRank++;
  
          return [user.user_id, user.total_points, actualRank];
        });
  
        // Step 6: Clear old leaderboard
        db.query(`DELETE FROM leaderboard`, (err) => {
          if (err) {
            console.error('Error clearing leaderboard:', err);
            return res.status(500).json({ message: 'Error clearing leaderboard' });
          }
  
          // Step 7: Insert new leaderboard
          const insertQuery = `
            INSERT INTO leaderboard (user_id, total_points, rank)
            VALUES ?
          `;
  
          db.query(insertQuery, [finalData], (err) => {
            if (err) {
              console.error('Error inserting leaderboard:', err);
              return res.status(500).json({ message: 'Error inserting leaderboard' });
            }
  
            return res.json({ message: 'Leaderboard recalculated successfully!' });
          });
        });
      });
    });
  });
  

// Get Leaderboard
apiRoutes.post('/leaderboard', (req, res) => {
    const filter = req.body.filter;
    const userId = req.body.userId;

    let dateCondition = '';

    if (filter === 'day') {
        dateCondition = "AND DATE(activity_date) = CURDATE()";
    } else if (filter === 'month') {
        dateCondition = "AND MONTH(activity_date) = MONTH(CURDATE())";
    } else if (filter === 'year') {
        dateCondition = "AND YEAR(activity_date) = YEAR(CURDATE())";
    }

    let query = `
        SELECT users.id, users.full_name, lb.total_points, lb.rank
        FROM leaderboard lb
        INNER JOIN users ON users.id = lb.user_id
        ORDER BY lb.rank ASC
    `;

    if (userId) {
        query = `
            SELECT users.id, users.full_name, lb.total_points, lb.rank
            FROM leaderboard lb
            INNER JOIN users ON users.id = lb.user_id
            WHERE users.id = ${userId}
        `;
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});





module.exports = apiRoutes;