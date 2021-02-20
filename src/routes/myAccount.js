const express = require('express');
const { isAuth, isSameAuthor } = require('../../middleware/auth');
const Item = require('../../models/Item');

const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  const itemsAuthor = await Item.find({ authorId: req.session.user.id });
  res.render('seller/myAccount.hbs', { itemsAuthor });
});

// edit
router.get('/:id/edit', isSameAuthor, async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  res.render('seller/edit', { item });
});

router.put('/:id', isSameAuthor, async (req, res, next) => {
  await Item.findOneAndUpdate({ _id: req.params.id },
    {
      article: req.body.article,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      foto: req.body.foto,
      updatedAt: new Date(),
    }, { new: true });

  res.json({ message: 'OK' });
});
// delete
router.delete('/:id', isAuth, isSameAuthor, async (req, res, next) => {
  await Item.deleteOne({ _id: req.params.id });
  res.json({ message: 'OK' });
});

module.exports = router;
