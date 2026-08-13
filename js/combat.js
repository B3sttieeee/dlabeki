const biomes = [
    { name: "Mroczny Las", bg: "rgba(34, 139, 34, 0.05)", border: "#228B22", startLv: 1, mobNames: ["Zmutowany Wilk", "Ent Morderca", "Leśny Upiór"] },
    { name: "Ruiny Starożytnych", bg: "rgba(100, 100, 100, 0.05)", border: "#aaaaaa", startLv: 11, mobNames: ["Kamienny Golem", "Starożytny Strażnik", "Zmechanizowany Rycerz"] },
    { name: "Piekielne Otchłanie", bg: "rgba(255, 69, 0, 0.05)", border: "#FF4500", startLv: 31, mobNames: ["Demon Ognia", "Pożeracz Dusz", "Piekielny Ogar"] }
];

let currentBiomeIdx = 0;
window.combatData = { dungeonLevels: [1, 1, 1] }; // Poziom dla każdego biomu

let enemyHp = 100; let enemyMaxHp = 100; let enemyDmg = 10; let enemyAttackTimer = 0;

function changeBiome() {
    currentBiomeIdx = parseInt(document.getElementById('biome-select').value);
    const b = biomes[currentBiomeIdx];
    document.getElementById('arena-bg').style.background = b.bg;
    document.getElementById('arena-bg').style.borderColor = b.border;
    spawnMonster();
}

function saveCombat() { localStorage.setItem('de_combat_v3', JSON.stringify(window.combatData)); }
function loadCombat() { const s = localStorage.getItem('de_combat_v3'); if(s) window.combatData = JSON.parse(s); changeBiome(); }

function spawnMonster() {
    const b = biomes[currentBiomeIdx];
    const dLv = window.combatData.dungeonLevels[currentBiomeIdx];
    
    const trueLevel = b.startLv + dLv - 1;
    const scale = Math.pow(1.15, trueLevel - 1);
    
    enemyMaxHp = Math.floor(100 * scale); enemyHp = enemyMaxHp;
    enemyDmg = Math.floor(8 * scale);

    const isBoss = dLv % 10 === 0;
    if (isBoss) { enemyMaxHp *= 3; enemyHp = enemyMaxHp; enemyDmg *= 1.5; }

    document.getElementById('dungeon-level').innerText = dLv;
    document.getElementById('monster-name').innerText = isBoss ? `☠️ BOSS: ${b.mobNames[dLv % b.mobNames.length]} ☠️` : b.mobNames[dLv % b.mobNames.length];
    document.getElementById('monster-name').style.color = isBoss ? '#ef4444' : b.border;
    
    // Szansa na gwarantowany drop bossa (Floor 10, 50, 100)
    document.getElementById('boss-loot-indicator').style.display = (dLv === 10 || dLv === 50 || dLv === 100) ? 'block' : 'none';
    
    updateEnemyHpUI();
}

function playerAttack() { if(window.isDead || !window.isFighting) return; dealDamageToEnemy(window.totalDmg, true); }
function autoAttack(dps) { if (enemyHp > 0 && window.isFighting) dealDamageToEnemy(dps, false); }
function enemyAttack() {
    enemyAttackTimer++;
    if (enemyAttackTimer >= 2 && enemyHp > 0) {
        enemyAttackTimer = 0;
        let hit = Math.floor(enemyDmg * (0.85 + Math.random() * 0.3));
        damagePlayer(Math.max(1, hit));
        if(window.isFighting) { document.body.style.boxShadow = "inset 0 0 50px rgba(239, 68, 68, 0.4)"; setTimeout(() => document.body.style.boxShadow = "none", 150); }
    }
}

function dealDamageToEnemy(amount, isClick) {
    if (enemyHp <= 0) return; 
    let fDmg = amount; let crit = false;
    
    if (isClick && Math.random() < (window.totalCrit / 100)) { fDmg = Math.floor(fDmg * 2.5); crit = true; }
    enemyHp -= fDmg;
    
    if (window.totalLifesteal > 0 && isClick) healPlayer(fDmg * (window.totalLifesteal / 100));
    
    if (isClick) logMessage(crit ? `<span class="text-purple">💥 KRYTYK! ${fDmg} DMG!</span>` : `Atak: ${fDmg} DMG.`);

    if (enemyHp <= 0) { enemyHp = 0; defeatMonster(); }
    updateEnemyHpUI();
}

function updateEnemyHpUI() {
    const p = Math.max(0, (enemyHp / enemyMaxHp) * 100);
    document.getElementById('monster-hp').style.width = p + '%';
    document.getElementById('current-hp').innerText = Math.floor(enemyHp);
    document.getElementById('max-hp').innerText = Math.floor(enemyMaxHp);
}

function defeatMonster() {
    const dLv = window.combatData.dungeonLevels[currentBiomeIdx];
    const trueLevel = biomes[currentBiomeIdx].startLv + dLv - 1;
    
    const exp = Math.floor(20 * Math.pow(1.2, trueLevel - 1)); gainExp(exp);
    const gold = Math.floor((Math.random() * 20 + 30) * Math.pow(1.2, trueLevel - 1)); window.gameData.gold += gold;
    
    logMessage(`🏆 Pokonano wroga! Złoto: +${gold}, EXP: +${exp}`);
    
    // Specjalny boss drop
    if(dLv === 10 || dLv === 50 || dLv === 100) {
        logMessage("<span class='text-gold text-bold'>🎁 OTRZYMANO ARTEFAKT Z BOSSA!</span>");
        // Tu wymuszamy drop z gacha.js symulując otworzenie jajka za darmo
        if(typeof rollItem === 'function') rollItem();
    }

    window.combatData.dungeonLevels[currentBiomeIdx]++;
    saveCombat(); updateStatusUI();
    setTimeout(() => { if(window.isFighting) spawnMonster(); }, 800);
}