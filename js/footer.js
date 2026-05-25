const serviceAdopt = document.getElementById('service-adopt');
const servicePetHouses = document.getElementById('service-pet-houses');
const servicePetGadgets = document.getElementById('service-pet-gadgets');
const servicePetFoods = document.getElementById('service-pet-foods');

serviceAdopt.onclick = () => {
    sessionStorage.setItem('homepage-redirect-nav', 'adopt-a-pet');
    window.location.href = '/';
}

servicePetHouses.onclick = () => {
    sessionStorage.setItem('homepage-redirect-nav', 'pet-houses');
    window.location.href = '/';
}

servicePetGadgets.onclick = () => {
    sessionStorage.setItem('homepage-redirect-nav', 'pet-gadgets');
    window.location.href = '/';
}

servicePetFoods.onclick = () => {
    sessionStorage.setItem('homepage-redirect-nav', 'pet-foods');
    window.location.href = '/';
}