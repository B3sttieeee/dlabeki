// js/core.js

window.gameData = {
    gold: 0,
    baseDmg: 10,
    baseDps: 0,
    clickPower: 1,
    pickaxeLevel: 1,
    mercenaryLevel: 0,
    highestDungeon: 1,
    // NOWE SYSTEMY
    level: 1,
    exp: 0,
    maxExp: 100,
    skillPoints: 0,
    zoomScale: 100,
    skills: {
        hp: 0,
        dmg: 0,
        lifesteal: 0,
        crit: 0
    }
};

window.playerMaxHp = 100;
window.playerCurrentHp = 100;
window.isDead = false;

// NAWIGACJA
function openTab(tabId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ZAPIS I ODCZYT
function saveGame() {
    localStorage.setItem('nasa_save_v2', JSON.stringify(window.gameData));
    if(typeof saveInventory === 'function') saveInventory();
}

function loadGame() {
    const saved = localStorage.getItem('nasa_save_v2');
    if (saved) window.gameData = { ...window.gameData, ...JSON.parse(saved) };
    
    changeZoom(window.gameData.zoomScale);
    document.getElementById('gui-slider').value = window.gameData.zoomScale;
    
    updateShopUI();
    updateSkillsUI();
    recalculatePlayerStats();
    window.playerCurrentHp = window.playerMaxHp; // Odnowienie po wejściu
    updatePlayerHpUI();
}

// USTAWIENIA GUI
function changeZoom(val) {
    window.gameData.zoomScale = val;
    document.body.style.zoom = val / 100;
    document.getElementById('zoom-val').innerText = val + '%';
    saveGame();
}

function hardReset() {
    if(confirm("UWAGA! Na pewno chcesz skasować cały postęp, levele i ekwipunek?")) {
        localStorage.clear();
        location.reload();
    }
}

// KOPALNIA & SKLEP
function mineGold() {
    const mined = window.gameData.clickPower + Math.floor(Math.random() * (window.gameData.pickaxeLevel * 2));
    window.gameData.gold += mined;
    updateStatsUI();
    const rock = document.querySelector('.rock');
    if(rock) { rock.style.transform = `scale(0.9) translateY(10px)`; setTimeout(() => rock.style.transform = 'scale(1) translateY(0)', 80); }
}

function buyUpgrade(type) {
    if (type === 'pickaxe') {
        let cost = 100 * window.gameData.pickaxeLevel;
        if (window.gameData.gold >= cost) {
            window.gameData.gold -= cost;
            window.gameData.clickPower += 3;
            window.gameData.pickaxeLevel++;
            logMessage(`SYS: Wzmacniacz wiertła -> Poziom ${window.gameData.pickaxeLevel}`);
        } else logMessage("❌ Brak złota.");
    } else if (type === 'mercenary') {
        let cost = 500 * (window.gameData.mercenaryLevel + 1);
        if (window.gameData.gold >= cost) {
            window.gameData.gold -= cost;
            window.gameData.baseDps += 15;
            window.gameData.mercenaryLevel++;
            logMessage(`SYS: Dron Bojowy -> Poziom ${window.gameData.mercenaryLevel}`);
        } else logMessage("❌ Brak złota.");
    } else if (type === 'heal') {
        if (window.gameData.gold >= 200 && window.playerCurrentHp < window.playerMaxHp) {
            window.gameData.gold -= 200;
            healPlayer(window.playerMaxHp * 0.5);
            logMessage("SYS: Użyto paczki medycznej (+50% HP).");
        } else logMessage("❌ Brak złota lub pełne zdrowie.");
    }
    updateStatsUI();
    updateShopUI();
    if(typeof recalculateTotalStats === 'function') recalculateTotalStats();
}

function updateShopUI() {
    document.getElementById('cost-pickaxe').innerText = 100 * window.gameData.pickaxeLevel;
    document.getElementById('cost-merc').innerText = 500 * (window.gameData.mercenaryLevel + 1);
}

// DRZEWKO UMIEJĘTNOŚCI
function gainExp(amount) {
    window.gameData.exp += amount;
    while (window.gameData.exp >= window.gameData.maxExp) {
        window.gameData.level++;
        window.gameData.exp -= window.gameData.maxExp;
        window.gameData.maxExp = Math.floor(window.gameData.maxExp * 1.5); // Rośnie wymagany exp
        window.gameData.skillPoints += 2; // 2 pkt na poziom
        
        // Zawsze lecz do maksa co level
        window.playerCurrentHp = window.playerMaxHp;
        
        logMessage(`⚡ AWANS! Osiągnięto poziom ${window.gameData.level}. (+2 PKT Umiejętności)`);
    }
    updateStatsUI();
    updateSkillsUI();
}

function upgradeSkill(type) {
    if (window.gameData.skillPoints <= 0) {
        logMessage("❌ Brak punktów umiejętności.");
        return;
    }
    
    const maxLevels = { hp: 50, dmg: 50, lifesteal: 20, crit: 25 };
    
    if (window.gameData.skills[type] < maxLevels[type]) {
        window.gameData.skills[type]++;
        window.gameData.skillPoints--;
        recalculatePlayerStats();
        updateSkillsUI();
        logMessage(`🧠 Ulepszono system: ${type.toUpperCase()}`);
    } else {
        logMessage("❌ Osiągnięto maksymalny poziom tej umiejętności.");
    }
}

function updateSkillsUI() {
    document.getElementById('skill-points').innerText = window.gameData.skillPoints;
    document.getElementById('skill-lvl-hp').innerText = window.gameData.skills.hp;
    document.getElementById('skill-lvl-dmg').innerText = window.gameData.skills.dmg;
    document.getElementById('skill-lvl-lifesteal').innerText = window.gameData.skills.lifesteal;
    document.getElementById('skill-lvl-crit').innerText = window.gameData.skills.crit;
}

// HP I ŚMIERĆ
function healPlayer(amount) {
    if(window.isDead) return;
    window.playerCurrentHp += amount;
    if(window.playerCurrentHp > window.playerMaxHp) window.playerCurrentHp = window.playerMaxHp;
    updatePlayerHpUI();
}

function damagePlayer(amount) {
    if(window.isDead) return;
    window.playerCurrentHp -= amount;
    if(window.playerCurrentHp <= 0) {
        window.playerCurrentHp = 0;
        playerDies();
    }
    updatePlayerHpUI();
}

function playerDies() {
    window.isDead = true;
    logMessage("<span class='text-red text-bold'>☠️ SYSTEM KRYTYCZNY: ZGINĄŁEŚ! ☠️</span>");
    
    // Kara: Kasa i powrót do niższych dungeonów
    window.gameData.gold = Math.floor(window.gameData.gold * 0.8); 
    if(window.gameData.highestDungeon > 1) {
        window.gameData.highestDungeon--;
    }
    
    document.getElementById('attack-btn').disabled = true;
    document.getElementById('attack-btn').innerText = "RESTARTOWANIE SYSTEMU...";

    setTimeout(() => {
        window.playerCurrentHp = window.playerMaxHp;
        window.isDead = false;
        document.getElementById('attack-btn').disabled = false;
        document.getElementById('attack-btn').innerText = "ZADAJ CIOS ⚔️";
        updatePlayerHpUI();
        updateStatsUI();
        if(typeof spawnMonster === 'function') spawnMonster();
        logMessage("🟢 System zrestartowany. Jesteś gotowy do walki.");
    }, 4000);
}

function updatePlayerHpUI() {
    const percent = Math.max(0, (window.playerCurrentHp / window.playerMaxHp) * 100);
    document.getElementById('player-hp-bar').style.width = percent + '%';
    document.getElementById('player-current-hp').innerText = Math.floor(window.playerCurrentHp);
    document.getElementById('player-max-hp').innerText = window.playerMaxHp;
}

function updateStatsUI() {
    document.getElementById('gold-amount').innerText = Math.floor(window.gameData.gold);
    document.getElementById('player-level').innerText = window.gameData.level;
    document.getElementById('player-exp').innerText = Math.floor(window.gameData.exp);
    document.getElementById('player-max-exp').innerText = window.gameData.maxExp;
    document.getElementById('exp-bar').style.width = (window.gameData.exp / window.gameData.maxExp * 100) + '%';
    
    if(typeof window.totalDmg !== 'undefined') document.getElementById('click-dmg').innerText = Math.floor(window.totalDmg);
    if(typeof window.totalDps !== 'undefined') document.getElementById('auto-dps').innerText = Math.floor(window.totalDps);
}

function logMessage(msg) {
    const logDiv = document.getElementById('battle-log');
    if(!logDiv) return;
    const time = `<span style="color: #64748b;">[${new Date().toLocaleTimeString('pl-PL')}]</span>`;
    logDiv.innerHTML = `${time} ${msg}<br>` + logDiv.innerHTML;
}

window.onload = () => {
    loadGame();
    if(typeof loadInventory === 'function') loadInventory();
    if(typeof spawnMonster === 'function') spawnMonster();
    
    setInterval(saveGame, 5000); 
    setInterval(() => {
        if(!window.isDead) {
            if(window.totalDps > 0 && typeof autoAttack === 'function') autoAttack(window.totalDps);
            if(typeof enemyAttack === 'function') enemyAttack(); // Mob oddaje!
        }
    }, 1000);
};