import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

const port = 8080;
const app = express();
const urlDatabase = {
  b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
  '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
};
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'a@b.c',
    password: '$2a$10$8u.Ic0/ogqok0xO2VQsX/udyT/fCDPfQoLvL.IwC.gmbdQ50c09X.',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'x@y.z',
    password: '$2a$10$vcjOlD/3CAz6Y1hqkQiKze1BPKveTf04yc3O2cXQBcm/.bNoYB4pe',
  },
};

const fixHTTP = (address) =>
  address.includes('http') ? address : `http://${address}`;
const findUser = (searchEmail) =>
  Object.values(users).find(({ email }) => email === searchEmail);
const urlsForUser = (id, db) =>
  Object.fromEntries(
    Object.entries(db).filter(([, { userID }]) => userID === id)
  );

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('Hello!'));
app.get('/login', (req, res) => res.render('login', { user: undefined }));
app.get('/register', (req, res) => res.render('register', { user: undefined }));
app.get('/urls', (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) {
    return res.status(401).send('Only logged-in users can see the records');
  }
  const urls = urlsForUser(user.id, urlDatabase);
  return res.render('urlsIndex', { urls, user });
});
app.get('/urls/new', (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) return res.redirect('/login');
  return res.render('urlsNew', { user });
});
app.get('/urls/:shortURL', (req, res) => {
  const { shortURL } = req.params;
  if (!Object.keys(urlDatabase).includes(shortURL)) {
    return res.status(404).send('URL not found');
  }
  const user = users[req.cookies.user_id];
  if (!user) {
    return res.status(401).send('Only logged-in users can see the records');
  }
  const { longURL, userID } = urlDatabase[shortURL];
  if (user.id !== userID) {
    return res
      .status(401)
      .send('Only the owner of the record can see the details');
  }
  return res.render('urlShow', { shortURL, longURL, user });
});

app.get('/u/:shortURL', (req, res) => {
  try {
    const { longURL } = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  } catch (err) {
    res.status(404).send('URL not found');
  }
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password cannot be empty');
  }
  if (findUser(email)) {
    return res.status(400).send(`${email} is already used on the site`);
  }
  const id = nanoid(6);
  const hashedPass = await bcrypt.hash(password, 10);
  // console.log(password, hashedPass);
  users[id] = { id, email, password: hashedPass };
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
  const userID = user.id;
  const longURL = fixHTTP(req.body.longURL);
  urlDatabase[id] = { longURL, userID };
  return res.redirect(`/urls/${id}`);
});
app.post('/urls/:id/delete', (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) {
    return res.status(401).send('Only logged-in users can delete records');
  }
  const { id } = req.params;
  if (!Object.keys(urlDatabase).includes(id)) {
    return res.status(404).send('URL not found');
  }
  const { userID } = urlDatabase[id];
  if (user.id !== userID) {
    return res.status(401).send('Only the owner of the record can delete it');
  }
  delete urlDatabase[id];
  return res.redirect('/urls');
});
app.post('/urls/:id', (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) {
    return res.status(401).send('Only logged-in users can update records');
  }
  const { id } = req.params;
  if (!Object.keys(urlDatabase).includes(id)) {
    return res.status(404).send('URL not found');
  }
  const { userID } = urlDatabase[id];
  if (user.id !== userID) {
    return res.status(401).send('Only the owner of the record can update it');
  }
  const longURL = fixHTTP(req.body.newURL);
  urlDatabase[id] = { ...urlDatabase[id], longURL };
  return res.redirect('/urls');
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);
  const passMatch = await bcrypt.compare(password, user.password);
  console.log('password match:', passMatch);
  if (!user || !passMatch) {
    return res.status(403).send('Incorrect email or password');
  }
  return res.cookie('user_id', user.id).redirect('/urls');
});
app.post('/logout', (req, res) => {
  res.clearCookie('user_id').redirect('/urls');
});

app.listen(port);
