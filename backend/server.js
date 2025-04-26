const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/route');

const app = express();

// cors enable
app.use(cors());

// enable parse json
app.use(express.json());


app.use('/api',apiRoutes);

app.listen(8080,()=>{
    console.log('Running on port:: 8080')
})