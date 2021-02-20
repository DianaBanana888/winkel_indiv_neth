const navUser = document.getElementById('nav-user');
const modal = document.getElementById('modal-form');
const modalContent = document.querySelector('.modal-content');
const topWindow = document.querySelector('.top-window') || null;
const navButtonMobile = document.querySelector('.nav-button-mobile');

navButtonMobile.addEventListener('click', (e) => {
  document.getElementById('nav-user').classList.toggle('open-menu');
});

if (topWindow) {
  document.addEventListener('scroll', (e) => {
    const numCss = 1 - (window.scrollY / 100);
    if (numCss >= -0.5) {
      topWindow.style.cssText = `
        opacity: ${numCss}`;
    }
  });
}
// всплывающие формы регистрации и логина для юзеров
function openModalForm(type = null, title = null, name = null) {
  modalContent.innerHTML = '';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('open');
  }, 100);

  const formRegister = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/auth/${type}" class="input-field form-auth col s12">
      <div class="input-field col s12">
        <i class="material-icons prefix">person_outline</i>
        <input placeholder="login" name="login" type="text"  class="autocomplete" required>
      </div>
      <div class="input-field col s12">
      <i class="material-icons prefix">person_outline</i>
      <input placeholder="email" name="email" id="email" type="email" class="validate" required>
      <label for="email"></label>
    </div>
      <div class="input-field col s12">
        <i class="material-icons prefix">https</i>
        <input placeholder="password" name="password" type="password" class="autocomplete pass-auth" required>
        <a class="password-control">
        <span class="material-icons eye">visibility</span>
        </a>
      </div>

      <div class="input-field col s12">
      <div id="select-status">
        <select id="select-status" name="status" size="2">
          <option id="seller" type="text" class="status" value="seller">Seller</option>
          <option id="buyer" type="text" class="status" value="buyer">Buyer</option>
        </select>
      </div>
      </div>

      <div class="form-error"></div>
      <button type="submit" class="waves-effect answerBtn form-button">${title}</button>

    </form>
  `;

  const formLogin = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/auth/${type}" class="input-field form-auth col s12">
      <div class="input-field col s12">
        <i class="material-icons prefix">person_outline</i>
        <input placeholder="email" name="email" id="email" type="email" class="validate" required>
        <label for="email"></label>
      </div>
      <div class="input-field col s12">
        <i class="material-icons prefix">https</i>
        <input placeholder="password" name="password" type="password" class="autocomplete pass-auth" required>
        <a class="password-control">
        <span class="material-icons eye">visibility</span>
        </a>
      </div>

      <div class="form-error"></div>
      <button type="submit" class="waves-effect answerBtn form-button">${title}</button>

    </form>
  `;

  if (name === 'register') modalContent.insertAdjacentHTML('beforeend', formRegister);
  if (name === 'login') modalContent.insertAdjacentHTML('beforeend', formLogin);

  modalContent.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let data = {};
    if (event.target.login.value) {
      data = {
        name: event.target.login.value,
        email: event.target.email.value,
        password: event.target.password.value,
        status: event.target.status.value,
      };
    } else {
      data = {
        email: event.target.email.value,
        password: event.target.password.value,
      };
    }

    const response = await fetch(event.target.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.message !== 'OK') {
      document.querySelector('.form-error').innerHTML = `
      <p style="color:red">${result.message}</p>
      `;
    } else {
      modal.style.display = 'none';
      window.location.href = '/';
    }
  });

  document.querySelector('.password-control').addEventListener('click', () => {
    const pass = document.querySelector('.pass-auth');
    if (pass.getAttribute('type') === 'password') {
      pass.setAttribute('type', 'text');
    } else {
      pass.setAttribute('type', 'password');
    }
  });

  modal.addEventListener('click', (e) => {
    const target = e.target.classList.contains('modal-form');
    if (target) {
      modal.style.display = 'none';
      modal.classList.remove('open');
      window.location = '/';
    }
  });
}

// всплывающие формы добавления товаров
function createItem(type = null, title = null, name = null) {
  modalContent.innerHTML = '';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('open');
  }, 100);

  const formNewItem = `
    <h3 class="title-form">${title}</h3>
    <form name="${name}" action="/${type}" class="input-field form-auth col s12">
      <div class="input-field col s12">
        <input placeholder="artikel" name="article" type="text"  
        class="article" maxlength="20" required>
      </div>

      <div class="input-field col s12">
        <input placeholder="naam" name="name" type="text"  
        class="name" maxlength="30" required>
      </div>

      <div class="input-field col s12">
        <input placeholder="omschrijving" name="description" type="text"  
        class="description" maxlength="300" required>
      </div>

      <div class="input-field col s12">
      <input placeholder="prijs" name="price" type="number"  
      class="price" min="1" max="999"  required>
    </div>

    <div class="input-field col s12">
        <input placeholder="aantal" name="quantity" type="number"  
        class="quantity" min="1" max="999" required>
      </div>

      <div class="input-field col s12">
      <input placeholder="foto link" class="foto" name="foto" type="text"  
      alt="Submit"> 
      </div>
      

      <div class="form-error"></div>
      <button type="submit" class="waves-effect answerBtn form-button">${title}</button>

    </form>
  `;
  modalContent.insertAdjacentHTML('beforeend', formNewItem);

  modalContent.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const data = {
      article: event.target.article.value,
      name: event.target.name.value,
      description: event.target.description.value,
      price: event.target.price.value,
      quantity: event.target.quantity.value,
      foto: event.target.foto.value,
    };
    const response = await fetch(event.target.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.message !== 'OK') {
      document.querySelector('.form-error').innerHTML = `
      <p style="color:red">${result.message}</p>
      `;
    } else {
      modal.style.display = 'none';
      window.location.href = '/';
    }
  });

  modal.addEventListener('click', (e) => {
    const target = e.target.classList.contains('modal-form');
    if (target) {
      modal.style.display = 'none';
      modal.classList.remove('open');
      window.location = '/';
    }
  });
}

// главная часть нажатия клавиш
navUser.addEventListener('click', (e) => {
  if (e.target.classList.contains('register-user')) {
    openModalForm('register', 'Registreer', 'register');
  }
  if (e.target.classList.contains('input-user')) {
    openModalForm('login', 'LogIn', 'login');
  }
  if (e.target.classList.contains('create-item')) {
    createItem('createItem', 'Goederen toevoegen', 'createItem');
  }
});
