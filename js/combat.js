/* =========================================================
   D&E // TERMINAL V6
   COMBAT / EXPEDITION ENGINE
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       BIOMES
       ===================================================== */

    const biomes = [

        {
            name: "Mroczny Las",

            bg:
                "rgba(34, 139, 34, 0.06)",

            border:
                "#228B22",

            startLv: 1,

            mobNames: [
                "Zmutowany Wilk",
                "Ent Morderca",
                "Leśny Upiór"
            ]
        },

        {
            name: "Ruiny Starożytnych",

            bg:
                "rgba(100, 100, 100, 0.06)",

            border:
                "#aaaaaa",

            startLv: 11,

            mobNames: [
                "Kamienny Golem",
                "Starożytny Strażnik",
                "Zmechanizowany Rycerz"
            ]
        },

        {
            name: "Piekielne Otchłanie",

            bg:
                "rgba(255, 69, 0, 0.06)",

            border:
                "#FF4500",

            startLv: 31,

            mobNames: [
                "Demon Ognia",
                "Pożeracz Dusz",
                "Piekielny Ogar"
            ]
        }
    ];

    /* =====================================================
       COMBAT STATE
       ===================================================== */

    let currentBiomeIdx = 0;

    window.combatData = {
        dungeonLevels: [1, 1, 1]
    };

    let enemyHp = 100;
    let enemyMaxHp = 100;
    let enemyDmg = 10;

    let enemyAttackTimer = 0;

    let currentEnemy = null;

    /* =====================================================
       HELPERS
       ===================================================== */

    function safeNumber(
        value,
        fallback = 0
    ) {
        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;
    }

    function getBiome() {
        return (
            biomes[currentBiomeIdx] ||
            biomes[0]
        );
    }

    function getDungeonLevel() {

        if (
            !Array.isArray(
                window.combatData.dungeonLevels
            )
        ) {
            window.combatData.dungeonLevels =
                [1, 1, 1];
        }

        if (
            !Number.isFinite(
                Number(
                    window.combatData
                        .dungeonLevels[
                            currentBiomeIdx
                        ]
                )
            )
        ) {
            window.combatData
                .dungeonLevels[
                    currentBiomeIdx
                ] = 1;
        }

        return Math.max(
            1,
            Math.floor(
                safeNumber(
                    window.combatData
                        .dungeonLevels[
                            currentBiomeIdx
                        ],
                    1
                )
            )
        );
    }

    /* =====================================================
       CHANGE BIOME
       ===================================================== */

    window.changeBiome =
        function changeBiome() {

            const select =
                document.getElementById(
                    "biome-select"
                );

            if (select) {

                currentBiomeIdx =
                    Math.max(
                        0,
                        Math.min(
                            biomes.length - 1,
                            parseInt(
                                select.value,
                                10
                            ) || 0
                        )
                    );
            }

            const biome =
                getBiome();

            const arena =
                document.getElementById(
                    "arena-bg"
                );

            if (arena) {

                arena.style.background =
                    biome.bg;

                arena.style.borderColor =
                    biome.border;
            }

            /*
             * Spawn nowego przeciwnika
             */

            spawnMonster();

            /*
             * Status
             */

            const combatStatus =
                document.getElementById(
                    "combat-status"
                );

            if (combatStatus) {

                combatStatus.innerHTML =
                    `
                        <span style="color:${biome.border};">
                            ${biome.name}
                        </span>
                        <br>
                        <span class="text-dim">
                            Ekspedycja aktywna
                        </span>
                    `;
            }
        };

    /* =====================================================
       SAVE COMBAT
       ===================================================== */

    window.saveCombat =
        function saveCombat() {

            try {

                localStorage.setItem(
                    "nasa_combat_v6",
                    JSON.stringify(
                        window.combatData
                    )
                );

                return true;

            } catch (error) {

                console.error(
                    "Błąd zapisu combat:",
                    error
                );

                return false;
            }
        };

    /* =====================================================
       LOAD COMBAT
       ===================================================== */

    window.loadCombat =
        function loadCombat() {

            try {

                const saved =
                    localStorage.getItem(
                        "nasa_combat_v6"
                    );

                if (saved) {

                    const parsed =
                        JSON.parse(
                            saved
                        );

                    if (
                        parsed &&
                        Array.isArray(
                            parsed.dungeonLevels
                        )
                    ) {

                        window.combatData = {
                            dungeonLevels: [
                                1,
                                1,
                                1,
                                ...parsed.dungeonLevels
                            ].slice(0, 3)
                        };
                    }
                }

            } catch (error) {

                console.error(
                    "Błąd ładowania combat:",
                    error
                );

                window.combatData = {
                    dungeonLevels: [
                        1,
                        1,
                        1
                    ]
                };
            }

            /*
             * Upewnij się, że zawsze są 3 biomy
             */

            while (
                window.combatData.dungeonLevels.length <
                3
            ) {

                window.combatData
                    .dungeonLevels
                    .push(1);
            }

            changeBiome();
        };

    /* =====================================================
       SPAWN MONSTER
       ===================================================== */

    window.spawnMonster =
        function spawnMonster() {

            const biome =
                getBiome();

            const dungeonLevel =
                getDungeonLevel();

            const trueLevel =
                biome.startLv +
                dungeonLevel -
                1;

            /*
             * Główne skalowanie
             */

            const hpScale =
                Math.pow(
                    1.15,
                    trueLevel - 1
                );

            const damageScale =
                Math.pow(
                    1.12,
                    trueLevel - 1
                );

            /*
             * Bazowe HP
             */

            enemyMaxHp =
                Math.max(
                    1,
                    Math.floor(
                        100 *
                        hpScale
                    )
                );

            /*
             * Bazowy DMG
             */

            enemyDmg =
                Math.max(
                    1,
                    Math.floor(
                        8 *
                        damageScale
                    )
                );

            /*
             * Boss co 10 poziomów
             */

            const isBoss =
                dungeonLevel % 10 === 0;

            /*
             * Boss multiplier
             */

            if (isBoss) {

                enemyMaxHp =
                    Math.floor(
                        enemyMaxHp *
                        3
                    );

                enemyDmg =
                    Math.floor(
                        enemyDmg *
                        1.5
                    );
            }

            enemyHp =
                enemyMaxHp;

            enemyAttackTimer =
                0;

            /*
             * Mob index
             *
             * Poprzednio dLv % length
             * powodował pomijanie pierwszego
             * przeciwnika.
             */

            const mobIndex =
                (
                    dungeonLevel - 1
                ) %
                biome.mobNames.length;

            const mobName =
                biome.mobNames[
                    mobIndex
                ];

            currentEnemy = {
                name: mobName,
                level: trueLevel,
                dungeonLevel,
                isBoss
            };

            /*
             * Monster name
             */

            const monsterName =
                document.getElementById(
                    "monster-name"
                );

            if (monsterName) {

                monsterName.innerText =
                    isBoss
                        ? `☠️ BOSS: ${mobName} ☠️`
                        : mobName;

                monsterName.style.color =
                    isBoss
                        ? "#ef4444"
                        : biome.border;
            }

            /*
             * Dungeon level
             */

            const dungeonLevelEl =
                document.getElementById(
                    "dungeon-level"
                );

            if (dungeonLevelEl) {

                dungeonLevelEl.innerText =
                    dungeonLevel;
            }

            /*
             * Boss arena effect
             */

            const arena =
                document.getElementById(
                    "arena-bg"
                );

            if (arena) {

                arena.style.background =
                    isBoss
                        ? "rgba(239, 68, 68, 0.10)"
                        : biome.bg;

                arena.style.borderColor =
                    isBoss
                        ? "#ef4444"
                        : biome.border;
            }

            updateEnemyHpUI();

            /*
             * Combat status
             */

            const combatStatus =
                document.getElementById(
                    "combat-status"
                );

            if (combatStatus) {

                combatStatus.innerHTML =
                    isBoss
                        ? `
                            <span class="text-red text-bold">
                                ☠️ BOSS DETECTED
                            </span>
                            <br>
                            <span class="text-dim">
                                Poziom ${trueLevel}
                            </span>
                        `
                        : `
                            <span class="text-green">
                                🎯 CEL NAMIERZONY
                            </span>
                            <br>
                            <span class="text-dim">
                                Poziom ${trueLevel}
                            </span>
                        `;
            }

            return currentEnemy;
        };

    /* =====================================================
       PLAYER ATTACK
       ===================================================== */

    window.playerAttack =
        function playerAttack() {

            if (
                window.isDead ||
                !window.isFighting
            ) {
                return;
            }

            if (
                enemyHp <= 0
            ) {
                return;
            }

            const damage =
                Math.max(
                    1,
                    safeNumber(
                        window.totalDmg,
                        1
                    )
                );

            dealDamageToEnemy(
                damage,
                true
            );
        };

    /* =====================================================
       AUTO ATTACK
       ===================================================== */

    window.autoAttack =
        function autoAttack(
            dps
        ) {

            if (
                enemyHp <= 0 ||
                !window.isFighting ||
                window.isDead
            ) {
                return;
            }

            dps =
                Math.max(
                    0,
                    safeNumber(
                        dps
                    )
                );

            if (
                dps <= 0
            ) {
                return;
            }

            dealDamageToEnemy(
                dps,
                false
            );
        };

    /* =====================================================
       ENEMY ATTACK
       ===================================================== */

    window.enemyAttack =
        function enemyAttack() {

            if (
                !window.isFighting ||
                window.isDead ||
                enemyHp <= 0
            ) {
                return;
            }

            enemyAttackTimer++;

            /*
             * Wróg atakuje co 2 sekundy.
             */

            if (
                enemyAttackTimer < 2
            ) {
                return;
            }

            enemyAttackTimer = 0;

            const randomMultiplier =
                0.85 +
                (
                    Math.random() *
                    0.30
                );

            const hit =
                Math.max(
                    1,
                    Math.floor(
                        enemyDmg *
                        randomMultiplier
                    )
                );

            if (
                typeof window.damagePlayer ===
                "function"
            ) {

                window.damagePlayer(
                    hit
                );
            }

            /*
             * Damage flash
             */

            if (
                window.isFighting &&
                !window.isDead
            ) {

                document.body.style.boxShadow =
                    "inset 0 0 50px rgba(239, 68, 68, 0.35)";

                window.setTimeout(
                    () => {

                        document.body.style.boxShadow =
                            "";

                    },
                    150
                );
            }

            /*
             * Log tylko czasami,
             * żeby nie spamować.
             */

            if (
                typeof window.logMessage ===
                "function"
            ) {

                window.logMessage(
                    `👹 Wróg zadał ${hit} DMG.`
                );
            }
        };

    /* =====================================================
       DEAL DAMAGE
       ===================================================== */

    function dealDamageToEnemy(
        amount,
        isClick
    ) {

        if (
            enemyHp <= 0 ||
            window.isDead
        ) {
            return;
        }

        let finalDamage =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        amount,
                        1
                    )
                )
            );

        let isCrit =
            false;

        /*
         * CRIT
         *
         * Tylko kliknięcia mogą
         * robić krytyczne obrażenia.
         */

        const critChance =
            Math.max(
                0,
                safeNumber(
                    window.totalCrit,
                    0
                )
            );

        if (
            isClick &&
            Math.random() <
            (
                critChance /
                100
            )
        ) {

            finalDamage =
                Math.floor(
                    finalDamage *
                    2.5
                );

            isCrit =
                true;
        }

        /*
         * Zadajemy damage.
         */

        enemyHp -=
            finalDamage;

        /*
         * LIFESTEAL
         */

        if (
            isClick &&
            safeNumber(
                window.totalLifesteal,
                0
            ) > 0 &&
            typeof window.healPlayer ===
                "function"
        ) {

            const healAmount =
                finalDamage *
                (
                    safeNumber(
                        window.totalLifesteal,
                        0
                    ) /
                    100
                );

            window.healPlayer(
                healAmount
            );
        }

        /*
         * LOG
         */

        if (
            isClick &&
            typeof window.logMessage ===
                "function"
        ) {

            if (isCrit) {

                window.logMessage(
                    `
                    <span class="text-purple text-bold">
                        💥 KRYTYK!
                        ${finalDamage} DMG!
                    </span>
                    `
                );

            } else {

                window.logMessage(
                    `
                    ⚔️ Atak:
                    <span class="text-red">
                        ${finalDamage} DMG
                    </span>
                    `
                );
            }
        }

        /*
         * Wróg umarł
         */

        if (
            enemyHp <= 0
        ) {

            enemyHp = 0;

            defeatMonster();
        }

        updateEnemyHpUI();
    }

    /* =====================================================
       ENEMY HP UI
       ===================================================== */

    function updateEnemyHpUI() {

        const percentage =
            enemyMaxHp > 0
                ? (
                    enemyHp /
                    enemyMaxHp
                ) *
                100
                : 0;

        const hpBar =
            document.getElementById(
                "monster-hp"
            );

        if (hpBar) {

            hpBar.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        percentage
                    )
                )}%`;
        }

        const currentHp =
            document.getElementById(
                "current-hp"
            );

        if (currentHp) {

            currentHp.innerText =
                Math.floor(
                    enemyHp
                );
        }

        const maxHp =
            document.getElementById(
                "max-hp"
            );

        if (maxHp) {

            maxHp.innerText =
                Math.floor(
                    enemyMaxHp
                );
        }
    }

    /* =====================================================
       DEFEAT MONSTER
       ===================================================== */

    function defeatMonster() {

        if (
            !currentEnemy
        ) {
            return;
        }

        const biome =
            getBiome();

        const dungeonLevel =
            getDungeonLevel();

        const trueLevel =
            biome.startLv +
            dungeonLevel -
            1;

        /*
         * EXP
         */

        const exp =
            Math.floor(
                20 *
                Math.pow(
                    1.2,
                    trueLevel - 1
                )
            );

        /*
         * GOLD
         */

        const gold =
            Math.floor(
                (
                    30 +
                    Math.random() * 20
                ) *
                Math.pow(
                    1.2,
                    trueLevel - 1
                )
            );

        /*
         * Quest
         */

        if (
            window.gameData &&
            window.gameData.quests
        ) {

            window.gameData
                .quests
                .kills++;
        }

        /*
         * Nagrody
         */

        if (
            typeof window.gainExp ===
            "function"
        ) {

            window.gainExp(
                exp
            );
        }

        if (
            window.gameData
        ) {

            window.gameData.gold +=
                gold;
        }

        /*
         * LOG
         */

        if (
            typeof window.logMessage ===
            "function"
        ) {

            window.logMessage(
                `
                🏆 Pokonano
                <span class="text-green">
                    ${currentEnemy.name}
                </span>!
                Złoto:
                <span class="text-gold">
                    +${gold}
                </span>
                |
                EXP:
                <span class="text-accent">
                    +${exp}
                </span>
                `
            );
        }

        /*
         * BOSS REWARD
         */

        if (
            currentEnemy.isBoss
        ) {

            /*
             * Specjalny log
             */

            if (
                typeof window.logMessage ===
                "function"
            ) {

                window.logMessage(
                    `
                    <span class="text-gold text-bold">
                        ☠️ BOSS POKONANY!
                    </span>
                    `
                );
            }

            /*
             * Losowanie itemu
             */

            if (
                typeof window.rollItem ===
                "function"
            ) {

                window.rollItem();
            }
        }

        /*
         * Następny dungeon
         */

        window.combatData
            .dungeonLevels[
                currentBiomeIdx
            ]++;

        /*
         * Aktualizacja highest dungeon
         */

        if (
            window.gameData
        ) {

            window.gameData
                .highestDungeon =
                Math.max(
                    window.gameData
                        .highestDungeon,
                    window.combatData
                        .dungeonLevels[
                            currentBiomeIdx
                        ] - 1
                );
        }

        /*
         * Quest UI
         */

        if (
            typeof window.updateQuestsUI ===
            "function"
        ) {

            window.updateQuestsUI();
        }

        /*
         * Save
         */

        saveCombat();

        if (
            typeof window.saveGame ===
            "function"
        ) {

            window.saveGame();
        }

        if (
            typeof window.updateStatusUI ===
            "function"
        ) {

            window.updateStatusUI();
        }

        /*
         * New enemy after delay
         */

        window.setTimeout(
            () => {

                if (
                    window.isFighting &&
                    !window.isDead
                ) {

                    spawnMonster();
                }

            },
            currentEnemy.isBoss
                ? 1500
                : 800
        );
    }

    /* =====================================================
       PUBLIC HELPERS
       ===================================================== */

    window.getCurrentEnemy =
        function getCurrentEnemy() {
            return currentEnemy;
        };

    window.getEnemyHp =
        function getEnemyHp() {
            return enemyHp;
        };

    window.getEnemyMaxHp =
        function getEnemyMaxHp() {
            return enemyMaxHp;
        };

    window.getCurrentBiome =
        function getCurrentBiome() {
            return getBiome();
        };

    window.getCurrentBiomeIndex =
        function getCurrentBiomeIndex() {
            return currentBiomeIdx;
        };

    window.getDungeonLevel =
        function getDungeonLevelPublic() {
            return getDungeonLevel();
        };

    window.getBiomes =
        function getBiomes() {
            return biomes;
        };

    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeCombat() {

        if (
            !Array.isArray(
                window.combatData.dungeonLevels
            )
        ) {

            window.combatData = {
                dungeonLevels: [
                    1,
                    1,
                    1
                ]
            };
        }

        while (
            window.combatData
                .dungeonLevels
                .length < 3
        ) {

            window.combatData
                .dungeonLevels
                .push(1);
        }

        /*
         * Jeżeli select istnieje,
         * ustaw aktualny biome.
         */

        const select =
            document.getElementById(
                "biome-select"
            );

        if (select) {

            currentBiomeIdx =
                Math.max(
                    0,
                    Math.min(
                        2,
                        parseInt(
                            select.value,
                            10
                        ) || 0
                    )
                );
        }

        spawnMonster();
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeCombat,
            {
                once: true
            }
        );

    } else {

        initializeCombat();
    }

})();