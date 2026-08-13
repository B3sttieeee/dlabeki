// js/inventory.js

window.inventory = [];
window.equipped = {
    head: null,
    armor: null,
    weapon: null,
    amulet: null,
    ring: null
};

window.totalDmg = 10;
window.totalDps = 0;
window.totalCrit = 5; // Bazowe 5%
window.totalLifesteal = 0;

function giveItem(item) {
    item.id = Date.now() + Math.random();
    window.inventory.push(item);
    renderInventory();
    saveInventory();
}

function equipItem(itemId) {
    const itemIndex = window.inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    const item = window.inventory[itemIndex];
    if (window.equipped[item.type]) {
        window.inventory.push(window.equipped[item.type]);
    }
    
    window.equipped[item.type] = item;
    window.inventory.splice(itemIndex, 1);
    
    recalculatePlayerStats();
    renderInventory();
    saveInventory();
    logMessage(`🛡️ Podłączono moduł: <span class="${item.tier}">${item.name}</span>`);
}

function unequipItem(type) {
    if (!window.equipped[type]) return;
    window.inventory.push(window.equipped[type]);
    window.equipped[type] = null;
    
    recalculatePlayerStats();
    renderInventory();
    saveInventory();
}

function recalculatePlayerStats() {
    // Obliczanie z drzewka skilli + bazy
    window.totalDmg = window.gameData.baseDmg + (window.gameData.skills.dmg * 10);
    window.totalDps = window.gameData.baseDps;
    window.playerMaxHp = 100 + (window.gameData.skills.hp * 20);
    window.totalCrit = 5 + (window.gameData.skills.crit * 2);
    window.totalLifesteal = window.gameData.skills.lifesteal; // w procentach

    // Dodawanie statystyk ze wszystkich ubrań
    for (const key in window.equipped) {
        const item = window.equipped[key];
        if (item) {
            window.totalDmg += (item.dmgBonus || 0);
            window.totalDps += (item.dpsBonus || 0);
            window.playerMaxHp += (item.hpBonus || 0);
            window.totalLifesteal += (item.lifestealBonus || 0);
        }
    }
    
    // Aktualizacja widoków
    if(window.playerCurrentHp > window.playerMaxHp) window.playerCurrentHp = window.playerMaxHp;
    updatePlayerHpUI();
    updateStatsUI();
    
    // Zaawansowany panel statystyk w ekwipunku
    document.getElementById('advanced-stats').innerHTML = `
        <span class="text-accent text-bold">STATYSTYKI ZAAWANSOWANE:</span><br>
        Maksymalne HP: ${window.playerMaxHp} <br>
        Szansa na Krytyk: ${window.totalCrit}% <br>
        Kradzież Życia: ${window.totalLifesteal}% za każdy cios
    `;
}

function renderInventory() {
    const types = ['head', 'armor', 'weapon', 'amulet', 'ring'];
    const emojis = { head:'🪖', armor:'👕', weapon:'🗡️', amulet:'🧿', ring:'💍' };
    
    types.forEach(type => {
        const slot = document.getElementById(`slot-${type}`);
        const item = window.equipped[type];
        if (item) {
            slot.innerHTML = item.icon;
            slot.className = `gear-slot ${item.tier}`;
            slot.onclick = () => unequipItem(type);
            slot.title = `${item.name}\nDMG: +${item.dmgBonus||0} | HP: +${item.hpBonus||0}\nKliknij, aby zdjąć.`;
        } else {
            slot.innerHTML = emojis[type];
            slot.className = 'gear-slot';
            slot.onclick = null;
            slot.title = `Pusty slot (${type})`;
        }
    });

    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = '';
    window.inventory.forEach(item => {
        const div = document.createElement("div");
        div.className = `item-card ${item.tier}`;
        div.innerHTML = item.icon;
        div.title = `${item.name}\nTyp: ${item.type}\nDMG: +${item.dmgBonus||0} | HP: +${item.hpBonus||0}\nKliknij, aby założyć.`;
        div.onclick = () => equipItem(item.id);
        grid.appendChild(div);
    });
}

function saveInventory() {
    localStorage.setItem('nasa_inv_v2', JSON.stringify(window.inventory));
    localStorage.setItem('nasa_eq_v2', JSON.stringify(window.equipped));
}

function loadInventory() {
    const savedInv = localStorage.getItem('nasa_inv_v2');
    const savedEq = localStorage.getItem('nasa_eq_v2');
    if (savedInv) window.inventory = JSON.parse(savedInv);
    if (savedEq) window.equipped = JSON.parse(savedEq);
    recalculatePlayerStats();
    renderInventory();
}