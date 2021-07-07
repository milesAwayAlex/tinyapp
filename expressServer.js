import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

const port = 8080;
const app = express();
const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'u@a.b',
    password: 'password',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

const fixHTTP = (address) => (address.includes('http') ? address : `http://${address}`);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('Hello!'));
app.get('/register', (req, res) => res.render('register', { user: undefined }));
app.get('/urls', (req, res) => {
  const user = users[req.cookies.user_id];
  res.render('urlsIndex', { urls: urlDatabase, user });
});
app.get('/urls/new', (req, res) => {
  const user = users[req.cookies.user_id];
  res.render('urlsNew', { user });
});
app.get('/urls/:shortURL', (req, res) => {
  const { shortURL } = req.params;
  const user = users[req.cookies.user_id];
  const longURL = urlDatabase[shortURL];
  res.render('urlShow', { shortURL, longURL, user });
});
app.get('/urls.json', (req, res) => res.json(urlDatabase));
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});
app.get('/u/:shortURL', (req, res) => {
  const url = urlDatabase[req.params.shortURL] || '/urls/new';
  res.redirect(url);
});

app.post('/register', (req, res) => {
  const id = nanoid(6);
  const { email, password } = req.body;
  users[id] = { id, email, password };
  res.cookie('user_id', id).redirect('/urls');
});
app.post('/urls', (req, res) => {
  const id = nanoid(6);
  const { longURL } = req.body;
  urlDatabase[id] = fixHTTP(longURL);
  res.redirect(`/urls/${id}`);
});
app.post('/urls/:id/delete', (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect('/urls');
});
app.post('/urls/:id', (req, res) => {
  const { id } = req.params;
  urlDatabase[id] = fixHTTP(req.body.newURL);
  res.redirect('/urls');
});
app.post('/login', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username).redirect('/urls');
});
app.post('/logout', (req, res) => {
  res.clearCookie('username').redirect('/urls');
});

app.listen(port);
