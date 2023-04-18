const express = require('express');
const app = express();

// Serve static files from the 'css' and 'js' directories
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

// Serve the 'index.html' file at the root URL
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(3000, function() {
    console.log('Server is listening on port 3000');
});
