const fixHTTP = (address) =>
  (address.includes('http') ? address : `http://${address}`);
const findUser = (searchEmail, db) =>
  Object.values(db).find(({ email }) => email === searchEmail);
const urlsForUser = (id, db) =>
  Object.fromEntries(
    Object.entries(db).filter(([, { userID }]) => userID === id),
  );

export { fixHTTP, findUser, urlsForUser };
