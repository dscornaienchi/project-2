const router = require('express').Router();
const { User } = require('../../models');

router.get('/login', (req, res) => {
  res.render('login', { errorMessage: req.session.errorMessage });
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      return res.redirect('/login'); // Redirect back to the login page
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return res.redirect('/login'); // Redirect back to the login page
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      console.log(
        'File: user-routes.js ~ line 57 ~ req.session.save ~ req.session.cookie',
        req.session.cookie
      );
      res
        .status(200)
        .json({ user: userData, message: 'You are now logged in!' });
    });

    // req.session.user_id = userData.id;
    // req.session.username = userData.username;
    // req.session.logged_in = true;

    res.redirect('/homepage'); // Redirect to the homepage or any other desired page
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;