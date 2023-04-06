const express = require('express');
const session = require('express-session')
const app = express()
const port = 3000

const router = require('./routers/index.js');

app.use(session({
  secret: 's3Cur3',
  name: 'sessionId',
  userId: null
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(router);


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})