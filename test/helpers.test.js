import { expect } from 'chai';
import { fixHTTP, findUser, urlsForUser } from '../helpers.js';

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};
const urls = {
  b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
  '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
};
const urlsForUserCases = [
  {
    dsc: 'return an object with urls filtered for a given userID',
    inp: ['userRandomID', urls],
    out: {
      b2xVn2: {
        longURL: 'http://www.lighthouselabs.ca',
        userID: 'userRandomID',
      },
    },
  },
  {
    dsc: 'return an empty object for an invalid id',
    inp: ['invalidID', urls],
    out: {},
  },
];

const casesFixHTTP = [
  [
    'return the original string when it starts with http://',
    'http://example.edu',
    'http://example.edu',
  ],
  [
    'return http://-prepended string otherwise',
    'example.com',
    'http://example.com',
  ],
];

describe('#getUserByEmail', () => {
  it('return a user with valid email', () => {
    const user = findUser('user@example.com', users);
    const expectedOutput = 'userRandomID';
    expect(user.id).equal(expectedOutput);
  });
  it('return undefined for an invalid email', () =>
    expect(findUser('invalid@nonexistent.com', users)).undefined);
});

describe('#urlsForUser', () => {
  urlsForUserCases.forEach(({ dsc, inp, out }) => {
    it(dsc, () => expect(urlsForUser(...inp)).eql(out));
  });
});

describe('#fixHTTP', () => {
  casesFixHTTP.forEach(([dsc, inp, out]) => {
    it(dsc, () => expect(fixHTTP(inp)).equal(out));
  });
});
