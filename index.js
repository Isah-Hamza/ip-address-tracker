const ip_address_input = document.querySelector('.ip-address-input');
const send_btn = document.querySelector('.send-btn');
const ip_address_text = document.querySelector('.ip-address-text');
const location_text = document.querySelector('.location-text');
const timezone_text = document.querySelector('.timezone-text');
const isp_text = document.querySelector('.isp-text');
const geo_name_id = document.querySelector('.geo-name-id');
const error_message = document.querySelector('.error-message');
let  map_div = null;
const main = document.querySelector('main');


const ipifyUrl = 'https://geo.ipify.org/api/v1?apiKey=at_1afGhDv3iCNPt4F1d4FmH3UMncI60&ipAddress=';
let result = {};


const generate_random_ip = () => {
    const firstPart = Math.floor(Math.random()*255 + 1);
    const secondPart = Math.floor(Math.random()*255 + 1);
    const thirdPart = Math.floor(Math.random()*255 + 1);
    const fourthPart = Math.floor(Math.random()*255 + 1);
    const full_ip = `${firstPart}.${secondPart}.${thirdPart}.${fourthPart}`;

    return(full_ip);
}
generate_random_ip();

//add click eventlistener to the sendBtn 
send_btn.addEventListener('click', () => {
    const ip_address =  ip_address_input.value ;
    sendRequest(ip_address);
})

// function that makes the actual api request
const sendRequest = async (ip_address = generate_random_ip()) => {
    const fullUrl = `${ipifyUrl}${ip_address}`;
    await fetch(fullUrl)
    .then(res => res.json())
    .then(data => result = data );
    populateInfo(result);
}


sendRequest();

const create_map_div = () => {
    main.removeChild(map_div);
    const map = document.createElement('div');
    map.id = 'map';
    map.className = 'map';
    main.appendChild(map);
}

//function to create a map given a valid lat and lng
const create_map = () => {
    if(map_div != null) create_map_div();
    map_div = document.getElementById('map');
    let map = L.map(map_div).setView([result.location?.lat || 51.505, result.location?.lng || -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([ result.location?.lat || 51.5, result.location?.lng || -0.09]).addTo(map)
        // .bindPopup(`${result.location?.region || 'default'}, ${result.location?.country || 'default'}`)
        .openPopup();

};
create_map();

//display error message if any
const display_error = (messages) => {
    error_message.style.display = 'grid';
    error_message.textContent = messages;
    setTimeout(() => {
        error_message.style.display = 'none';
        error_message.textContent = '';   
    }, 3000)
}

//function to render the response info into the UI
const populateInfo = (info) => {
    const { ip, location , as, isp, messages} = info;
    if(messages){
        return display_error(messages);
    }
    ip_address_input.value = '';
    ip_address_text.textContent = ip;
    location_text.textContent = `${location.region} ${ location.region && ','} ${location.country} `;
    geo_name_id.textContent = location.geonameId;
    timezone_text.textContent = `UTC${location.timezone}`;
    isp_text.textContent = as?.name || isp;
    create_map();
}

