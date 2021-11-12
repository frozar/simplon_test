import { apiHandler, omit } from "helpers/api";

export default apiHandler({
  post: authenticate,
});

function authenticate(req, res) {
  const { username, password } = req.body;
  // console.log({ username, password });
  // const user = usersRepo.find(
  //   (x) => x.username === username && x.password === password
  // );
  // console.log("AUTHORISED_LOGIN", process.env.AUTHORISED_LOGIN);
  // console.log("AUTHORISED_PASSWORD", process.env.AUTHORISED_PASSWORD);
  // user {
  //   id: 1,
  //   username: 'test',
  //   password: 'test',
  //   firstName: 'Test',
  //   lastName: 'User'
  // }
  const user =
    username === process.env.AUTHORISED_LOGIN &&
    password === process.env.AUTHORISED_PASSWORD
      ? {
          id: 1,
          username,
          password,
          firstName: "Armand",
          lastName: "Deniset",
        }
      : null;

  // console.log("user", user);
  // throw "Anyway";

  if (!user) throw "Login ou password pas correct";

  // return basic user details on success
  return res.status(200).json(omit(user, "password"));
}
