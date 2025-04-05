export const validateLogin = (email, password) => {
  const errors = {};
  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
};

export const validateRegister = (
  username,
  firstname,
  lastname,
  email,
  password
) => {
  const errors = {};
  if (!username) errors.username = "Username is required";
  if (!firstname) errors.firstname = "First name is required";
  if (!lastname) errors.lastname = "Last name is required";
  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
};
