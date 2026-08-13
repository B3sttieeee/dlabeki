window.gameData = {
    gold: 0, iron: 0, mithril: 0,
    baseDmg: 10, baseDps: 0, clickPower: 1, pickaxeLevel: 1, mercenaryLevel: 0,
    highestDungeon: 1, level: 1, exp: 0, maxExp: 100, skillPoints: 0,
    skills: { hp: 0, dmg: 0, lifesteal: 0, crit: 0 },
    prestige: 0,
    quests: { kills: 0, mines: 0, killsClaimed: false, minesClaimed: false }
};

window.playerMaxHp = 100;
window.playerCurrentHp = 100;
window.isDead = false;
window.isFighting = false;

function openTab(tabId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const targetScreen = document.getElementById(tabId);
    if(targetScreen) targetScreen.classList.add('active');
    const activeBtn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
    if(activeBtn) activeBtn.classList.add('active');
    
    // Zapobiega biciu Cię przez potwora w sklepie
    window.isFighting = (tabId === 'tab-combat' && !window.isDead);
    if(tabId === 'tab-quests') updateQuestsUI();
}

function saveGame() {
    localStorage.setItem('nasa_save_v5', JSON.stringify(window.gameData));
    if(typeof saveInventory === 'function') saveInventory();
    if(typeof saveCombat === 'function') saveCombat();
}

function loadGame() {
    const saved = localStorage.getItem('nasa_save_v5');
    if (saved) window.gameData = { ...window.gameData, ...JSON.parse(saved) };
    
    // Zabezpieczenie questów na starych zapisach
    if(!window.gameData.quests) window.gameData.quests = { kills: 0, mines: 0, killsClaimed: false, minesClaimed: false };
    if(typeof window.gameData.prestige === 'undefined') window.gameData.prestige = 0;

    updateShopUI(); updateSkillsUI(); updateQuestsUI();
    recalculatePlayerStats();
    window.playerCurrentHp = window.playerMaxHp;
    updateStatusUI();
}

// MECHANIKA KOPALNI
function mineGold() {
    const mined = window.gameData.clickPower + Math.floor(Math.random() * (window.gameData.pickaxeLevel * 2));
    window.gameData.gold += mined;
    
    if(Math.random() < (0.05 + (window.gameData.pickaxeLevel * 0.01))) { window.gameData.iron++; logMessage("🔩 Wykopano Żelazo!"); }
    if(Math.random() < (0.01 + (window.gameData.pickaxeLevel * 0.002))) { window.gameData.mithril++; logMessage("💠 Wykopano Mithril!"); }
    
    // System Zadań
    window.gameData.quests.mines++;
    
    updateStatusUI();
    const rock = document.querySelector('.mine-interact');
    if(rock) { rock.style.transform = `scale(0.9) translateY(10px)`; setTimeout(() => rock.style.transform = 'scale(1) translateY(0)', 80); }
}

// SKLEP
function buyUpgrade(type) {
    if (type === 'pickaxe') {
        let cost = 100 * window.gameData.pickaxeLevel;
        if (window.gameData.gold >= cost) { window.gameData.gold -= cost; window.gameData.clickPower += 3; window.gameData.pickaxeLevel++; } else logMessage("❌ Brak złota.");
    } else if (type === 'mercenary') {
        let cost = 500 * (window.gameData.mercenaryLevel + 1);
        if (window.gameData.gold >= cost) { window.gameData.gold -= cost; window.gameData.baseDps += 15; window.gameData.mercenaryLevel++; } else logMessage("❌ Brak złota.");
    } else if (type === 'heal') {
        if (window.gameData.gold >= 200 && window.playerCurrentHp < window.playerMaxHp) { window.gameData.gold -= 200; healPlayer(window.playerMaxHp * 0.5); } else logMessage("❌ Brak złota lub pełne zdrowie.");
    }
    updateStatusUI(); updateShopUI(); if(typeof recalculateTotalStats === 'function') recalculateTotalStats();
}

