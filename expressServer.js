import express from 'express';
import morgan from 'morgan';

const port = 8080;
const app = express();
const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.use(morgan('dev'));
app.get('/', (req, res) => res.send('Hello!'));
app.get('/urls.json', (req, res) => res.json(urlDatabase));
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(port, () => console.log(`App listening on port ${port}`));
