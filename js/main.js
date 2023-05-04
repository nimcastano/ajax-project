const $homePage = document.querySelector('.home-page');
const $namePage = document.querySelector('.name-page');
const $randomPage = document.querySelector('.random-page');
const $cityPage = document.querySelector('.city-page');
const $favesPage = document.querySelector('.faves-page');
const $brName = document.querySelector('#brewery-name');
const $brCity = document.querySelector('#city-name');
const $nameForm = document.querySelector('.form-name');
const $cityForm = document.querySelector('.form-city');
const $brNameList = document.querySelector('#name-list');
const $brCityList = document.querySelector('#city-list');
const $brRandomList = document.querySelector('#rndm-list');
const $favesList = document.querySelector('#faves-list');
const $addModal = document.querySelector('.add-modal');
const $deleteModal = document.querySelector('.delete-modal');
let nameSearch;
let citySearch;
let $plus;
let $minus;
const $pageCols = document.querySelectorAll('.page-col');
const $pgBackCity = document.querySelector('.pg-back-city');
const $pgFwdCity = document.querySelector('.pg-fwd-city');
let cityPageNum;
const $pgBackName = document.querySelector('.pg-back-name');
const $pgFwdName = document.querySelector('.pg-fwd-name');
let namePageNum;

function pageTurner(xhr) {
  if (xhr.length > 14) {
    $pageCols.forEach(el => {
      el.classList.remove('hidden');
    });
  }
}

const $return = document.querySelector('.return');

$return.addEventListener('click', e => {
  $homePage.className = 'container home-page';
  $namePage.className = 'container name-page hidden';
  $randomPage.className = 'container random-page hidden';
  $cityPage.className = 'container city-page hidden';
  $favesPage.className = 'container faves-page hidden';
  $addModal.className = 'add-modal modal-container hidden';
  $deleteModal.className = 'delete-modal modal-container hidden';

  $nameForm.reset();
  $cityForm.reset();

  $brNameList.replaceChildren();
  $brRandomList.replaceChildren();
  $brCityList.replaceChildren();
  $favesList.replaceChildren();

});

function getNameList(name, pageNum) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.openbrewerydb.org/v1/breweries?per_page=15&page=${pageNum}&by_name=${name}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pageTurner(xhr.response);
    for (let i = 0; i < xhr.response.length; i++) {
      $brNameList.append(renderBrList(xhr.response[i]));
    }

  });
  xhr.send();
}

$brName.addEventListener('keydown', function (e) {
  if (event.code === 'Enter') {
    event.preventDefault();

    nameSearch = $brName.value;
    namePageNum = 1;
    getNameList(nameSearch, namePageNum);

    $homePage.classList.add('hidden');
    $namePage.classList.remove('hidden');
  }
});

function getCityList(city, pageNum) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.openbrewerydb.org/v1/breweries?per_page=15&page=${pageNum}&by_city=${city}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pageTurner(xhr.response);
    for (let i = 0; i < xhr.response.length; i++) {
      $brCityList.append(renderBrList(xhr.response[i]));
    }

  });
  xhr.send();
}

$brCity.addEventListener('keydown', e => {
  if (event.code === 'Enter') {
    event.preventDefault();

    citySearch = $brCity.value;
    citySearch = citySearch[0].toUpperCase() + citySearch.slice(1, citySearch.length).toLowerCase();
    const $cityIntro = document.querySelector('.city-page-intro');
    $cityIntro.textContent = `Breweries in ${citySearch}`;
    cityPageNum = 1;
    getCityList(citySearch, cityPageNum);

    $homePage.classList.add('hidden');
    $cityPage.classList.remove('hidden');
  }
});

