import { registerUser, loginUser, logoutUser } from '../services/auth';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const user = await loginUser(req.body);

  res.status(201).json({
    user: { name: user.name, email: user.email },
    token: user.token,
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.user.id);

  res.status(204).send();
};