function updateShopUI() {
    const p = document.getElementById('cost-pickaxe'); if(p) p.innerText = 100 * window.gameData.pickaxeLevel;
    const m = document.getElementById('cost-merc'); if(m) m.innerText = 500 * (window.gameData.mercenaryLevel + 1);
}

// SYSTEM ZADAŃ
function updateQuestsUI() {
    document.getElementById('q-kills').innerText = window.gameData.quests.kills;
    document.getElementById('q-mines').innerText = window.gameData.quests.mines;
    
    const btnKills = document.getElementById('btn-q-kills');
    if(window.gameData.quests.killsClaimed) { btnKills.disabled = true; btnKills.innerText = "ZROBIONE"; }
    else if(window.gameData.quests.kills >= 10) { btnKills.disabled = false; btnKills.style.borderColor = "var(--accent-gold)"; }
    else { btnKills.disabled = true; }

    const btnMines = document.getElementById('btn-q-mines');
    if(window.gameData.quests.minesClaimed) { btnMines.disabled = true; btnMines.innerText = "ZROBIONE"; }
    else if(window.gameData.quests.mines >= 50) { btnMines.disabled = false; btnMines.style.borderColor = "var(--accent-gold)"; }
    else { btnMines.disabled = true; }
    
    document.getElementById('prestige-tokens').innerText = window.gameData.prestige;
    document.getElementById('prestige-amount').innerText = window.gameData.prestige;
    document.getElementById('prestige-multiplier').innerText = window.gameData.prestige * 50; // Każdy token to +50% statystyk!
}

function claimQuest(type) {
    if(type === 'kills' && window.gameData.quests.kills >= 10 && !window.gameData.quests.killsClaimed) {
        window.gameData.quests.killsClaimed = true; window.gameData.gold += 1000; logMessage("📜 Ukończono zadanie: Pogromca Bestii!");
    }
    if(type === 'mines' && window.gameData.quests.mines >= 50 && !window.gameData.quests.minesClaimed) {
        window.gameData.quests.minesClaimed = true; window.gameData.mithril += 5; logMessage("📜 Ukończono zadanie: Górnik Przodowy!");
    }
    updateStatusUI(); updateQuestsUI(); saveGame();
}

// SYSTEM PRESTIŻU (REBIRTH)
function doPrestige() {
    if(window.gameData.level < 50) { logMessage("❌ Prestiż wymaga 50 Poziomu."); return; }
    if(confirm("TWARDY RESET: Stracisz Poziom, Skille, Złoto i Rudy. Zachowasz Ekwipunek i otrzymasz +50% do wszystkiego na zawsze. Robimy to?")) {
        window.gameData.prestige++;
        // Reset postępu
        window.gameData.gold = 0; window.gameData.iron = 0; window.gameData.mithril = 0;
        window.gameData.level = 1; window.gameData.exp = 0; window.gameData.maxExp = 100;
        window.gameData.skillPoints = 0;
        window.gameData.skills = { hp: 0, dmg: 0, lifesteal: 0, crit: 0 };
        // Reset Zadań
        window.gameData.quests = { kills: 0, mines: 0, killsClaimed: false, minesClaimed: false };
        
        recalculatePlayerStats(); updateStatusUI(); updateSkillsUI(); updateQuestsUI();
        logMessage("🌌 ODBYŁ SIĘ PRESTIŻ! ROZPOCZYNZASZ NOWE ŻYCIE Z POTĘŻNĄ MOCĄ!");
    }
}

// LEVELOWANIE I SKILLE
function gainExp(amount) {
    window.gameData.exp += amount;
    while (window.gameData.exp >= window.gameData.maxExp) {
        window.gameData.level++; window.gameData.exp -= window.gameData.maxExp;
        window.gameData.maxExp = Math.floor(window.gameData.maxExp * 1.5);
        window.gameData.skillPoints += 2; window.playerCurrentHp = window.playerMaxHp;
        logMessage(`⚡ AWANS! Poziom ${window.gameData.level}.`);
    }
    updateStatusUI(); updateSkillsUI();
}

