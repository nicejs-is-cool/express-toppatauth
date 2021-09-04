# express-toppatauth
A little package that allows to authenticate using the ToppatAuth Repl.
### Example:
```js
const express = require('express');

const app = express();

const toppatAuth = require('express-toppatauth');
const {loggedInCheck} = require('express-toppatauth');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
app.use(toppatAuth("Test App","http://localhost:3000",true));

app.get('/',(req,res) => {
    res.send('ok');
})

app.get('/login',(req,res) => {
    if (!req.session) return res.authorize('/login');
    res.storeSession();
    res.redirect('/app');
})
app.get('/app', loggedInCheck, (req, res) => {
    res.send(`Logged in as ${req.session.username}!`);
})
app.get('/logout',(req, res) => {
    res.logout();
    res.send('logout');
})

app.listen(3000);
```
Run this example and go to http://localhost:3000/login.  
The second parameter in the toppat auth function is your app's public url  
And the first parameter in the authorize function is the redirect url.  
Use the loggedInCheck function to check if the user is authenticated before handling the request.
