window.inventory = [];
window.equipped = { head: null, armor: null, weapon: null, amulet: null, ring: null };
window.totalDmg = 10; window.totalDps = 0; window.totalCrit = 5; window.totalLifesteal = 0;
let inspectedItem = null;

function giveItem(item) {
    item.id = Date.now() + Math.random(); item.upgradeLevel = 0;
    window.inventory.push(item); renderInventory(); saveInventory();
}

function equipItem(itemId) {
    const idx = window.inventory.findIndex(i => i.id === itemId); if (idx === -1) return;
    const item = window.inventory[idx];
    if (window.equipped[item.type]) window.inventory.push(window.equipped[item.type]);
    window.equipped[item.type] = item; window.inventory.splice(idx, 1);
    recalculatePlayerStats(); renderInventory(); saveInventory(); inspectItem(item);
}

function unequipItem(type) {
    if (!window.equipped[type]) return;
    window.inventory.push(window.equipped[type]); window.equipped[type] = null;
    recalculatePlayerStats(); renderInventory(); saveInventory();
}

function recalculatePlayerStats() {
    // Baza + Skille
    let rawDmg = window.gameData.baseDmg + (window.gameData.skills.dmg * 10);
    let rawDps = window.gameData.baseDps;
    let rawHp = 100 + (window.gameData.skills.hp * 20);
    
    window.totalCrit = 5 + (window.gameData.skills.crit * 2);
    window.totalLifesteal = window.gameData.skills.lifesteal;

    // Dodawanie sprzętu i mnożnika ulepszeń u kowala
    for (const k in window.equipped) {
        const i = window.equipped[k];
        if (i) {
            const upgMult = 1 + ((i.upgradeLevel||0) * 0.1); 
            rawDmg += Math.floor((i.dmgBonus || 0) * upgMult);
            rawDps += Math.floor((i.dpsBonus || 0) * upgMult);
            rawHp += Math.floor((i.hpBonus || 0) * upgMult);
            window.totalLifesteal += (i.lifestealBonus || 0);
        }
    }
    
    // MNOŻNIK PRESTIŻU (Każdy punkt to +50% statystyk)
    const prestigeMultiplier = 1 + (window.gameData.prestige * 0.5);
    window.totalDmg = Math.floor(rawDmg * prestigeMultiplier);
    window.totalDps = Math.floor(rawDps * prestigeMultiplier);
    window.playerMaxHp = Math.floor(rawHp * prestigeMultiplier);

    if(window.playerCurrentHp > window.playerMaxHp) window.playerCurrentHp = window.playerMaxHp;
    if(typeof updateStatusUI === 'function') updateStatusUI();
    
    const advPanel = document.getElementById('advanced-stats');
    if(advPanel) {
        advPanel.innerHTML = `<span class="text-accent text-bold">SUMA STATYSTYK:</span><br>Max HP: <span class="text-green">${window.playerMaxHp}</span> <br>DMG: <span class="text-red">${window.totalDmg}</span> <br>Kryt: ${window.totalCrit}% <br>Lifesteal: ${window.totalLifesteal}%`;
    }
}

function renderInventory() {
    const types = ['head', 'armor', 'weapon', 'amulet', 'ring'];
    const emojis = { head:'🪖', armor:'👕', weapon:'🗡️', amulet:'🧿', ring:'💍' };
    
    types.forEach(type => {
        const slot = document.getElementById(`slot-${type}`); const item = window.equipped[type];
        if (item) { slot.innerHTML = item.icon; slot.className = `gear-slot ${item.tier}`; slot.onclick = () => { inspectItem(item); unequipItem(type); }; }
        else { slot.innerHTML = emojis[type]; slot.className = 'gear-slot'; slot.onclick = null; }
    });

    const grid = document.getElementById("inventory-grid"); 
    if(grid) {
        grid.innerHTML = '';
        window.inventory.forEach(item => {
            const div = document.createElement("div"); div.className = `item-card ${item.tier}`; div.innerHTML = item.icon;
            div.onclick = () => { inspectItem(item); equipItem(item.id); };
            grid.appendChild(div);
        });
    }
}

// KOWAL
function inspectItem(item) {
    inspectedItem = item;
    const panel = document.getElementById('inspect-panel');
    if(!panel) return;
    if(!item) { panel.innerHTML = "<p class='text-dim'>Wybierz przedmiot.</p>"; return; }
    
    const upg = item.upgradeLevel || 0;
    const mult = 1 + (upg * 0.1);
    const costGold = 500 * (upg + 1); const costIron = 10 * (upg + 1);
    
    let stats = "";
    if(item.dmgBonus) stats += `DMG: +${Math.floor(item.dmgBonus * mult)} <br>`;
    if(item.hpBonus) stats += `HP: +${Math.floor(item.hpBonus * mult)} <br>`;
    if(item.dpsBonus) stats += `DPS: +${Math.floor(item.dpsBonus * mult)} <br>`;
    if(item.lifestealBonus) stats += `Lifesteal: +${item.lifestealBonus}% <br>`;

    panel.innerHTML = `
        <div class="inspect-icon ${item.tier}">${item.icon}</div>
        <h3 class="${item.tier} text-bold mb-10">${item.name} ${upg > 0 ? '+'+upg : ''}</h3>
        <p class="text-dim mb-20">Rzadkość: ${item.tier.replace('tier-','').toUpperCase()}</p>
        <div class="text-left mb-20" style="background:#111; padding:10px; border:1px solid #333;">${stats}</div>
        <button class="upgrade-btn" onclick="forgeItem()">
            ⚒️ ULEPSZ (+10% BAZOWYCH STATYSTYK)<br>
            <span class="text-dim" style="font-size:0.9rem;">Koszt: ${costGold} 🪙 | ${costIron} 🔩</span>
        </button>
    `;
}

function forgeItem() {
    if(!inspectedItem) return;
    const upg = inspectedItem.upgradeLevel || 0;
    const costGold = 500 * (upg + 1); const costIron = 10 * (upg + 1);
    
    if(window.gameData.gold >= costGold && window.gameData.iron >= costIron) {
        window.gameData.gold -= costGold; window.gameData.iron -= costIron;
        inspectedItem.upgradeLevel = upg + 1;
        recalculatePlayerStats(); saveInventory(); inspectItem(inspectedItem); if(typeof updateStatusUI==='function') updateStatusUI();
        if(typeof logMessage === 'function') logMessage(`⚒️ Sukces Kuźni: Ulepszono na poziom ${inspectedItem.upgradeLevel}!`);
    } else {
        if(typeof logMessage === 'function') logMessage("❌ Brak surowców do ulepszenia.");
    }
}

function saveInventory() { localStorage.setItem('nasa_inv_v5', JSON.stringify(window.inventory)); localStorage.setItem('nasa_eq_v5', JSON.stringify(window.equipped)); }
function loadInventory() {
    const sI = localStorage.getItem('nasa_inv_v5'); const sE = localStorage.getItem('nasa_eq_v5');
    if (sI) window.inventory = JSON.parse(sI); if (sE) window.equipped = JSON.parse(sE);
    recalculatePlayerStats(); renderInventory();
}