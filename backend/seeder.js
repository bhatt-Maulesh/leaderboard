const db = require('./config/db'); 
const { faker } = require('@faker-js/faker');



// Insert Dummy Users
for (let i = 1; i <= 50; i++) {
    const fullName = faker.person.fullName();
    db.query(`INSERT INTO users (full_name) VALUES (?)`, [fullName]);
}

// Insert Dummy Activities
setTimeout(() => {
    for (let i = 1; i <= 300; i++) {
        const userId = Math.floor(Math.random() * 50) + 1;
        const date = faker.date.past();
        db.query(`INSERT INTO activities (user_id, points, activity_date) VALUES (?, 20, ?)`, [userId, date]);
    }
}, 3000);
