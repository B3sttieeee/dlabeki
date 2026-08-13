// js/core.js

window.gameData = {
    gold: 0,
    baseDmg: 10,
    baseDps: 0,
    clickPower: 1,
    pickaxeLevel: 1,
    mercenaryLevel: 0,
    highestDungeon: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    skillPoints: 0,
    zoomScale: 100,
    skills: { hp: 0, dmg: 0, lifesteal: 0, crit: 0 }
};

window.playerMaxHp = 100;
window.playerCurrentHp = 100;
window.isDead = false;

// KULOODPORNA NAWIGACJA
function openTab(tabId) {
    // 1. Ukrywamy wszystkie ekrany
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    // 2. Odznaczamy wszystkie przyciski
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // 3. Pokazujemy właściwy ekran
    const targetScreen = document.getElementById(tabId);
    if(targetScreen) targetScreen.classList.add('active');
    
    // 4. Zaznaczamy właściwy przycisk
    const activeBtn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
    if(activeBtn) activeBtn.classList.add('active');
}

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
    window.playerCurrentHp = window.playerMaxHp;
    updatePlayerHpUI();
}

function changeZoom(val) {
    window.gameData.zoomScale = val;
    document.body.style.zoom = val / 100;
    const zoomText = document.getElementById('zoom-val');
    if (zoomText) zoomText.innerText = val + '%';
    saveGame();
}

function hardReset() {
    if(confirm("UWAGA! Na pewno chcesz skasować cały postęp, levele i ekwipunek?")) {
        localStorage.clear();
        location.reload();
    }
}

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
    const pick = document.getElementById('cost-pickaxe');
    const merc = document.getElementById('cost-merc');
    if(pick) pick.innerText = 100 * window.gameData.pickaxeLevel;
    if(merc) merc.innerText = 500 * (window.gameData.mercenaryLevel + 1);
}

function gainExp(amount) {
    window.gameData.exp += amount;
    while (window.gameData.exp >= window.gameData.maxExp) {
        window.gameData.level++;
        window.gameData.exp -= window.gameData.maxExp;
        window.gameData.maxExp = Math.floor(window.gameData.maxExp * 1.5);
        window.gameData.skillPoints += 2;
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
        logMessage("❌ Osiągnięto max poziom.");
    }
}

function updateSkillsUI() {
    const pts = document.getElementById('skill-points');
    if(pts) pts.innerText = window.gameData.skillPoints;
    const shp = document.getElementById('skill-lvl-hp');
    if(shp) shp.innerText = window.gameData.skills.hp;
    const sdmg = document.getElementById('skill-lvl-dmg');
    if(sdmg) sdmg.innerText = window.gameData.skills.dmg;
    const slife = document.getElementById('skill-lvl-lifesteal');
    if(slife) slife.innerText = window.gameData.skills.lifesteal;
    const scrit = document.getElementById('skill-lvl-crit');
    if(scrit) scrit.innerText = window.gameData.skills.crit;
}

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
    
    window.gameData.gold = Math.floor(window.gameData.gold * 0.8); 
    if(window.gameData.highestDungeon > 1) {
        window.gameData.highestDungeon--;
    }
    
    const btn = document.getElementById('attack-btn');
    if(btn) {
        btn.disabled = true;
        btn.innerText = "RESTARTOWANIE SYSTEMU...";
    }

    setTimeout(() => {
        window.playerCurrentHp = window.playerMaxHp;
        window.isDead = false;
        if(btn) {
            btn.disabled = false;
            btn.innerText = "ZADAJ CIOS ⚔️";
        }
        updatePlayerHpUI();
        updateStatsUI();
        if(typeof spawnMonster === 'function') spawnMonster();
        logMessage("🟢 System zrestartowany.");
    }, 4000);
}

function updatePlayerHpUI() {
    const percent = Math.max(0, (window.playerCurrentHp / window.playerMaxHp) * 100);
    const bar = document.getElementById('player-hp-bar');
    if(bar) bar.style.width = percent + '%';
    const cur = document.getElementById('player-current-hp');
    if(cur) cur.innerText = Math.floor(window.playerCurrentHp);
    const max = document.getElementById('player-max-hp');
    if(max) max.innerText = window.playerMaxHp;
}

function updateStatsUI() {
    const g = document.getElementById('gold-amount');
    if(g) g.innerText = Math.floor(window.gameData.gold);
    const l = document.getElementById('player-level');
    if(l) l.innerText = window.gameData.level;
    const e = document.getElementById('player-exp');
    if(e) e.innerText = Math.floor(window.gameData.exp);
    const me = document.getElementById('player-max-exp');
    if(me) me.innerText = window.gameData.maxExp;
    const eb = document.getElementById('exp-bar');
    if(eb) eb.style.width = (window.gameData.exp / window.gameData.maxExp * 100) + '%';
    
    const dmg = document.getElementById('click-dmg');
    if(dmg && typeof window.totalDmg !== 'undefined') dmg.innerText = Math.floor(window.totalDmg);
    const dps = document.getElementById('auto-dps');
    if(dps && typeof window.totalDps !== 'undefined') dps.innerText = Math.floor(window.totalDps);
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
            if(typeof enemyAttack === 'function') enemyAttack(); 
        }
    }, 1000);
};