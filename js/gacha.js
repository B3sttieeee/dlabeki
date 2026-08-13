// js/gacha.js

const lootTable = [
    { name: "Zardzewiały Sztylet", icon: "🗡️", tier: "tier-common", dropChance: 50, dmgBonus: 2 },
    { name: "Hełm Górnika", icon: "🪖", tier: "tier-common", dropChance: 25, dmgBonus: 5 },
    { name: "Kryształowy Miecz", icon: "⚔️", tier: "tier-rare", dropChance: 15, dmgBonus: 15 },
    { name: "Kula Zachwytu Demona", icon: "🔮", tier: "tier-epic", dropChance: 8, dmgBonus: 40 },
    { name: "Topór z Rubieży", icon: "🪓", tier: "tier-legendary", dropChance: 1.9, dmgBonus: 100 },
    { name: "Ostrze Nieskończoności", icon: "🔥", tier: "tier-mythic", dropChance: 0.1, dmgBonus: 500 }
];

function openEgg() {
    // Odwołanie do zmiennych z core.js (np. gold)
    if (window.gold < 500) {
        logToBattle("❌ Brakuje złota na jajko!");
        return;
    }

    window.gold -= 500;
    updateUI();

    const eggElement = document.getElementById("main-egg");
    
    // Animacja trzęsienia
    eggElement.classList.add("shake");
    
    setTimeout(() => {
        eggElement.classList.remove("shake");
        rollLoot();
    }, 400); // Czas trwania animacji z CSS
}

function rollLoot() {
    const roll = Math.random() * 100;
    let currentChance = 0;
    let droppedItem = lootTable[0];

    for (const item of lootTable) {
        currentChance += item.dropChance;
        if (roll <= currentChance) {
            droppedItem = item;
            break;
        }
    }

    logToBattle(`✨ Wylosowano: [${droppedItem.name}]`);
    addToInventory(droppedItem);
}

function addToInventory(item) {
    const grid = document.getElementById("inventory-grid");
    const itemDiv = document.createElement("div");
    itemDiv.className = `item-slot ${item.tier}`;
    itemDiv.innerHTML = item.icon;
    itemDiv.title = `${item.name} (+${item.dmgBonus} DMG)`; // Tooltip po najechaniu
    
    grid.appendChild(itemDiv);

    // Dodanie statystyk
    window.playerDmg += item.dmgBonus;
    updateUI();
}