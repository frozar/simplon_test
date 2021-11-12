import jwt from "jsonwebtoken";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end("Bad method");
  }
  try {
    if (req.body.login !== process.env.AUTHORISATION_LOGIN) {
      res.status(401).end("Wrong login");
    } else if (req.body.password !== process.env.AUTHORISATION_PASSWORD) {
      res.status(401).end("Wrong password");
    } else {
      const user = { name: "anonymous" };

      const accessToken = jwt.sign(user, process.env.TOKEN_KEY, {
        expiresIn: "15m",
      });

      res.status(201).json({ accessToken });
    }
  } catch (error) {
    res.status(400).end(error);
  }
};
