// users in JSON file for simplicity, store in a db for production applications
// let users = require('data/users.json');
let users = [];

export const usersRepo = {
  getAll: () => users,
  find: (x) => users.find(x),
};
