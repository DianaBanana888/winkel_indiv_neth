// edit page
const itemEditForm = document.forms.editItem;

if (itemEditForm) {
  itemEditForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
      article: event.target.article.value,
      name: event.target.name.value,
      description: event.target.description.value,
      price: event.target.price.value,
      quantity: event.target.quantity.value,
      foto: event.target.foto.value,
    };

    const response = await fetch(event.target.action, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.message === 'OK') {
      window.location.href = '/myAccount';
    } else {
      alert('Het spijt me!');
    }
  });
}

const deleteButtons = document.querySelectorAll('.button.delete-button');
deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const data2 = {
      id: event.target.id,
    };
    const response = await fetch(`/myAccount/${event.target.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data2),
    });
    const result = await response.json();

    if (result.message === 'OK') {
      window.location.href = '/myAccount';
    } else {
      alert('Het spijt me!');
    }
  });
});

// add items to shopping card
const ButtonProductItems = document.querySelectorAll('.add-shopping-card');
ButtonProductItems.forEach((ButtonProductItem) => {
  ButtonProductItem.addEventListener('click', async (event) => {
    event.preventDefault();

    const data3 = {
      id: event.target.id,
      quantity: event.target.parentNode.children[3].children[0].value,
    };

    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data3),
    });
    const result = await response.json();

    if (result.message === 'OK') {
      // window.location.href = '/shoppingCard';
      alert('Dank u wel! Uw item staat in WinkelWagen');
    } else {
      alert(`Het spijt me! u kunt geen ${data3.quantity} stuks bestellen.`);
    }
  });
});

const removeButtons = document.querySelectorAll('.button.remove-button');
removeButtons.forEach((removeButton) => {
  removeButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const data4 = {
      id: event.target.id,
    };
    const response = await fetch(`/shoppingCard/${event.target.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data4),
    });
    const result = await response.json();

    if (result.message === 'OK') {
      window.location.href = '/shoppingCard';
    } else {
      alert('Het spijt me!');
    }
  });
});

async function getWeatherInfo(position) {
  const data = {};
  data.lat = position.coords.latitude;
  data.lng = position.coords.longitude;

  const response = await fetch('/getweatherinfo', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result) {
    document.getElementById('a1').innerHTML = `
  Today in ${result.city}:
 
  Temperature ${result.temp},

  Feels like ${result.feels_like},

  ${result.description},

  wind speed ${result.wind_speed},

  Humidity ${result.humidity}
  `;
  } else {
    document.getElementById('a1').innerHTML = `
    To see the weather allow to know your location
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeatherInfo);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

getLocation();
