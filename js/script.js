var countries = [];
const app = document.body

// getCountries(); fetch API
async function getCountries() {
    try {
        var response = await fetch('https://restcountries.com/v2/all');
        var countriesArray = await response.json();
        countries = countriesArray;
        // console.log(countriesArray[84]);
        return countriesArray;
    } catch (error) {
        // console.log('Sorry, cannot connect to the API!', error);

        // Insert a scrolling area of text.
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `Sorry, cannot connect to the API!`
        app.appendChild(errorMessage)
    }

}

displayCountries();

async function displayCountries() {
    let countries = await getCountries();
    let cardsContainer = document.getElementById('cardsContainer');
    let filterButton = document.getElementById('filterButton');
    await countries.forEach((element, index) => {
        // create country card and append 
        var card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('id', `${index}`);
        card.setAttribute('onclick', "showInDetail(this.id)");

        card.innerHTML += `
                <img class='cardCountryimg' src="${element.flag}" alt="Country image">
                <div class="detailsInCard">
                    <h3 id="countryName${index}">${element.name}</h3>
                    <p id="population${index}">Population: ${Number(element.population).toLocaleString()}</p>
                    <p id="region${index}">Region: ${element.region}</p>
                    <p id="capital${index}">Capital: ${element.capital}</p>
                </div>
            `;
        cardsContainer.appendChild(card);

        // populate regions in dropdown filter button     
        if (!filterButton.innerHTML.includes(element.region)) {
            filterButton.innerHTML += `<option value="${element.region}">${element.region}</option>`;
        }
    });
    document.getElementById('loadingIcon').style.display = 'none';
}


// search by country name 
async function searchCountries() {
    let cardsArray = await document.getElementsByClassName('card');
    let searchText = document.getElementById('searchText').value;
    Array.from(cardsArray).forEach(card => {
        if (!((card.children[1].children[0].innerText.toUpperCase()).includes(searchText.toUpperCase()))) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    })
}


// filter by region 
async function filterCountries() {
    let thisRegion = document.getElementById('filterButton').value;
    let cardsArray = await document.getElementsByClassName('card');
    Array.from(cardsArray).forEach(card => {
        if (!((card.children[1].children[2].innerText.toUpperCase()).includes(thisRegion.toUpperCase()))) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
        // if no filter is selected, display all cards again
        if (thisRegion == 'all') {
            Array.from(cardsArray).forEach(card =>
                card.style.display = 'block')
        }
    })
}


// When a particular country is clicked, show details about that country on a new page 
async function showInDetail(countryId) {
    document.getElementById('main').style.display = 'none';
    let newPage = document.getElementById('detailViewContainer');
    document.getElementById('detailViewContainer').style.display = 'block';
    let currentContry = countries[countryId];


    // for loop on multiple top level domains
    let TLD = '';
    if (currentContry.topLevelDomain != undefined) {
        for (let i = 0; i < currentContry.topLevelDomain.length; i++) {
            TLD += ` ${currentContry.topLevelDomain[i]},`;
        }
        TLD = TLD.slice(0, TLD.length - 1);
    }

    // for loop on multiple Currencies
    let CRNC = '';
    if (currentContry.currencies != undefined) {
        for (let i = 0; i < currentContry.currencies.length; i++) {
            CRNC += ` ${currentContry.currencies[i].name},`;
        }
        CRNC = CRNC.slice(0, CRNC.length - 1);
    }

    // for loop on multiple Languages
    let LNG = '';
    if (currentContry.languages != undefined) {
        for (let i = 0; i < currentContry.languages.length; i++) {
            LNG += ` ${currentContry.languages[i].name},`;
        }
        LNG = LNG.slice(0, LNG.length - 1);
    }

    // for loop on adding multiple border country buttons
    let BRDR = '';
    if (currentContry.borders != undefined) {
        for (let i = 0; i < currentContry.borders.length; i++) {
            countries.forEach((country, index) => {
                if (country.alpha3Code == currentContry.borders[i]) {
                    BRDR += `<button class="borderBtn" onclick="showInDetail(${index})">${country.name}</button>`;
                }
            })
        }
    }

    newPage.innerHTML = `
    <div class="backBtnContainer">
            <button id="backBtn" onclick="hideDetailsPage()"><-- &nbsp Back</button>
        </div>
        <div id="countryDetails">
    <div class="imageContainer"><img src="${currentContry.flag}" alt="" class="countryImg"></div>
            <div class="countryText">
                <h2 id="name">${currentContry.name}</h2>
                <div class="textDetails">
                    <div class="leftTextDetails">
                        <p class="x"><b>Native Name: </b>${currentContry.nativeName}</p>
                        <p class="x"><b>Population: </b>${Number(currentContry.population).toLocaleString()}</p>
                        <p class="x"><b>Region: </b>${currentContry.region}</p>
                        <p class="x"><b>Sub Region: </b>${currentContry.subregion}</p>
                        <p class="x"><b>Capital: </b>${currentContry.capital}</p>
                    </div>
                    <div class="rightTextDetails">
                    <p class="x"><b>Top Level Domain:</b>${TLD}</p>
                    <p class="x"><b>Currencies:</b>${CRNC}</p>
                    <p class="x"><b>Languages:</b>${LNG}</p>
                    </div>
                </div>
                <div class="borderCountries">
                <div class="brdrBTNContainer">
                <p>Border Countries:</p>
                        ${BRDR}
                    </div>
                </div>
            </div>
    `;
}

// toggle main page and details page 
function hideDetailsPage() {
    document.getElementById('detailViewContainer').style.display = 'none';
    document.getElementById('countryDetails').innerHTML = '';
    document.getElementById('main').style.display = 'block';
}

// dark mode light mode setting 
function changeMode() {
    var rt = document.querySelector(':root');

    let bgcolor = getComputedStyle(rt);
    temp = bgcolor.getPropertyValue('--Dark_Mode_Background');
    rt.style.setProperty('--Dark_Mode_Background', bgcolor.getPropertyValue('--Light_Mode_Background'));
    rt.style.setProperty('--Light_Mode_Background', temp);

    temp1 = bgcolor.getPropertyValue('--Dark_Mode_Elements');
    rt.style.setProperty('--Dark_Mode_Elements', bgcolor.getPropertyValue('--Light-Mode-Elements'));
    rt.style.setProperty('--Light-Mode-Elements', temp1);

    temp = bgcolor.getPropertyValue('--Dark_Mode_Text');
    rt.style.setProperty('--Dark_Mode_Text', bgcolor.getPropertyValue('--Light_Mode_Text'));
    rt.style.setProperty('--Light_Mode_Text', temp);
}