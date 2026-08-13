// js/inventory.js

// Globalna tablica na przedmioty gracza
window.inventory = [];

// Funkcja wywoływana z gacha.js podczas dropu
function giveItemToPlayer(itemTemplate) {
    // Klonujemy obiekt, by móc mieć kilka takich samych itemów z ewentualnie zmienionymi statystykami w przyszłości
    const newItem = {
        id: Date.now(), // Unikalne ID
        name: itemTemplate.name,
        icon: itemTemplate.icon,
        tier: itemTemplate.tier,
        dmgBonus: itemTemplate.dmgBonus
    };
    
    window.inventory.push(newItem);
    window.playerDmg += newItem.dmgBonus;
    
    updateUI();
    renderInventory();
    saveInventory(); // Nowa funkcja zapisu eq
}

// Rysowanie siatki przedmiotów w HTML
function renderInventory() {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = ''; // Czyścimy siatkę
    
    window.inventory.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = `item-slot ${item.tier}`;
        itemDiv.innerHTML = item.icon;
        
        // Fajna sztuczka z CSS tooltip:
        itemDiv.title = `${item.name} (+${item.dmgBonus} DMG)`; 
        
        grid.appendChild(itemDiv);
    });
}

// Zapisywanie ekwipunku osobno
function saveInventory() {
    localStorage.setItem('dungeonsAndEggsEq', JSON.stringify(window.inventory));
}

// Wczytywanie ekwipunku
function loadInventory() {
    const savedReq = localStorage.getItem('dungeonsAndEggsEq');
    if (savedReq) {
        window.inventory = JSON.parse(savedReq);
        renderInventory();
    }
}

// Wczytaj ekwipunek po starcie (podpinamy do zdarzenia DOM)
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
});