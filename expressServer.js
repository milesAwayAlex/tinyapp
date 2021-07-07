import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

const port = 8080;
const app = express();
const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('Hello!'));
app.get('/urls', (req, res) => res.render('urlsIndex', { urls: urlDatabase }));
app.get('/urls/new', (req, res) => res.render('urlsNew'));
app.get('/urls/:shortURL', (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL];
  res.render('urlShow', { shortURL, longURL });
});
app.get('/urls.json', (req, res) => res.json(urlDatabase));
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});
app.get('/u/:shortURL', (req, res) => {
  const url = urlDatabase[req.params.shortURL] || '/urls/new';
  res.redirect(url);
});

app.post('/urls', (req, res) => {
  const id = nanoid(6);
  let { longURL } = req.body;
  if (!longURL.includes('http')) {
    longURL = `http://${longURL}`;
  }
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});
app.post('/urls/:id/delete', (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.listen(port, () => console.log(`App listening on port ${port}`));
