const $homePage = document.querySelector('.home-page');
const $namePage = document.querySelector('.name-page');
const $brName = document.querySelector('#brewery-name');
const $nameForm = document.querySelector('.form-name');
const $cityForm = document.querySelector('.form-city');

const $return = document.querySelector('.return');
$return.addEventListener('click', e => {
  $homePage.className = 'container home-page';
  $namePage.className = 'container name-page hidden';

  $nameForm.reset();
  $cityForm.reset();

});

$brName.addEventListener('keydown', function (e) {
  if (event.code === 'Enter') {
    event.preventDefault();
    const nameSearch = $brName.value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.openbrewerydb.org/v1/breweries?by_name=' + nameSearch);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      for (let i = 0; i < xhr.response.length; i++) {
        renderBrList(xhr.response[i]);
      }
    });
    xhr.send();

    $homePage.classList.add('hidden');
    $namePage.classList.remove('hidden');

    if (xhr.response < 10) {
      document.querySelector('.page-turner').className = 'page-turner hidden';
    }
  }
});

const $brList = document.querySelector('.br-list');

function renderBrList(brewery) {
  const $li = document.createElement('li');

  const $div1 = document.createElement('div');
  $div1.className = 'br-header';

  $li.append($div1);

  const $h3 = document.createElement('h3');
  $h3.className = 'br-name';
  $h3.textContent = brewery.name;

  const $plus = document.createElement('a');
  $plus.className = 'plus';
  $plus.textContent = '+';

  $div1.append($h3, $plus);

  const $address = document.createElement('p');
  $address.className = 'description';

  const address1 = brewery.address_1;
  const city = brewery.city;
  const state = brewery.state_province;
  const postal = brewery.postal_code.slice(0, 5);
  $address.textContent = `Address: ${address1}, ${city}, ${state}, ${postal}`;

  $li.appendChild($address);

  const $phone = document.createElement('p');
  $phone.className = 'description';

  if (brewery.phone != null) {
    const phone = brewery.phone;
    $phone.textContent = `Call: (${phone.slice(0, 3)})${phone.slice(3, 6)}-${phone.slice(6, 10)}`;

    $li.appendChild($phone);
  }

  if (brewery.website_url != null) {
    const $website = document.createElement('p');
    $website.className = 'description';
    $website.textContent = `Website: ${brewery.website_url}`;

    $li.appendChild($website);
  }

  if (brewery.brewery_type != null) {
    const $type = document.createElement('p');
    $type.className = 'description';
    $type.textContent = `Type: ${brewery.brewery_type[0].toUpperCase()}${brewery.brewery_type.slice(1, brewery.brewery_type.length)}`;

    $li.appendChild($type);
  }

  $brList.appendChild($li);
}
