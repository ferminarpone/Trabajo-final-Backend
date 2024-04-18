
export const validateUser = async (req, res, next) => {
  const { first_name, last_name, email, age, password } = req.body;
  const arrayUser = [first_name, last_name, email, age, password];
  const required = arrayUser.includes(undefined) || arrayUser.includes("");
  if (required) {
    return res.status(401).json({
      error: "Se debe completar todos los campos requeridos",
    });
  }
  next();
};
