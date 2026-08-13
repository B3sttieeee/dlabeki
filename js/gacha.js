const lootTable = [
    { name: "Zardzewiały Sztylet", icon: "🗡️", type: "weapon", tier: "tier-common", dropChance: 25, dmgBonus: 15, hpBonus: 0 },
    { name: "Skórzana Kurta", icon: "🧥", type: "armor", tier: "tier-common", dropChance: 20, dmgBonus: 0, hpBonus: 50 },
    { name: "Stalowy Miecz", icon: "⚔️", type: "weapon", tier: "tier-rare", dropChance: 15, dmgBonus: 40, hpBonus: 0 },
    { name: "Kolczuga Strażnika", icon: "🛡️", type: "armor", tier: "tier-rare", dropChance: 15, dmgBonus: 10, hpBonus: 150 },
    { name: "Oko Proroka", icon: "🧿", type: "amulet", tier: "tier-rare", dropChance: 10, hpBonus: 100, dpsBonus: 30 },
    { name: "Ostrze Mrozu", icon: "❄️", type: "weapon", tier: "tier-epic", dropChance: 7, dmgBonus: 150, hpBonus: 0 },
    { name: "Pancerz Cienia", icon: "🥋", type: "armor", tier: "tier-epic", dropChance: 5, dmgBonus: 40, hpBonus: 600 },
    { name: "Wampiryczny Sygnet", icon: "💍", type: "ring", tier: "tier-epic", dropChance: 1.5, dmgBonus: 30, lifestealBonus: 2 },
    { name: "Topór z Rubieży", icon: "🪓", type: "weapon", tier: "tier-legendary", dropChance: 1, dmgBonus: 500, hpBonus: 100 },
    { name: "Kryształowy Hełm", icon: "🪖", type: "head", tier: "tier-legendary", dropChance: 0.4, dmgBonus: 80, hpBonus: 1500 },
    { name: "Puszka Tiger Bez Cukru", icon: "🧊", type: "amulet", tier: "tier-mythic", dropChance: 0.08, dmgBonus: 999, hpBonus: 999, dpsBonus: 999, lifestealBonus: 5 },
    { name: "Miecz Nieskończoności", icon: "🌌", type: "weapon", tier: "tier-mythic", dropChance: 0.02, dmgBonus: 3000, hpBonus: 0 }
];

function openEgg() {
    if (window.gameData.gold < 500) { if(typeof logMessage === 'function') logMessage("❌ Masz za mało złota (Wymagane: 500)."); return; }
    window.gameData.gold -= 500; if(typeof updateStatusUI === 'function') updateStatusUI();
    const egg = document.getElementById('main-egg');
    if(egg) { egg.style.transform = 'scale(1.1) rotate(10deg)'; setTimeout(() => egg.style.transform = 'scale(1) rotate(0deg)', 200); }
    rollItem();
}

function rollItem() {
    let roll = Math.random() * 100; let currentCh = 0; let item = lootTable[0];
    for (const it of lootTable) { currentCh += it.dropChance; if (roll <= currentCh) { item = it; break; } }
    let winner = JSON.parse(JSON.stringify(item));
    
    if(winner.dmgBonus) winner.dmgBonus = Math.floor(winner.dmgBonus * (0.8 + Math.random() * 0.4));
    if(winner.hpBonus) winner.hpBonus = Math.floor(winner.hpBonus * (0.8 + Math.random() * 0.4));
    if(typeof logMessage === 'function') logMessage(`✨ Wylosowano: <span class="${winner.tier}">${winner.name}</span>`);
    if(typeof giveItem === 'function') giveItem(winner);
}