function upgradeSkill(type) {
    if(window.gameData.skillPoints <= 0) return;
    const max = { hp: 50, dmg: 50, lifesteal: 20, crit: 25 };
    if (window.gameData.skills[type] < max[type]) { window.gameData.skills[type]++; window.gameData.skillPoints--; recalculatePlayerStats(); updateSkillsUI(); }
}
function updateSkillsUI() {
    document.getElementById('skill-points').innerText = window.gameData.skillPoints;
    ['hp','dmg','lifesteal','crit'].forEach(s => { const el = document.getElementById(`skill-lvl-${s}`); if(el) el.innerText = window.gameData.skills[s]; });
}

// HP I ŚMIERĆ
function healPlayer(amount) { if(window.isDead) return; window.playerCurrentHp = Math.min(window.playerMaxHp, window.playerCurrentHp + amount); updateStatusUI(); }

function damagePlayer(amount) {
    if(window.isDead || !window.isFighting) return;
    window.playerCurrentHp -= amount;
    if(window.playerCurrentHp <= 0) { window.playerCurrentHp = 0; playerDies(); }
    updateStatusUI();
}

function playerDies() {
    window.isDead = true; window.isFighting = false;
    logMessage("<span class='text-red text-bold'>☠️ ZGINĄŁEŚ! Ekspedycja wstrzymana.</span>");
    window.gameData.gold = Math.floor(window.gameData.gold * 0.8);
    const btn = document.getElementById('attack-btn'); const resBtn = document.getElementById('resume-btn');
    if(btn) btn.style.display = 'none'; if(resBtn) resBtn.style.display = 'block';
    updateStatusUI();
}

function resumeExpedition() {
    window.playerCurrentHp = window.playerMaxHp; window.isDead = false; window.isFighting = true;
    document.getElementById('attack-btn').style.display = 'block'; document.getElementById('resume-btn').style.display = 'none';
    updateStatusUI(); logMessage("🟢 Ekspedycja wznowiona.");
    if(typeof spawnMonster === 'function') spawnMonster();
}

function updateStatusUI() {
    document.getElementById('gold-amount').innerText = Math.floor(window.gameData.gold);
    document.getElementById('iron-amount').innerText = window.gameData.iron;
    document.getElementById('mithril-amount').innerText = window.gameData.mithril;
    
    document.getElementById('player-hp-bar').style.width = (window.playerCurrentHp / window.playerMaxHp * 100) + '%';
    document.getElementById('player-current-hp').innerText = Math.floor(window.playerCurrentHp);
    document.getElementById('player-max-hp').innerText = window.playerMaxHp;
    
    document.getElementById('player-level').innerText = window.gameData.level;
    document.getElementById('exp-bar').style.width = (window.gameData.exp / window.gameData.maxExp * 100) + '%';
}

function logMessage(msg) { const logDiv = document.getElementById('battle-log'); if(!logDiv) return; const time = `<span style="color: #64748b;">[${new Date().toLocaleTimeString('pl-PL')}]</span>`; logDiv.innerHTML = `${time} ${msg}<br>` + logDiv.innerHTML; }

window.onload = () => {
    loadGame();
    if(typeof loadInventory === 'function') loadInventory();
    if(typeof loadCombat === 'function') loadCombat();
    
    setInterval(() => {
        saveGame();
        // Tylko jeśli walka jest aktywna (Jesteś na zakładce ekspedycji i żyjesz)
        if(window.isFighting) {
            if(window.totalDps > 0 && typeof autoAttack === 'function') autoAttack(window.totalDps);
            if(typeof enemyAttack === 'function') enemyAttack(); 
        }
    }, 1000);
};