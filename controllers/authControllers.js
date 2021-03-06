const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//? error handling during signup and signin
const handleErrors = (err) => {
  //console.log(err.message, err.code, "code");
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  //? signin page errors
  if (err.message === "incorrect username") {
    errors.username = "that username is not registered";
  }
  if (err.message === "incorrect email") {
    errors.username = "username and email donot match";
    errors.email = "username and email donot match";
  }
  if (err.message === "incorrect password") {
    errors.password = "that password is not correct";
  }

  //? duplicate error code  signup page errors
  if (err.code === 11000) {
    errors.email = "that email is already taken";
    return errors;
  }
  //?  signup validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//? jwt
const maxAge = 3 * 24 * 60 * 60; //? 3 days

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};

//? signup post
module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    /*  res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    }); */
    res.status(201).json({ token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

//? signin post
module.exports.login_post = async (req, res) => {
  const { username, email, password } = req.body;

  // checking if inputs has length or not
  if (!username.length && !email.length && !password.length) {
    res.json({
      errors: {
        username: "please enter username",
        email: "please enter email",
        password: "please enter password",
      },
    });
    return;
  } else if (username.length && !email.length && !password.length) {
    res.json({
      errors: {
        email: "please enter email",
        password: "please enter password",
      },
    });
    return;
  } else if (username.length && email.length && !password.length) {
    res.json({
      errors: {
        password: "please enter password",
      },
    });
    return;
  } else if (!username.length && email.length && !password.length) {
    res.json({
      errors: {
        username: "please enter username",
        password: "please enter password",
      },
    });
    return;
  } else if (!username.length && email.length && password.length) {
    res.json({
      errors: {
        username: "please enter username",
      },
    });
    return;
  } else if (username.length && !email.length && password.length) {
    res.json({
      errors: {
        email: "please enter email",
      },
    });
    return;
  } else if (!username.length && !email.length && password.length) {
    res.json({
      errors: {
        username: "please enter username",
        email: "please enter email",
      },
    });
    return;
  }

  try {
    const user = await User.login(username, email, password);
    const token = createToken(user._id);
    /*   res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    }); */

    res.status(201).json({ token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

module.exports.dashboard_get = (req, res) => {
  res.json({ user: res.locals.user });
};

module.exports.logout_post = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json({ loggedOut: true });
};

module.exports.valid_get = (req, res) => {
  res.status(200).json(res.locals.user);
};

module.exports.change_info_post = async (req, res) => {
  if (res.locals.user.id == req.body.userId) {
    if (!req.body.type || !req.body.value) {
      res.status(500).json({ error: "must have type and value" });
      return;
    }

    try {
      const changeType = req.body.type;
      const changeValue = req.body.value;
      const userId = req.body.userId;

      // username
      if (changeType === "username") {
        await User.updateOne(
          { _id: userId },
          {
            $set: { username: changeValue },
          },
          { new: true }
        );
        res.status(200).json({ success: "true" });
        return;
      }

      // email
      if (changeType === "email") {
        await User.updateOne(
          { _id: userId },
          {
            $set: { email: changeValue },
          },
          { new: true }
        );
        res.status(200).json({ success: "true" });
        return;
      }

      // password
      if (changeType === "password") {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(changeValue, salt);

        await User.updateOne(
          { _id: userId },
          {
            $set: { password: passwordHash },
          },
          { new: true }
        );
        res.status(200).json({ success: "true" });
        return;
      }
    } catch (err) {
      res.status(401).json({ error: "unauthorized user" });
    }
  } else {
    res.status(500).json({ error: "invalid user" });
  }
};
