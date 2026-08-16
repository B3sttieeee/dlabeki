/* =========================================================
   PIXEL REALMS ONLINE // ULTIMATE EDITION
   COMBAT / EXPEDITION ENGINE
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       BIOMES & MONSTERS (Zaktualizowane o Sprity!)
       ===================================================== */
    const biomes = [
        {
            name: "Mroczny Las",
            bg: "rgba(34, 139, 34, 0.06)",
            border: "#166534",
            startLv: 1,
            mobs: [
                { name: "Zmutowany Wilk", sprite: "🐺" },
                { name: "Ent Morderca", sprite: "🌳" },
                { name: "Leśny Upiór", sprite: "👻" },
                { name: "Zatruty Pająk", sprite: "🕷️" }
            ],
            boss: { name: "Król Lasu", sprite: "👹" }
        },
        {
            name: "Ruiny Starożytnych",
            bg: "rgba(100, 100, 100, 0.06)",
            border: "#475569",
            startLv: 11,
            mobs: [
                { name: "Szkielet Wojownik", sprite: "💀" },
                { name: "Kamienny Golem", sprite: "🪨" },
                { name: "Starożytny Strażnik", sprite: "🗿" },
                { name: "Ożywiona Zbroja", sprite: "🤖" }
            ],
            boss: { name: "Lisz Król", sprite: "🧙‍♂️" }
        },
        {
            name: "Piekielne Otchłanie",
            bg: "rgba(255, 69, 0, 0.06)",
            border: "#991b1b",
            startLv: 31,
            mobs: [
                { name: "Demon Ognia", sprite: "👿" },
                { name: "Piekielny Ogar", sprite: "🐕‍🦺" },
                { name: "Płonąca Czaszka", sprite: "☄️" },
                { name: "Sukub", sprite: "🧛‍♀️" }
            ],
            boss: { name: "Władca Demonów", sprite: "🐲" }
        }
    ];

    /* =====================================================
       COMBAT STATE
       ===================================================== */
    let currentBiomeIdx = 0;
    
    if (!window.combatData) {
        window.combatData = { dungeonLevels: [1, 1, 1] };
    }

    let enemyHp = 100;
    let enemyMaxHp = 100;
    let enemyDmg = 10;
    let enemyAttackTimer = 0;
    let currentEnemy = null;
    
    // Zmienne Auto-Ekspedycji
    window.isAuto = false;
    let autoInterval = null;

    /* =====================================================
       HELPERS
       ===================================================== */
    function safeNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function getBiome() {
        return biomes[currentBiomeIdx] || biomes[0];
    }

    function getDungeonLevel() {
        if (!Array.isArray(window.combatData.dungeonLevels)) {
            window.combatData.dungeonLevels = [1, 1, 1];
        }
        return Math.max(1, Math.floor(safeNumber(window.combatData.dungeonLevels[currentBiomeIdx], 1)));
    }

    /* Nadpisujemy domyślny logMessage, aby pisał w naszym nowym HTMLowym terminalu! */
    window.logMessage = function(htmlMsg) {
        const logBox = document.querySelector('.combat-log-box');
        if (!logBox) return;

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        // Czas np. [14:22:05]
        const time = new Date().toLocaleTimeString('pl-PL', { hour12: false });
        
        entry.innerHTML = `<span style="color:#64748b;">[${time}]</span> ${htmlMsg}`;
        
        // Dodaj na początek (żeby najnowsze były na górze)
        logBox.prepend(entry);

        // Usuń stare logi, żeby nie zamulić przeglądarki (max 30 wpisów)
        if (logBox.children.length > 30) {
            logBox.lastChild.remove();
        }
    };

    /* =====================================================
       ANIMATIONS
       ===================================================== */
    function animatePlayerAttack() {
        const playerSprite = document.querySelector('.player-sprite');
        if (!playerSprite) return;
        
        // Postać "skacze" w prawo by uderzyć
        playerSprite.style.transition = "transform 0.05s ease-out";
        playerSprite.style.transform = "scaleX(-1) translateX(-30px) rotate(-15deg)";
        
        setTimeout(() => {
            playerSprite.style.transition = "transform 0.3s ease-in";
            playerSprite.style.transform = "scaleX(-1) translateX(0) rotate(0deg)";
        }, 80);
    }

    function animateEnemyHit() {
        const enemySprite = document.getElementById('enemy-sprite');
        if (!enemySprite) return;
        
        // Wróg odskakuje i miga na czerwono
        enemySprite.style.transition = "all 0.05s ease-out";
        enemySprite.style.transform = "translateX(20px) rotate(10deg)";
        enemySprite.style.filter = "drop-shadow(0 0 20px rgba(239, 68, 68, 0.8)) brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)";
        
        setTimeout(() => {
            enemySprite.style.transition = "all 0.3s ease-in";
            enemySprite.style.transform = "translateX(0) rotate(0deg)";
            enemySprite.style.filter = "drop-shadow(0 15px 5px rgba(0,0,0,0.6))";
        }, 100);
    }

    /* =====================================================
       CHANGE BIOME (Podpięte pod nową mapę)
       ===================================================== */
    window.changeBiome = function changeBiome(index) {
        if (index !== undefined && index >= 0 && index < biomes.length) {
            currentBiomeIdx = index;
        }

        const biome = getBiome();

        // Podświetlamy odpowiedni przycisk na mapie
        document.querySelectorAll('.map-node').forEach((node, idx) => {
            if(idx === currentBiomeIdx) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        // Tło areny
        const arena = document.getElementById("arena-bg");
        if (arena) {
            arena.style.background = biome.bg;
            arena.style.borderColor = biome.border;
        }

        spawnMonster();
    };

    /* Dodatkowa funkcja dla HTMLowego onClick (żeby ładnie łapało z mapy) */
    window.selectBiomeFromMap = function(idx) {
        changeBiome(idx);
    };

    /* =====================================================
       SPAWN MONSTER
       ===================================================== */
    window.spawnMonster = function spawnMonster() {
        const biome = getBiome();
        const dungeonLevel = getDungeonLevel();
        const trueLevel = biome.startLv + dungeonLevel - 1;

        // Skalowanie statystyk
        const hpScale = Math.pow(1.18, trueLevel - 1); // Zwiększone dla Ultimate
        const damageScale = Math.pow(1.15, trueLevel - 1);

        enemyMaxHp = Math.max(1, Math.floor(100 * hpScale));
        enemyDmg = Math.max(1, Math.floor(10 * damageScale));

        const isBoss = dungeonLevel % 10 === 0;

        if (isBoss) {
            enemyMaxHp = Math.floor(enemyMaxHp * 4); // Boss ma 4x więcej HP
            enemyDmg = Math.floor(enemyDmg * 1.5);
        }

        enemyHp = enemyMaxHp;
        enemyAttackTimer = 0;

        // Wybór potwora i sprite'a
        let mobDef;
        if (isBoss) {
            mobDef = biome.boss;
        } else {
            const mobIndex = (dungeonLevel - 1) % biome.mobs.length;
            mobDef = biome.mobs[mobIndex];
        }

        currentEnemy = {
            name: mobDef.name,
            sprite: mobDef.sprite,
            level: trueLevel,
            dungeonLevel,
            isBoss
        };

        // UI Update
        const monsterNameEl = document.getElementById("monster-name");
        if (monsterNameEl) {
            monsterNameEl.innerText = isBoss ? `☠️ BOSS: ${mobDef.name} ☠️` : mobDef.name;
            monsterNameEl.style.color = isBoss ? "var(--ruby)" : biome.border;
        }
        
        const monsterSpriteEl = document.getElementById("enemy-sprite");
        if (monsterSpriteEl) {
            monsterSpriteEl.innerText = mobDef.sprite;
            // Animacja wejścia potwora
            monsterSpriteEl.style.animation = 'none';
            monsterSpriteEl.offsetHeight; /* trigger reflow */
            monsterSpriteEl.style.animation = 'float 3s ease-in-out infinite';
        }

        const dungeonLevelEl = document.getElementById("dungeon-level");
        if (dungeonLevelEl) {
            dungeonLevelEl.innerText = `FALA ${dungeonLevel}`;
            dungeonLevelEl.style.color = isBoss ? "var(--ruby)" : "var(--gold)";
        }

        const combatStatus = document.getElementById("combat-status");
        if (combatStatus) {
            combatStatus.innerHTML = isBoss
                ? `<span style="color:var(--ruby);">POTĘŻNY PRZECIWNIK (LV. ${trueLevel})</span>`
                : `<span style="color:var(--emerald);">STARCIE (LV. ${trueLevel})</span>`;
        }

        updateEnemyHpUI();
        return currentEnemy;
    };

    /* =====================================================
       PLAYER ATTACK (Manual)
       ===================================================== */
    window.playerAttack = function playerAttack() {
        if (enemyHp <= 0) return;

        const damage = Math.max(1, safeNumber(window.totalDmg, 10));
        
        animatePlayerAttack();
        dealDamageToEnemy(damage, true);
    };

    /* =====================================================
       AUTO ATTACK (Idle)
       ===================================================== */
    window.autoAttackTick = function autoAttackTick() {
        if (enemyHp <= 0) return;

        // AutoAttack korzysta z DPS (Damage Per Second). 
        // Skrypt wykonuje się co 0.5s, więc zadajemy połowę DPS
        const dps = Math.max(0, safeNumber(window.totalDps, 0));
        if (dps <= 0) return;

        dealDamageToEnemy(Math.floor(dps / 2), false);
    };

    window.toggleAuto = function toggleAuto() {
        window.isAuto = !window.isAuto;
        const btn = document.getElementById("auto-toggle");
        
        if (window.isAuto) {
            btn.classList.add("btn-green");
            btn.classList.remove("secondary");
            btn.innerText = "🤖 AUTO: ON";
            
            // Start Pętli Walki
            autoInterval = setInterval(() => {
                window.autoAttackTick();
                window.enemyAttack(); // Przeciwnik też atakuje w tle!
            }, 500); // Tick co pół sekundy
            
            window.logMessage(`<span style="color:var(--gold);">🤖 System Auto-Ekspedycji Aktywowany.</span>`);
        } else {
            btn.classList.remove("btn-green");
            btn.classList.add("secondary");
            btn.innerText = "🤖 AUTO: OFF";
            
            clearInterval(autoInterval);
            window.logMessage(`<span style="color:var(--muted);">🤖 System Auto-Ekspedycji Zatrzymany.</span>`);
        }
    };

    /* =====================================================
       ENEMY ATTACK
       ===================================================== */
    window.enemyAttack = function enemyAttack() {
        if (enemyHp <= 0) return;

        enemyAttackTimer += 0.5; // Tick is 0.5s

        // Wróg atakuje co 2.5 sekundy
        if (enemyAttackTimer < 2.5) return;
        enemyAttackTimer = 0;

        const randomMultiplier = 0.85 + (Math.random() * 0.30);
        const hit = Math.max(1, Math.floor(enemyDmg * randomMultiplier));

        // Zadaj obrażenia graczowi
        if (typeof window.damagePlayer === "function") {
            window.damagePlayer(hit);
        } else {
            // Tymczasowy kod jeśli core.js nie ładuje damagePlayer
            let hp = safeNumber(window.playerCurrentHp, window.playerMaxHp);
            hp -= hit;
            window.playerCurrentHp = Math.max(0, hp);
            updatePlayerHpUI();
        }

        // Damage flash (Tylko delikatnie wokół mapy by nie męczyć oczu)
        const arena = document.querySelector(".arena-box");
        if (arena) {
            arena.style.boxShadow = "inset 0 0 80px rgba(239, 68, 68, 0.4)";
            setTimeout(() => { arena.style.boxShadow = "inset 0 0 80px #000"; }, 150);
        }

        window.logMessage(`💀 Wróg rani cię za <span class="dmg">${hit}</span> DMG.`);
    };

    /* =====================================================
       DEAL DAMAGE
       ===================================================== */
    function dealDamageToEnemy(amount, isClick) {
        if (enemyHp <= 0) return;

        let finalDamage = Math.max(1, Math.floor(safeNumber(amount, 1)));
        let isCrit = false;

        /* CRIT (Zależne od statystyk gracza) */
        const critChance = Math.max(0, safeNumber(window.totalCrit, 5));
        
        // Zawsze pozwalamy na roll krytyczny (nawet z Auto, choć można ograniczyć do Click)
        if (Math.random() * 100 < critChance) {
            finalDamage = Math.floor(finalDamage * 2.5);
            isCrit = true;
        }

        enemyHp -= finalDamage;
        animateEnemyHit();

        /* LIFESTEAL */
        const lifesteal = safeNumber(window.totalLifesteal, 0);
        if (lifesteal > 0) {
            const healAmount = Math.floor(finalDamage * (lifesteal / 100));
            if (healAmount > 0) {
                if (typeof window.healPlayer === "function") {
                    window.healPlayer(healAmount);
                } else {
                    window.playerCurrentHp = Math.min(window.playerMaxHp, window.playerCurrentHp + healAmount);
                    updatePlayerHpUI();
                }
                if (isClick && Math.random() > 0.5) { // Ograniczamy spam leczenia w logach
                    window.logMessage(`Wampiryzm leczy Cię o <span class="heal">+${healAmount}</span> HP.`);
                }
            }
        }

        /* LOGGING */
        if (isClick) {
            if (isCrit) {
                window.logMessage(`Potężny cios! <span class="crit">KRYTYK!</span> <span class="dmg">${finalDamage}</span> DMG!`);
            } else {
                window.logMessage(`Zadajesz <span class="dmg">${finalDamage}</span> obrażeń.`);
            }
        }

        /* ŚMIERĆ WROGA */
        if (enemyHp <= 0) {
            enemyHp = 0;
            defeatMonster();
        }

        updateEnemyHpUI();
    }

    /* =====================================================
       UI UPDATES (Enemy & Player HP)
       ===================================================== */
    function updateEnemyHpUI() {
        const percentage = enemyMaxHp > 0 ? (enemyHp / enemyMaxHp) * 100 : 0;

        const hpBar = document.getElementById("monster-hp");
        if (hpBar) hpBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;

        const currentHpEl = document.getElementById("current-hp");
        if (currentHpEl) currentHpEl.innerText = Math.floor(enemyHp).toLocaleString();

        const maxHpEl = document.getElementById("max-hp");
        if (maxHpEl) maxHpEl.innerText = Math.floor(enemyMaxHp).toLocaleString();
    }

    function updatePlayerHpUI() {
        // Tymczasowa funkcja do obsługi HP gracza (Normalnie przejmuje to core.js)
        const percentage = window.playerMaxHp > 0 ? (window.playerCurrentHp / window.playerMaxHp) * 100 : 0;
        
        const hpBar = document.querySelector(".hp-bar-fill.player");
        if (hpBar) hpBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        
        const hpText = document.querySelector(".entity .hp-text");
        if (hpText) hpText.innerText = `${Math.floor(window.playerCurrentHp).toLocaleString()} / ${Math.floor(window.playerMaxHp).toLocaleString()}`;
    }

    /* =====================================================
       DEFEAT MONSTER & REWARDS
       ===================================================== */
    function defeatMonster() {
        if (!currentEnemy) return;

        const biome = getBiome();
        const dungeonLevel = getDungeonLevel();
        const trueLevel = biome.startLv + dungeonLevel - 1;

        /* PULA NAGRÓD (Złoto i EXP) */
        let exp = Math.floor(25 * Math.pow(1.25, trueLevel - 1));
        let gold = Math.floor((40 + Math.random() * 30) * Math.pow(1.2, trueLevel - 1));

        // Bonusy z Ekwipunku!
        exp = Math.floor(exp * (1 + (safeNumber(window.totalExpBonus, 0) / 100)));
        gold = Math.floor(gold * (1 + (safeNumber(window.totalGoldBonus, 0) / 100)));

        /* DODANIE ZŁOTA I EXP (Symulacja do momentu core.js) */
        if (!window.gameData) window.gameData = { gold: 0, iron: 0, mithril: 0 };
        window.gameData.gold += gold;
        
        // Zaktualizuj UI złota
        const goldUI = document.getElementById('res-gold');
        if (goldUI) goldUI.innerText = window.gameData.gold.toLocaleString();

        /* LOG ŚMIERCI */
        window.logMessage(`🏆 Zgładzono <span style="color:var(--emerald);">${currentEnemy.name}</span>!`);
        window.logMessage(`Loot: <span style="color:var(--gold);">+${gold.toLocaleString()} 🪙</span> | EXP: <span style="color:var(--xp-purple);">+${exp.toLocaleString()} ✨</span>`);

        if (currentEnemy.isBoss) {
            window.logMessage(`<span style="color:var(--gold); font-family:var(--font-pixel); font-size:12px;">👑 BOSS POKONANY! ODBLOKOWANO KOLEJNĄ FALĘ!</span>`);
            
            // Szansa na dodatkowy łup z bossa (Mithril)
            if (Math.random() > 0.5) {
                window.gameData.mithril += 1;
                const mithrilUI = document.getElementById('res-mithril');
                if (mithrilUI) mithrilUI.innerText = window.gameData.mithril;
                window.logMessage(`💎 Otrzymano Kryształ Mithrilu!`);
            }
        }

        /* NEXT LEVEL */
        window.combatData.dungeonLevels[currentBiomeIdx]++;

        /* SAVE & SPAWN NEXT */
        try {
            localStorage.setItem("nasa_combat_v6", JSON.stringify(window.combatData));
        } catch(e) {}

        // Spawn następnego potwora z małym opóźnieniem
        setTimeout(() => {
            spawnMonster();
        }, currentEnemy.isBoss ? 1500 : 800);
    }

    /* =====================================================
       INITIALIZATION
       ===================================================== */
    function initializeCombat() {
        // Ładowanie
        try {
            const saved = localStorage.getItem("nasa_combat_v6");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && Array.isArray(parsed.dungeonLevels)) {
                    window.combatData.dungeonLevels = parsed.dungeonLevels;
                }
            }
        } catch(e) {}

        while (window.combatData.dungeonLevels.length < biomes.length) {
            window.combatData.dungeonLevels.push(1);
        }

        // Zawsze upewniamy się, że zdrowie gracza jest na start
        if(!window.playerCurrentHp) window.playerCurrentHp = window.playerMaxHp;
        updatePlayerHpUI();

        // Uruchomienie
        changeBiome(0); // Odpala pierwszy biom
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeCombat, { once: true });
    } else {
        initializeCombat();
    }

})();
