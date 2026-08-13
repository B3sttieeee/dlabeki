// js/gacha.js

const lootTable = [
    // COMMON (45%)
    { name: "Zardzewiały Sztylet", icon: "🗡️", type: "weapon", tier: "tier-common", dropChance: 20, dmgBonus: 5, hpBonus: 0 },
    { name: "Skórzana Kurta", icon: "🧥", type: "armor", tier: "tier-common", dropChance: 15, dmgBonus: 0, hpBonus: 20 },
    { name: "Miedziany Pierścień", icon: "💍", type: "ring", tier: "tier-common", dropChance: 10, dmgBonus: 2, lifestealBonus: 0 },
    
    // RARE (30%)
    { name: "Stalowy Miecz", icon: "⚔️", type: "weapon", tier: "tier-rare", dropChance: 10, dmgBonus: 25, hpBonus: 0 },
    { name: "Kolczuga Strażnika", icon: "🛡️", type: "armor", tier: "tier-rare", dropChance: 10, dmgBonus: 5, hpBonus: 100 },
    { name: "Oko Proroka", icon: "🧿", type: "amulet", tier: "tier-rare", dropChance: 10, hpBonus: 50, dpsBonus: 20 },
    
    // EPIC (17%)
    { name: "Ostrze Mrozu", icon: "❄️", type: "weapon", tier: "tier-epic", dropChance: 6, dmgBonus: 100, hpBonus: 0 },
    { name: "Pancerz Cienia", icon: "🥋", type: "armor", tier: "tier-epic", dropChance: 6, dmgBonus: 20, hpBonus: 400 },
    { name: "Wampiryczny Sygnet", icon: "💍", type: "ring", tier: "tier-epic", dropChance: 5, dmgBonus: 15, lifestealBonus: 2 },
    
    // LEGENDARY (7.5%)
    { name: "Topór z Rubieży", icon: "🪓", type: "weapon", tier: "tier-legendary", dropChance: 4, dmgBonus: 400, hpBonus: 50 },
    { name: "Kryształowy Hełm", icon: "🪖", type: "head", tier: "tier-legendary", dropChance: 3.5, dmgBonus: 50, hpBonus: 1200 },
    
    // MYTHIC (0.5%) - CAŁKOWITY GAMECHANGER
    { name: "Puszka Tiger Bez Cukru", icon: "🧊", type: "amulet", tier: "tier-mythic", dropChance: 0.3, dmgBonus: 999, hpBonus: 999, dpsBonus: 999, lifestealBonus: 5 },
    { name: "Miecz Nieskończoności", icon: "🌌", type: "weapon", tier: "tier-mythic", dropChance: 0.2, dmgBonus: 3000, hpBonus: 0 }
];

function openEgg() {
    if (window.gameData.gold < 500) {
        logMessage("❌ Masz za mało złota na ołtarz (Wymagane: 500).");
        return;
    }
    window.gameData.gold -= 500;
    updateStatsUI();

    const eggElement = document.getElementById("main-egg");
    eggElement.style.animation = "shake 0.1s infinite";
    
    setTimeout(() => {
        eggElement.style.animation = "none";
        rollItem();
    }, 600); 
}

function rollItem() {
    const roll = Math.random() * 100;
    let currentChance = 0;
    let droppedItem = lootTable[0];

    for (const item of lootTable) {
        currentChance += item.dropChance;
        if (roll <= currentChance) {
            droppedItem = JSON.parse(JSON.stringify(item));
            break;
        }
    }

    // Widełki lootu na grind (+/- 25% wahań statystyk by znalezienie "perfect rolla" trwało dni)
    const variance = 0.25;
    if(droppedItem.dmgBonus > 0) droppedItem.dmgBonus = Math.floor(droppedItem.dmgBonus * (1 - variance + Math.random() * variance * 2));
    if(droppedItem.hpBonus > 0) droppedItem.hpBonus = Math.floor(droppedItem.hpBonus * (1 - variance + Math.random() * variance * 2));
    if(droppedItem.dpsBonus > 0) droppedItem.dpsBonus = Math.floor(droppedItem.dpsBonus * (1 - variance + Math.random() * variance * 2));

    logMessage(`✨ Schemat zdekodowany: <span class="${droppedItem.tier}">${droppedItem.name}</span>`);
    giveItem(droppedItem);
}