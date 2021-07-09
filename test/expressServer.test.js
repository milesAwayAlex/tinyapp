import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../expressServer.js';

chai.use(chaiHttp);

describe('#expressServer', () => {
  it('returns status 200 for GET /', async () => {
    const inst = chai.request(app);
    const res = await inst.get('/');
    expect(res).status(200);
  });
});
