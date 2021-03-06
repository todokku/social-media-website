
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

var Post = require('./models/post.model')


if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use(cors());
app.use(express.json());


const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.get('/', (req, res) => {
    Post.find({}, function (err, post) {
        if(err) {
            res.send("Soemthing went wrong")
            next();
        } 
        res.json(post);
    });
});

app.use('/post', postRoutes);
app.use('/user', userRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});



app.listen(port, function () {
    console.log("Server is running on port :" + port)
})