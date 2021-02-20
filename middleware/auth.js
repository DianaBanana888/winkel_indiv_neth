const bcrypt = require('bcrypt');
const User = require('../models/User');
const Item = require('../models/Item');

const isNotFound = (req, res) => {
  res.status(404).render('404.hbs');
};
const isError = (err, req, res) => {
  res.status(500).render('/error');
};
const isLocalName = async (req, res, next) => {
  if (req.session.user) {
    const userUnkn = await User.findOne({ _id: req.session.user.id });
    res.locals.username = req.session.user.name;

    if (userUnkn.status === 'buyer') {
      res.locals.nameBuyer = true;
      res.locals.nameSeller = false;
    }
    if (userUnkn.status === 'seller') {
      res.locals.nameBuyer = false;
      res.locals.nameSeller = true;
    }
  }
  next();
};

const isCorrectInput = async (req, res, next) => {
  const { name, password } = req.body;
  const regPas = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,30}$/);
  const regName = new RegExp(/^[a-zA-Z0-9_]{4,20}$/);

  if (!regName.test(name)) {
    return res.json({
      message: 'De naam moet minimaal 4 tekens lang zijn en mag niet meer dan 20 zijn. \
      De naam moet letters of cijfers bevatten.',
    });
  }

  if (!regPas.test(password)) {
    return res.json({
      message: 'Wachtwoord moet minimaal 6 tekens en niet meer dan 30 zijn. \
      Wachtwoord moet minstens één hoofdletter bevatten, \
      een kleine letter en een cijfer.',
    });
  }

  next();
};

const isValidPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!(await bcrypt.compare(password, user.password))) {
    res.json({ message: 'Verkeerd wachtwoord, probeer het opnieuw.' });
  } else next();
};

const isAlreadyRegistered = async (req, res, next) => {
  const { email } = req.body;
  const candidate = await User.findOne({ email });
  if (candidate) {
    return res.status(400).json({ message: 'Er bestaat al een gebruiker met dit e-mailadres' });
  } next();
};

const isAuth = async (req, res, next) => {
  if (!req.session.user) {
    res.json({ message: 'Log in of Registreer' });
  } else next();
};

const isSameAuthor = async (req, res, next) => {
  const { authorId } = await Item.findOne({ _id: req.params.id });
  if (authorId) {
    // if (req.session?.user?.id === authorId.toString()) {
    //   next();
    // } else {
    //   res.send('Available only for the author');
    // }
    var _req$session, _req$session$user;

    if (((_req$session = req.session) === null || _req$session === void 0 ? void 0 : (_req$session$user = _req$session.user) === null || _req$session$user === void 0 ? void 0 : _req$session$user.id) === authorId.toString()) {
      next();
    } else {
      res.send('Available only for the author');
    }

  }
};




const isAdmin = async (req, res, next) => {
  if (res.locals.nameAdmin) {
    next();
  } else {
    res.json({ message: 'Je hebt niet genoeg rechten, sorry' });
  }
};

module.exports = {
  isNotFound,
  isError,
  isLocalName,
  isAuth,
  isAdmin,
  isAlreadyRegistered,
  isValidPassword,
  isCorrectInput,
  isSameAuthor,
};