function renderBrList(brewery, minus) {
  const $li = document.createElement('li');

  $li.className = brewery.id;

  const $div1 = document.createElement('div');
  $div1.className = 'br-header';

  $li.append($div1);

  const $h3 = document.createElement('h3');
  $h3.className = 'br-name';
  $h3.textContent = brewery.name;

  if (!minus) {
    const $plus = document.createElement('a');
    $plus.className = 'plus';
    $plus.textContent = '+';

    $div1.append($h3, $plus);
  } else {
    const $minus = document.createElement('a');
    $minus.className = 'minus';
    $minus.textContent = '-';

    $div1.append($h3, $minus);
  }

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
    $website.textContent = 'Website: ';
    const $url = document.createElement('a');
    $url.setAttribute('href', brewery.website_url);
    $url.textContent = brewery.website_url;

    $website.appendChild($url);

    $li.appendChild($website);
  }

  if (brewery.brewery_type != null) {
    const $type = document.createElement('p');
    $type.className = 'description';
    $type.textContent = `Type: ${brewery.brewery_type[0].toUpperCase()}${brewery.brewery_type.slice(1, brewery.brewery_type.length)}`;

    $li.appendChild($type);
  }
  return $li;
}

// random button

const $randomBtn = document.querySelector('.random-btn');

$randomBtn.addEventListener('click', e => {

  const $brList = document.createElement('ul');
  $brList.className = 'br-list';

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.openbrewerydb.org/v1/breweries/random');
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {

    $brRandomList.append(renderBrList(xhr.response[0]));
  });

  xhr.send();

  $homePage.className = 'container home-page hidden';
  $randomPage.className = 'container random-page';

});

// saved breweries list button

const $savedBtn = document.querySelector('.saved-btn');

$savedBtn.addEventListener('click', e => {

  $homePage.className = 'container home-page hidden';
  $favesPage.className = 'container faves-page';

  data.entries.forEach(el => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.openbrewerydb.org/v1/breweries/' + el);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      $favesList.append(renderBrList(xhr.response, true));
    });
    xhr.send();

  });
});

// plus buttons

const $addIntro = document.querySelector('.add-intro');

document.addEventListener('click', e => {
  if (e.target.className === 'plus') {
    $plus = e.target;
    $addModal.classList.remove('hidden');
    $addIntro.textContent = `Are you sure you want to add
     ${$plus.closest('div').firstChild.textContent} to your favorites list?`;
  }
});

const $nopes = document.querySelectorAll('.nope');

$nopes.forEach(el => {
  el.addEventListener('click', e => {
    $addModal.className = 'add-modal modal-container hidden';
    $deleteModal.className = 'delete-modal modal-container hidden';
  });
});

const $addIt = document.querySelector('.add-it');

$addIt.addEventListener('click', e => {
  data.entries.push($plus.closest('li').className);
  $addModal.classList.add('hidden');
});

// minus buttons

const $deleteIntro = document.querySelector('.delete-intro');

document.addEventListener('click', e => {
  if (e.target.className === 'minus') {
    $minus = e.target;
    $deleteModal.classList.remove('hidden');
    $deleteIntro.textContent = `Are you sure you want to retire
      ${$minus.closest('div').firstChild.textContent}?`;
  }
});

const $deleteIt = document.querySelector('.delete-it');

$deleteIt.addEventListener('click', e => {
  const $deleteThis = $minus.closest('li').className;
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i] === $deleteThis) {
      data.entries.splice(i, 1);
    }
  }

  $deleteModal.classList.add('hidden');

  $favesList.replaceChildren();

  data.entries.forEach(el => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.openbrewerydb.org/v1/breweries/' + el);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      $favesList.append(renderBrList(xhr.response, true));
    });
    xhr.send();

  });
});

// turn pages

$pgFwdCity.addEventListener('click', e => {
  $brCityList.replaceChildren();
  cityPageNum++;
  getCityList(citySearch, cityPageNum);
  $pgBackCity.classList.remove('invisible');
});

$pgBackCity.addEventListener('click', e => {
  $brCityList.replaceChildren();
  cityPageNum--;
  getCityList(citySearch, cityPageNum);
});

$pgFwdName.addEventListener('click', e => {
  $brNameList.replaceChildren();
  namePageNum++;
  getNameList(nameSearch, namePageNum);
  $pgBackName.classList.remove('invisible');
});

$pgBackName.addEventListener('click', e => {
  $brNameList.replaceChildren();
  namePageNum--;
  getNameList(nameSearch, namePageNum);
});
