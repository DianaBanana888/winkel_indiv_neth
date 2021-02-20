const express = require('express');

const Item = require('../../models/Item');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    article, name, description, price, quantity, foto,
  } = req.body;

  const item = await new Item({
    article,
    name,
    description,
    price,
    quantity,
    foto,
    updatedAt: new Date(),
    authorId: req.session.user.id,
  });
  item.save();
  return res.json({ message: 'OK' });
});

module.exports = router;
