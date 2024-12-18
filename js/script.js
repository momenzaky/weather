let findButton = document.querySelector('#find-btn');
let searchInput = document.querySelector('#search');

searchInput.addEventListener("change", function () {
    getWeather(searchInput.value);
    removeInput();
});

searchInput.addEventListener('input', function () {
    let searchTerm = searchInput.value.trim(); 
    
    if (searchTerm === "") {
        return;
    }
    getWeather(searchTerm);
});

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather(searchInput.value);
        removeInput();
    }
});

findButton.addEventListener('click', function () {
    const location = searchInput.value;
    getWeather(location);
});

function removeInput() {
    searchInput.value = "";
}

const apiKey = '36e23dafa534494687d211317241612';

async function getWeather(country) {
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=7`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let final = await response.json();
        console.log(final);  
        displayData(final); 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


function displayData(data) {
    if (!data || !data.forecast || !data.forecast.forecastday) {
        console.error("Forecast data is missing or invalid");
        return;  
    }

    let location = data.location;
    let dataCurrentDay = data.current;
    let dataOfArray1 = data.forecast.forecastday[0];
    let dataOfArray2 = data.forecast.forecastday[1];
    let dataOfArray3 = data.forecast.forecastday[2];

    let date1 = new Date(dataOfArray1.date);
    let date2 = new Date(dataOfArray2.date);
    let date3 = new Date(dataOfArray3.date);

    let weekday1 = date1.toLocaleDateString("en-us", { weekday: "long" });
    let weekday2 = date2.toLocaleDateString("en-us", { weekday: "long" });
    let weekday3 = date3.toLocaleDateString("en-us", { weekday: "long" });

    let month = date1.toLocaleDateString("en-us", { month: "long" });

    let time = data.location.localtime;
    let date = new Date(time);
    let day = date.getDate();

    let cartona = `<div class="row position-relative">
    <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="todayWeather hight">
            <div class="second-header d-flex justify-content-between">
                <p class="mb-0 font-b" id="today-date">${weekday1}</p>
                <p class="mb-0 font-b" id="today-month">${day}${month}</p>
            </div>
            <div class="body-todayWeather p-3">
                <p class="location mb-0 font-b" id="location">${location.name}</p>
                <div class="degree-icon d-flex align-items-center">
                    <div class="degree" id="degree">
                        ${dataCurrentDay.temp_c}<sub class="">o</sub>C
                    </div>
                    <div class="icon">
                        <img src="https:${dataCurrentDay.condition.icon}" alt="Partly-cloudy" class="ms-5">
                    </div>
                </div>
                <div class="condition">
                    <div class="main-color fs-14" id="weather-condition">${dataCurrentDay.condition.text}</div>
                </div>
                <div class="three-icon fs-14 position-absolute">
                    <span class="secondary-color" id="humidity">
                        <img src="./img/icon-umberella.png" alt="umbrella">
                       ${dataCurrentDay.cloud}%</span>
                    <span class="secondary-color ms-3" id="wind-speed">
                        <img src="./img/icon-wind.png" alt="wind">
                        ${dataCurrentDay.wind_kph}km/h
                    </span>
                    <span class="secondary-color ms-3 text-white" id="wind-direction"></span>
                    <img src="./img/icon-compass.png" alt="compass">
                    <span class="fs-14 secondary-color mb-0">${dataCurrentDay.humidity} East</span>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
        <div class="tomorrow-weather hight">
            <div class="second-header text-center">
                <p class="mb-0 fs-14 secondary-color" id="tomorrow-day">${weekday2}</p>
            </div>
            <div class="body-tomorrow text-center">
                <div class="icon-tomorrow mb-4">
                    <img src="https:${dataOfArray2.day.condition.icon}" alt="sun" id="tomorrow-icon">
                </div>
                <div class="degree-tomorrow text-white fs-3 fw-light" id="tomorrow-temp">
                    ${dataOfArray2.day.maxtemp_c}<sub class="bottom-sub">o</sub>C
                </div>
                <small class="fs-6 fw-light" id="tomorrow-min-temp">${dataOfArray2.day.mintemp_c}<sub class="bottom-sub">o</sub></small>
                <div class="condition">
                    <div class="main-color fs-14" id="tomorrow-condition">${dataOfArray2.day.condition.text}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
        <div class="after-tomorrow hight">
            <div class="second-header text-center">
                <p class="mb-0 fs-14 secondary-color" id="after-tomorrow-day">${weekday3}</p>
            </div>
            <div class="body-after text-center">
                <div class="icon-tomorrow mb-4">
                    <img src="https:${dataOfArray3.day.condition.icon}" id="after-tomorrow-icon">
                </div>
                <div class="degree-after text-white fs-3 fw-light" id="after-tomorrow-temp">
                    ${dataOfArray3.day.maxtemp_c}<sub class="bottom-sub">o</sub>C
                </div>
                <small class="fs-6 fw-light" id="after-tomorrow-min-temp">${dataOfArray3.day.mintemp_c}<sub class="bottom-sub">o</sub></small>
                <div class="condition">
                    <div class="main-color fs-14" id="after-tomorrow-condition">${dataOfArray3.day.condition.text}</div>
                </div>
            </div>
        </div>
    </div>
</div>`;

    document.querySelector(".all-cards").innerHTML = cartona;
}


getWeather("cairo");  


async function searchCountry(searchTerm) {
    let foundedCountry = [];

    try {
        // استعلام API للبحث عن المدن باستخدام الـ searchTerm
        let response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchTerm}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        let data = await response.json();
        
        // التحقق من وجود مدن تم العثور عليها
        if (data && data.length > 0) {
            // يمكنك هنا فحص البيانات مثل اسم المدينة أو الدولة
            // وهنا نقوم بتخزين كل مدينة تطابق الـ searchTerm
            foundedCountry = data;
        } else {
            console.log('No cities found for the search term');
        }

        // عرض البيانات للمدن أو الدول التي تم العثور عليها
        displayData(foundedCountry);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}