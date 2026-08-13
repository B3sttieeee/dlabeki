// js/inventory.js

window.inventory = [];
window.equipped = {
    head: null,
    armor: null,
    weapon: null
};

window.totalDmg = 10;
window.totalDps = 0;

function giveItem(item) {
    item.id = Date.now() + Math.random(); // Unikalne ID
    window.inventory.push(item);
    renderInventory();
    saveInventory();
}

function equipItem(itemId) {
    const itemIndex = window.inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    const item = window.inventory[itemIndex];
    
    // Zdejmij stary przedmiot i wrzuć do plecaka
    if (window.equipped[item.type]) {
        window.inventory.push(window.equipped[item.type]);
    }
    
    // Załóż nowy
    window.equipped[item.type] = item;
    
    // Usuń założony z plecaka
    window.inventory.splice(itemIndex, 1);
    
    recalculateTotalStats();
    renderInventory();
    saveInventory();
    logMessage(`🛡️ Założono: <span class="${item.tier}">${item.name}</span>`);
}

function unequipItem(type) {
    if (!window.equipped[type]) return;
    window.inventory.push(window.equipped[type]);
    window.equipped[type] = null;
    
    recalculateTotalStats();
    renderInventory();
    saveInventory();
}

function recalculateTotalStats() {
    window.totalDmg = window.gameData.baseDmg;
    window.totalDps = window.gameData.baseDps;

    for (const key in window.equipped) {
        const item = window.equipped[key];
        if (item) {
            window.totalDmg += (item.dmgBonus || 0);
            window.totalDps += (item.dpsBonus || 0);
        }
    }
    updateStats();
}

function updateStats() {
    document.getElementById('gold-amount').innerText = window.gameData.gold;
    document.getElementById('click-dmg').innerText = window.totalDmg;
    document.getElementById('auto-dps').innerText = window.totalDps;
}

function renderInventory() {
    // Renderowanie wyekwipowanych
    const types = ['head', 'armor', 'weapon'];
    types.forEach(type => {
        const slot = document.getElementById(`slot-${type}`);
        const item = window.equipped[type];
        if (item) {
            slot.innerHTML = item.icon;
            slot.className = `gear-slot ${item.tier}`;
            slot.onclick = () => unequipItem(type);
            slot.title = `${item.name}\nDMG: +${item.dmgBonus || 0} | DPS: +${item.dpsBonus || 0}\nKliknij, aby zdjąć.`;
        } else {
            slot.innerHTML = type === 'head' ? '🪖' : type === 'armor' ? '👕' : '🗡️';
            slot.className = 'gear-slot';
            slot.onclick = null;
            slot.title = `Pusty slot (${type})`;
        }
    });

    // Renderowanie plecaka
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = '';
    window.inventory.forEach(item => {
        const div = document.createElement("div");
        div.className = `item-card ${item.tier}`;
        div.innerHTML = item.icon;
        div.title = `${item.name}\nTyp: ${item.type}\nDMG: +${item.dmgBonus || 0} | DPS: +${item.dpsBonus || 0}\nKliknij, aby założyć.`;
        div.onclick = () => equipItem(item.id);
        grid.appendChild(div);
    });
}

function saveInventory() {
    localStorage.setItem('dlabeki_inv', JSON.stringify(window.inventory));
    localStorage.setItem('dlabeki_eq', JSON.stringify(window.equipped));
}

function loadInventory() {
    const savedInv = localStorage.getItem('dlabeki_inv');
    const savedEq = localStorage.getItem('dlabeki_eq');
    if (savedInv) window.inventory = JSON.parse(savedInv);
    if (savedEq) window.equipped = JSON.parse(savedEq);
    recalculateTotalStats();
    renderInventory();
}