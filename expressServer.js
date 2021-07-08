import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

const port = 8080;
const app = express();
const urlDatabase = {
  b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
  '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
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
const findUser = (searchEmail) => Object.values(users).find(({ email }) => email === searchEmail);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('Hello!'));
app.get('/login', (req, res) => res.render('login', { user: undefined }));
app.get('/register', (req, res) => res.render('register', { user: undefined }));
app.get('/urls', (req, res) => {
  const user = users[req.cookies.user_id];
  res.render('urlsIndex', { urls: urlDatabase, user });
});
app.get('/urls/new', (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) return res.redirect('/login');
  return res.render('urlsNew', { user });
});
app.get('/urls/:shortURL', (req, res) => {
  const { shortURL } = req.params;
  const user = users[req.cookies.user_id];
  const { longURL } = urlDatabase[shortURL];
  res.render('urlShow', { shortURL, longURL, user });
});

// app.get('/urls.json', (req, res) => res.json(urlDatabase));

// app.get('/hello', (req, res) => {
//   res.send('<html><body>Hello <b>World</b></body></html>\n');
// });

app.get('/u/:shortURL', (req, res) => {
  try {
    const { longURL } = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  } catch (err) {
    res.status(404).send('URL not found');
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password cannot be empty');
  }
  if (findUser(email)) {
    return res.status(400).send(`${email} is already used on the site`);
  }
  const id = nanoid(6);
  users[id] = { id, email, password };
  return res.cookie('user_id', id).redirect('/urls');
});
app.post('/urls', (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) {
    return res
      .status(401)
      .send('Only logged-in users can generate new records');
  }
  const id = nanoid(6);
  const longURL = fixHTTP(req.body.longURL);
  urlDatabase[id] = { longURL }; // TODO
  return res.redirect(`/urls/${id}`);
});
app.post('/urls/:id/delete', (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect('/urls');
});
app.post('/urls/:id', (req, res) => {
  const { id } = req.params;
  const longURL = fixHTTP(req.body.newURL);
  urlDatabase[id] = { ...urlDatabase[id], longURL };
  res.redirect('/urls');
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);
  if (!user || user.password !== password) {
    return res.status(403).send('Incorrect email or password');
  }
  return res.cookie('user_id', user.id).redirect('/urls');
});
app.post('/logout', (req, res) => {
  res.clearCookie('user_id').redirect('/urls');
});

app.listen(port);
