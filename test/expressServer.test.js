import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../expressServer.js';

chai.use(chaiHttp);

const auth = (agent) =>
  agent
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({ email: 'a@b.c', password: 'password' });

describe('#expressServer without authorization', () => {
  const inst = chai.request(app).keepOpen();
  after(() => inst.close());
  it('GET  /', async () => {
    const res = await inst.get('/');
    expect(res).redirectTo(/\/login$/);
  });
  it('GET  /urls', async () => {
    const res = await inst.get('/urls');
    expect(res).status(401);
  });
  it('GET  /urls/new', async () => {
    const res = await inst.get('/urls/new');
    expect(res).redirectTo(/\/login$/);
  });
  it('GET  /urls/invalid', async () => {
    const res = await inst.get('/urls/invalid');
    expect(res).status(404);
  });
  it('GET  /urls/b2xVn2', async () => {
    const res = await inst.get('/urls/b2xVn2');
    expect(res).status(401);
  });
  it('GET  /u/b2xVn2', async () => {
    const res = await inst.get('/u/b2xVn2');
    expect(res).redirectTo(/lighthouselabs/);
  });
  it('GET  /u/invalid', async () => {
    const res = await inst.get('/urls/invalid');
    expect(res).status(404);
  });
  it('POST /urls', async () => {
    const res = await inst.post('/urls');
    expect(res).status(401);
  });
  it('POST /urls/b2xVn2', async () => {
    const res = await inst.post('/urls/b2xVn2');
    expect(res).status(401);
  });
  it('POST /urls/b2xVn2/delete', async () => {
    const res = await inst.post('/urls/b2xVn2/delete');
    expect(res).status(401);
  });
  it('GET  /login', async () => {
    const res = await inst.get('/login');
    expect(res).status(200);
  });
  it('GET  /register', async () => {
    const res = await inst.get('/register');
    expect(res).status(200);
  });
  it('POST /login with incorrect credentials', async () => {
    const res = await inst
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'a@b.c', password: 'wrong' });
    expect(res).status(403);
  });
  it('POST /login with correct credentials', async () => {
    const res = await inst
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'a@b.c', password: 'password' });
    expect(res).redirectTo(/\/urls$/);
  });
  it('POST /register with empty fields', async () => {
    const res = await inst
      .post('/register')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: '', password: '' });
    expect(res).status(400);
  });
  it('POST /register with existing email', async () => {
    const res = await inst
      .post('/register')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'a@b.c', password: 'any' });
    expect(res).status(400);
  });
  it('POST /register happy path', async () => {
    const res = await inst
      .post('/register')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'new@email.com', password: 'password' });
    expect(res).redirectTo(/\/urls$/);
  });
  it('POST /logout', async () => {
    const res = await inst.post('/logout');
    expect(res).redirectTo(/\/urls$/);
  });
});

describe('#expressServer with authorization', () => {
  const agent = chai.request.agent(app);
  after(() => agent.app.close());
  it('POST /login', async () => {
    const res = await auth(agent);
    expect(res).redirectTo(/\/urls$/);
  });
  it('GET  /', async () => {
    const res = await agent.get('/');
    expect(res).redirectTo(/\/urls$/);
  });
  it('GET  /urls', async () => {
    const res = await agent.get('/urls');
    expect(res).status(200);
  });
  it('GET  /urls/new', async () => {
    const res = await agent.get('/urls/new');
    expect(res).status(200);
  });
  it('GET  /urls/b2xVn2 (authorized)', async () => {
    const res = await agent.get('/urls/b2xVn2');
    expect(res).status(200);
  });
  it('GET  /urls/9sm5xK (unauthorized)', async () => {
    const res = await agent.get('/urls/9sm5xK');
    expect(res).status(401);
  });
  it('POST /urls', async () => {
    const res = await agent
      .post('/urls')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ longURL: 'example.edu' });
    expect(res).redirectTo(/\/urls\//);
  });
  it('POST /urls/b2xVn2 (authorized)', async () => {
    const res = await agent
      .post('/urls/b2xVn2')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ newURL: 'example.edu' });
    expect(res).redirectTo(/\/urls$/);
  });
  it('POST /urls/9sm5xK (unauthorized)', async () => {
    const res = await agent
      .post('/urls/9sm5xK')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ newURL: 'example.edu' });
    expect(res).status(401);
  });
  it('POST /urls/b2xVn2/delete (authorized)', async () => {
    const res = await agent.post('/urls/b2xVn2/delete');
    expect(res).redirectTo(/\/urls$/);
  });
  it('POST /urls/9sm5xK/delete (unauthorized)', async () => {
    const res = await agent.post('/urls/9sm5xK/delete');
    expect(res).status(401);
  });
  it('GET  /login', async () => {
    const res = await agent.get('/login');
    expect(res).redirectTo(/\/urls$/);
  });
  it('GET  /register', async () => {
    const res = await agent.get('/register');
    expect(res).redirectTo(/\/urls$/);
  });
});
