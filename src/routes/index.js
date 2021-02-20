const express = require('express');
const fetch = require('node-fetch');

const Item = require('../../models/Item');
const User = require('../../models/User');

const router = express.Router();

async function calculateCity(position) {
  const { lat } = position;
  const { lng } = position;

  const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=doyRVEap2ANs2AMjNDwcf9UgSB4Emweg&location=${lat}%2C${lng}&outFormat=json&thumbMaps=false`,
    {});
  const json = await response.json();

  const userAdress = {
    city: json.results[0].locations[0].adminArea5,
    province: json.results[0].locations[0].adminArea3,
    country: json.results[0].locations[0].adminArea1,
  };

  return userAdress;
}

async function calculateWeather(location) {
  const { city } = location;

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=814b23556cdf889891f7a5ba35f667ad`,
    {});
  const json = await response.json();

  const userWeather = {
    city,
    description: json.weather[0].description,
    temp: json.main.temp,
    feels_like: json.main.feels_like,
    humidity: json.main.humidity,
    wind_speed: json.wind.speed,
  };

  return userWeather;
}

router.get('/', async (req, res, next) => {
  const response = await fetch(
    'http://dataservice.accuweather.com/forecasts/v1/daily/1day/249208?apikey=zAszhFx3zwBkqvS7XFlGb7cfHqfAXBJ4',
  );
  const result = await response.json();

  const items = await Item.find();
  res.render('index', {
    items,
    how: result.DailyForecasts[0].Night.IconPhrase,
    temperatureMin: Math.floor((result.DailyForecasts[0].Temperature.Minimum.Value - 32) * (5 / 9)),
    temperatureMax: Math.floor((result.DailyForecasts[0].Temperature.Maximum.Value - 32) * (5 / 9)),
  });
});

router.post('/getweatherinfo', async (req, res) => {
  const infoLocation = await calculateCity(req.body);

  const infoWeather = await calculateWeather(infoLocation);

  res.json(infoWeather);
});

router.post('/', async (req, res) => {
  const {
    id, quantity,
  } = req.body;

  const quantityHasSeller = (await Item.findById(id)).quantity;
  let buyerItemQuantity = 0;
  let buyerItemId = false;
  const itemsHasBuyer = (await User.findById(req.session.user.id)).shoppingCard;
  itemsHasBuyer.forEach((element) => {
    if (element.id === id) {
      buyerItemId = true;
      buyerItemQuantity = element.quantity;
    }
  });
  if (+quantity + +buyerItemQuantity <= +quantityHasSeller) {
    if (buyerItemId) {
      const a = itemsHasBuyer.forEach((element) => {
        if (element.id === id) {
          element.quantity = +buyerItemQuantity + +req.body.quantity;
          // ({ ...element, quantity: +buyerItemQuantity + +req.body.quantity });
        }
      });
      await User.findOneAndUpdate({ _id: req.session.user.id }, { shoppingCard: itemsHasBuyer });
    } else {
      itemsHasBuyer.push({
        id: req.body.id,
        quantity: req.body.quantity,
      });

      await User.findOneAndUpdate({ _id: req.session.user.id }, { shoppingCard: itemsHasBuyer });
    }
    res.json({ message: 'OK' });
  } else {
    res.json({ message: 'Not enough' });
  }
});

module.exports = router;
