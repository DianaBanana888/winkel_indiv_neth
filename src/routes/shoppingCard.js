const express = require('express');
const { isAuth } = require('../../middleware/auth');
const User = require('../../models/User');
const Item = require('../../models/Item');

const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  const itemsInShoppingCard = (await User.findById(req.session.user.id)).shoppingCard;
  const ItemsArray = [];
  itemsInShoppingCard.forEach(async (itemInShoppingCard) => {
    const finder = await Item.findById(itemInShoppingCard.id);
    ItemsArray.push({
      itemInfo: finder,
      wantedQuantity: itemInShoppingCard.quantity,
    });
  });
  res.render('shoppingCard.hbs', { ItemsArray });
});

router.delete('/:id', async (req, res, next) => {
  const basketNew = [];
  const basket = (await User.findById(req.session.user.id)).shoppingCard;
  basket.forEach((el) => {
    if (el.id !== req.body.id) {
      basketNew.push(el);
    }
  });
  await User.findOneAndUpdate({ _id: req.session.user.id }, { shoppingCard: basketNew });

  res.json({ message: 'OK' });
});

module.exports = router;
