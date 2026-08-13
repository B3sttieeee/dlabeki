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

let isSpinning = false;

function spinRoulette() {
    if (isSpinning) return;
    if (window.gameData.gold < 500) { logMessage("❌ Masz za mało złota (Wymagane: 500)."); return; }
    
    window.gameData.gold -= 500; updateStatusUI();
    isSpinning = true;
    
    const strip = document.getElementById('roulette-strip');
    strip.innerHTML = '';
    strip.style.transition = 'none';
    strip.style.transform = 'translateX(0)';

    // Generujemy 50 fałszywych itemów do przeskrollowania
    const totalItems = 50;
    const winningIndex = 43; // Zwycięski item będzie na 43 pozycji
    
    let winnerItem = null;

    for (let i = 0; i < totalItems; i++) {
        // Losowanie
        let roll = Math.random() * 100; let currentCh = 0; let item = lootTable[0];
        for (const it of lootTable) { currentCh += it.dropChance; if (roll <= currentCh) { item = it; break; } }
        
        if (i === winningIndex) winnerItem = JSON.parse(JSON.stringify(item));
        
        const el = document.createElement('div');
        el.className = `roulette-item ${item.tier}`;
        el.innerHTML = item.icon;
        strip.appendChild(el);
    }

    // Wymuszenie reflow dla CSS
    strip.offsetHeight; 
    
    // Obliczanie przesunięcia (każdy item ma 120px szerokości + 10px margin = 130px)
    // Zatrzymujemy się w losowym miejscu na zwycięskim przedmiocie, aby dodać realizmu
    const itemWidth = 130;
    const randomOffset = Math.floor(Math.random() * 100) - 50; 
    const finalOffset = -(winningIndex * itemWidth) + randomOffset;
    
    strip.style.transition = 'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
    strip.style.transform = `translateX(${finalOffset}px)`;

    // Po 5.5 sekundach dajemy nagrodę
    setTimeout(() => {
        isSpinning = false;
        
        // Randomizacja statystyk dla unikalności
        if(winnerItem.dmgBonus) winnerItem.dmgBonus = Math.floor(winnerItem.dmgBonus * (0.8 + Math.random() * 0.4));
        if(winnerItem.hpBonus) winnerItem.hpBonus = Math.floor(winnerItem.hpBonus * (0.8 + Math.random() * 0.4));
        
        logMessage(`✨ Ruletka się zatrzymała! Otrzymujesz: <span class="${winnerItem.tier}">${winnerItem.name}</span>`);
        if(typeof giveItem === 'function') giveItem(winnerItem);
    }, 5500);
}

// Funkcja pomocnicza dla bossów
function rollItem() {
    let roll = Math.random() * 100; let currentCh = 0; let item = lootTable[0];
    for (const it of lootTable) { currentCh += it.dropChance; if (roll <= currentCh) { item = it; break; } }
    let winner = JSON.parse(JSON.stringify(item));
    giveItem(winner);
}