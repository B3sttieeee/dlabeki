// js/gacha.js

const lootTable = [
    // COMMON (50%)
    { name: "Zardzewiały Sztylet", icon: "🗡️", type: "weapon", tier: "tier-common", dropChance: 25, dmgBonus: 5, dpsBonus: 0 },
    { name: "Skórzana Kurta", icon: "🧥", type: "armor", tier: "tier-common", dropChance: 15, dmgBonus: 0, dpsBonus: 5 },
    { name: "Czepek Górnika", icon: "🧢", type: "head", tier: "tier-common", dropChance: 10, dmgBonus: 2, dpsBonus: 2 },
    
    // RARE (30%)
    { name: "Amulet Czarciego Kota", icon: "🐱", type: "head", tier: "tier-rare", dropChance: 10, dmgBonus: 15, dpsBonus: 15 },
    { name: "Kastet Ulicznika", icon: "🥊", type: "weapon", tier: "tier-rare", dropChance: 10, dmgBonus: 25, dpsBonus: 0 },
    { name: "Kolczuga Strażnika", icon: "🛡️", type: "armor", tier: "tier-rare", dropChance: 10, dmgBonus: 5, dpsBonus: 20 },
    
    // EPIC (14%)
    { name: "Kula Zachwytu Demona", icon: "🔮", type: "head", tier: "tier-epic", dropChance: 5, dmgBonus: 60, dpsBonus: 40 },
    { name: "Ostrze Mrozu", icon: "❄️", type: "weapon", tier: "tier-epic", dropChance: 5, dmgBonus: 80, dpsBonus: 10 },
    { name: "Pancerz Cienia", icon: "🥋", type: "armor", tier: "tier-epic", dropChance: 4, dmgBonus: 20, dpsBonus: 70 },
    
    // LEGENDARY (5%)
    { name: "Topór z Rubieży", icon: "🪓", type: "weapon", tier: "tier-legendary", dropChance: 3, dmgBonus: 250, dpsBonus: 50 },
    { name: "Mroźny Napój (Z Lodem)", icon: "🧊", type: "head", tier: "tier-legendary", dropChance: 2, dmgBonus: 100, dpsBonus: 200 }, // Czysta energia
    
    // MYTHIC (1%)
    { name: "Pryzmatyczny Rdzeń", icon: "💠", type: "armor", tier: "tier-mythic", dropChance: 0.8, dmgBonus: 400, dpsBonus: 400 },
    { name: "Miecz Nieskończoności", icon: "🌌", type: "weapon", tier: "tier-mythic", dropChance: 0.2, dmgBonus: 1000, dpsBonus: 0 }
];

function openEgg() {
    if (window.gameData.gold < 500) {
        logMessage("❌ Masz za mało złota na ruletkę (Wymagane: 500).");
        return;
    }

    window.gameData.gold -= 500;
    updateStats();

    const eggElement = document.getElementById("main-egg");
    eggElement.classList.add("shake");
    
    setTimeout(() => {
        eggElement.classList.remove("shake");
        rollItem();
    }, 500); 
}

function rollItem() {
    const roll = Math.random() * 100;
    let currentChance = 0;
    let droppedItem = lootTable[0];

    for (const item of lootTable) {
        currentChance += item.dropChance;
        if (roll <= currentChance) {
            // Głębokie klonowanie obiektu
            droppedItem = JSON.parse(JSON.stringify(item));
            break;
        }
    }

    // Dynamiczna modyfikacja statystyk (widełki +/- 20%) dla lepszego grindu
    const variance = 0.2;
    if(droppedItem.dmgBonus > 0) {
        droppedItem.dmgBonus = Math.floor(droppedItem.dmgBonus * (1 - variance + Math.random() * variance * 2));
    }
    if(droppedItem.dpsBonus > 0) {
        droppedItem.dpsBonus = Math.floor(droppedItem.dpsBonus * (1 - variance + Math.random() * variance * 2));
    }

    logMessage(`✨ Wylosowano: <span class="${droppedItem.tier}">${droppedItem.name}</span>`);
    giveItem(droppedItem);
}