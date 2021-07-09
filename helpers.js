// prepends protocol to the addresses that don't have it
const fixHTTP = (address) =>
  (address.startsWith('http://') ? address : `http://${address}`);

// returns the user with given email if found, undefined otherwise
const findUser = (searchEmail, db) =>
  Object.values(db).find(({ email }) => email === searchEmail);

// returns an object with urls that the user with given id owns
const urlsForUser = (id, db) =>
  Object.fromEntries(
    // filter the entries, matching the owner userID
    Object.entries(db).filter(([, { userID }]) => userID === id),
  );

export { fixHTTP, findUser, urlsForUser };
