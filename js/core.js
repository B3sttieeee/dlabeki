/* =========================================================
   PIXEL REALMS ONLINE
   CORE.JS
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DEFAULT GAME DATA
       ===================================================== */

    const DEFAULT_GAME_DATA = {
        gold: 0,
        iron: 0,
        mithril: 0,

        baseDmg: 10,
        baseDps: 0,

        clickPower: 1,

        pickaxeLevel: 1,
        mercenaryLevel: 0,

        level: 1,
        exp: 0,
        maxExp: 100,

        highestDungeon: 1,

        skillPoints: 0,

        skills: {
            hp: 0,
            dmg: 0,
            lifesteal: 0,
            crit: 0
        },

        prestige: 0,

        quests: {
            kills: 0,
            mines: 0,

            killsClaimed: false,
            minesClaimed: false
        }
    };

    /* =====================================================
       GLOBAL DATA
       ===================================================== */

    window.gameData =
        createDefaultGameData();

    /* =====================================================
       PLAYER STATE
       ===================================================== */

    window.playerMaxHp = 100;
    window.playerCurrentHp = 100;

    window.totalDmg = 10;
    window.totalDps = 0;
    window.totalCrit = 5;
    window.totalLifesteal = 0;

    window.isDead = false;
    window.isFighting = false;

    /* =====================================================
       AUTO EXPEDITION STATE
       ===================================================== */

    window.autoExpedition = false;
    window.autoSkip = false;

    /* =====================================================
       INTERNAL STATE
       ===================================================== */

    let initialized = false;
    let autosaveTimer = null;

    const STORAGE_KEY =
        "pixel_realms_save_v1";

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

    function clamp(
        value,
        min,
        max
    ) {
        return Math.min(
            Math.max(value, min),
            max
        );
    }

    function cloneDefaults() {
        return JSON.parse(
            JSON.stringify(
                DEFAULT_GAME_DATA
            )
        );
    }

    function createDefaultGameData() {
        return cloneDefaults();
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function setText(id, value) {
        const element =
            getElement(id);

        if (!element) {
            return;
        }

        element.textContent =
            value;
    }

    function setWidth(
        id,
        percent
    ) {
        const element =
            getElement(id);

        if (!element) {
            return;
        }

        element.style.width =
            `${clamp(
                safeNumber(
                    percent,
                    0
                ),
                0,
                100
            )}%`;
    }

    function log(message) {
        if (
            typeof window.logMessage ===
            "function"
        ) {
            window.logMessage(message);
        } else {
            console.log(message);
        }
    }

    /* =====================================================
       DEEP MERGE
       ===================================================== */

    function mergeGameData(saved) {

        const defaults =
            createDefaultGameData();

        if (
            !saved ||
            typeof saved !== "object"
        ) {
            return defaults;
        }

        return {
            ...defaults,
            ...saved,

            skills: {
                ...defaults.skills,
                ...(saved.skills || {})
            },

            quests: {
                ...defaults.quests,
                ...(saved.quests || {})
            }
        };
    }

    /* =====================================================
       SANITIZE DATA
       ===================================================== */

    function sanitizeGameData() {

        const g =
            window.gameData;

        /* Resources */

        g.gold =
            Math.max(
                0,
                safeNumber(
                    g.gold,
                    0
                )
            );

        g.iron =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.iron,
                        0
                    )
                )
            );

        g.mithril =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.mithril,
                        0
                    )
                )
            );

        /* Base stats */

        g.baseDmg =
            Math.max(
                0,
                safeNumber(
                    g.baseDmg,
                    10
                )
            );

        g.baseDps =
            Math.max(
                0,
                safeNumber(
                    g.baseDps,
                    0
                )
            );

        g.clickPower =
            Math.max(
                1,
                safeNumber(
                    g.clickPower,
                    1
                )
            );

        /* Upgrades */

        g.pickaxeLevel =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        g.pickaxeLevel,
                        1
                    )
                )
            );

        g.mercenaryLevel =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.mercenaryLevel,
                        0
                    )
                )
            );

        /* Level */

        g.level =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        g.level,
                        1
                    )
                )
            );

        g.exp =
            Math.max(
                0,
                safeNumber(
                    g.exp,
                    0
                )
            );

        g.maxExp =
            Math.max(
                1,
                safeNumber(
                    g.maxExp,
                    100
                )
            );

        /* Dungeon */

        g.highestDungeon =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        g.highestDungeon,
                        1
                    )
                )
            );

        /* Skill points */

        g.skillPoints =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.skillPoints,
                        0
                    )
                )
            );

        /* Skills */

        g.skills.hp =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.hp,
                        0
                    )
                ),
                0,
                50
            );

        g.skills.dmg =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.dmg,
                        0
                    )
                ),
                0,
                50
            );

        g.skills.lifesteal =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.lifesteal,
                        0
                    )
                ),
                0,
                20
            );

        g.skills.crit =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.crit,
                        0
                    )
                ),
                0,
                25
            );

        /* Prestige */

        g.prestige =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.prestige,
                        0
                    )
                )
            );

        /* Quests */

        g.quests.kills =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.quests.kills,
                        0
                    )
                )
            );

        g.quests.mines =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.quests.mines,
                        0
                    )
                )
            );

        g.quests.killsClaimed =
            Boolean(
                g.quests.killsClaimed
            );

        g.quests.minesClaimed =
            Boolean(
                g.quests.minesClaimed
            );
    }

    /* =====================================================
       PRESTIGE MULTIPLIER
       ===================================================== */

    function getPrestigeMultiplier() {

        return (
            1 +
            (
                window.gameData.prestige *
                0.5
            )
        );
    }

    /* =====================================================
       OPEN SCREEN
       ===================================================== */

    window.openTab =
        function openTab(
            screenId,
            button
        ) {

            const screens =
                document.querySelectorAll(
                    ".game-screen"
                );

            screens.forEach(
                screen => {
                    screen.classList.remove(
                        "active"
                    );
                }
            );

            const target =
                getElement(screenId);

            if (target) {
                target.classList.add(
                    "active"
                );
            }

            const buttons =
                document.querySelectorAll(
                    ".menu-btn"
                );

            buttons.forEach(
                btn => {
                    btn.classList.remove(
                        "active"
                    );
                }
            );

            if (button) {

                button.classList.add(
                    "active"
                );

            } else {

                const fallbackButton =
                    document.querySelector(
                        `.menu-btn[onclick*="${screenId}"]`
                    );

                if (fallbackButton) {
                    fallbackButton.classList.add(
                        "active"
                    );
                }
            }

            /*
             * Walka aktywna tylko na świecie.
             */

            window.isFighting =
                (
                    screenId ===
                    "screen-world" &&
                    !window.isDead
                );
        };

    /* =====================================================
       SAVE
       ===================================================== */

    window.saveGame =
        function saveGame() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        window.gameData
                    )
                );

                if (
                    typeof window.saveInventory ===
                    "function"
                ) {
                    window.saveInventory();
                }

                if (
                    typeof window.saveCombat ===
                    "function"
                ) {
                    window.saveCombat();
                }

                return true;

            } catch (error) {

                console.error(
                    "Błąd zapisu:",
                    error
                );

                return false;
            }
        };

    /* =====================================================
       LOAD
       ===================================================== */

    window.loadGame =
        function loadGame() {

            try {

                const saved =
                    localStorage.getItem(
                        STORAGE_KEY
                    );

                if (saved) {

                    const parsed =
                        JSON.parse(
                            saved
                        );

                    window.gameData =
                        mergeGameData(
                            parsed
                        );

                } else {

                    window.gameData =
                        createDefaultGameData();
                }

            } catch (error) {

                console.error(
                    "Błąd wczytywania:",
                    error
                );

                window.gameData =
                    createDefaultGameData();

                log(
                    "⚠️ Nie udało się wczytać zapisu. Utworzono nową postać."
                );
            }

            sanitizeGameData();

            /*
             * Ładujemy inventory.
             */

            if (
                typeof window.loadInventory ===
                "function"
            ) {
                try {
                    window.loadInventory();
                } catch (error) {
                    console.error(
                        "Inventory load error:",
                        error
                    );
                }
            }

            /*
             * Combat.
             */

            if (
                typeof window.loadCombat ===
                "function"
            ) {
                try {
                    window.loadCombat();
                } catch (error) {
                    console.error(
                        "Combat load error:",
                        error
                    );
                }
            }

            /*
             * Statystyki.
             */

            recalculatePlayerStats();

            window.playerCurrentHp =
                window.playerMaxHp;

            window.isDead = false;

            updateAllUI();
        };

    /* =====================================================
       RECALCULATE STATS
       ===================================================== */

    window.recalculatePlayerStats =
        function recalculatePlayerStats() {

            const g =
                window.gameData;

            let dmg =
                g.baseDmg +
                (
                    g.skills.dmg *
                    10
                );

            let dps =
                g.baseDps;

            let hp =
                100 +
                (
                    g.skills.hp *
                    20
                );

            let crit =
                5 +
                (
                    g.skills.crit *
                    2
                );

            let lifesteal =
                g.skills.lifesteal;

            /*
             * Equipment
             */

            if (
                window.equipped &&
                typeof window.equipped ===
                    "object"
            ) {

                Object.values(
                    window.equipped
                ).forEach(
                    item => {

                        if (!item) {
                            return;
                        }

                        const level =
                            Math.max(
                                0,
                                Math.floor(
                                    safeNumber(
                                        item.upgradeLevel,
                                        0
                                    )
                                )
                            );

                        const multiplier =
                            1 +
                            (
                                level *
                                0.10
                            );

                        dmg +=
                            Math.floor(
                                safeNumber(
                                    item.dmgBonus,
                                    0
                                ) *
                                multiplier
                            );

                        dps +=
                            Math.floor(
                                safeNumber(
                                    item.dpsBonus,
                                    0
                                ) *
                                multiplier
                            );

                        hp +=
                            Math.floor(
                                safeNumber(
                                    item.hpBonus,
                                    0
                                ) *
                                multiplier
                            );

                        crit +=
                            safeNumber(
                                item.critBonus,
                                0
                            );

                        lifesteal +=
                            safeNumber(
                                item.lifestealBonus,
                                0
                            );
                    }
                );
            }

            /*
             * Prestige
             */

            const prestige =
                getPrestigeMultiplier();

            dmg =
                Math.floor(
                    dmg *
                    prestige
                );

            dps =
                Math.floor(
                    dps *
                    prestige
                );

            hp =
                Math.floor(
                    hp *
                    prestige
                );

            /*
             * Apply
             */

            window.totalDmg =
                Math.max(
                    1,
                    dmg
                );

            window.totalDps =
                Math.max(
                    0,
                    dps
                );

            window.playerMaxHp =
                Math.max(
                    1,
                    hp
                );

            window.totalCrit =
                clamp(
                    Number(
                        crit.toFixed(2)
                    ),
                    0,
                    100
                );

            window.totalLifesteal =
                clamp(
                    Number(
                        lifesteal.toFixed(2)
                    ),
                    0,
                    100
                );

            /*
             * HP clamp
             */

            if (
                !Number.isFinite(
                    window.playerCurrentHp
                )
            ) {
                window.playerCurrentHp =
                    window.playerMaxHp;
            }

            window.playerCurrentHp =
                clamp(
                    window.playerCurrentHp,
                    0,
                    window.playerMaxHp
                );

            updateCombatStatsUI();
            updateCharacterStatsUI();
            updateStatusUI();

            return {
                dmg:
                    window.totalDmg,

                dps:
                    window.totalDps,

                hp:
                    window.playerMaxHp,

                crit:
                    window.totalCrit,

                lifesteal:
                    window.totalLifesteal
            };
        };

    /* =====================================================
       STATUS UI
       ===================================================== */

    window.updateStatusUI =
        function updateStatusUI() {

            const g =
                window.gameData;

            /*
             * Resources
             */

            setText(
                "gold-amount",
                Math.floor(
                    g.gold
                )
            );

            setText(
                "iron-amount",
                Math.floor(
                    g.iron
                )
            );

            setText(
                "mithril-amount",
                Math.floor(
                    g.mithril
                )
            );

            setText(
                "prestige-amount",
                Math.floor(
                    g.prestige
                )
            );

            /*
             * Level
             */

            setText(
                "player-level",
                g.level
            );

            /*
             * XP
             */

            setText(
                "player-exp",
                Math.floor(
                    g.exp
                )
            );

            setText(
                "player-max-exp",
                Math.floor(
                    g.maxExp
                )
            );

            setWidth(
                "exp-bar",
                (
                    g.exp /
                    Math.max(
                        1,
                        g.maxExp
                    )
                ) *
                100
            );

            /*
             * HP
             */

            window.playerCurrentHp =
                clamp(
                    safeNumber(
                        window.playerCurrentHp,
                        window.playerMaxHp
                    ),
                    0,
                    window.playerMaxHp
                );

            /*
             * Gacha etc.
             */

            updateCombatStatsUI();
        };

    /* =====================================================
       COMBAT STATS UI
       ===================================================== */

    function updateCombatStatsUI() {

        setText(
            "combat-dmg",
            Math.floor(
                safeNumber(
                    window.totalDmg,
                    0
                )
            )
        );

        setText(
            "combat-dps",
            Math.floor(
                safeNumber(
                    window.totalDps,
                    0
                )
            )
        );

        setText(
            "combat-crit",
            `${Number(
                safeNumber(
                    window.totalCrit,
                    0
                ).toFixed(1)
            )}%`
        );

        setText(
            "combat-lifesteal",
            `${Number(
                safeNumber(
                    window.totalLifesteal,
                    0
                ).toFixed(1)
            )}%`
        );
    }

    /* =====================================================
       CHARACTER STATS
       ===================================================== */

    function updateCharacterStatsUI() {

        const panel =
            getElement(
                "advanced-stats"
            );

        if (!panel) {
            return;
        }

        panel.innerHTML = `
            <div>
                <span class="muted">
                    ❤️ MAX HP
                </span>
                <strong class="text-green">
                    ${Math.floor(
                        window.playerMaxHp
                    )}
                </strong>
            </div>

            <div>
                <span class="muted">
                    ⚔ DMG
                </span>
                <strong class="text-red">
                    ${Math.floor(
                        window.totalDmg
                    )}
                </strong>
            </div>

            <div>
                <span class="muted">
                    ⚡ DPS
                </span>
                <strong class="text-blue">
                    ${Math.floor(
                        window.totalDps
                    )}
                </strong>
            </div>

            <div>
                <span class="muted">
                    🎯 KRYT
                </span>
                <strong class="text-gold">
                    ${Number(
                        window.totalCrit.toFixed(1)
                    )}%
                </strong>
            </div>

            <div>
                <span class="muted">
                    🩸 LIFESTEAL
                </span>
                <strong class="text-purple">
                    ${Number(
                        window.totalLifesteal.toFixed(1)
                    )}%
                </strong>
            </div>

            <div>
                <span class="muted">
                    ✦ PRESTIŻ
                </span>
                <strong class="text-purple">
                    +${(
                        window.gameData.prestige *
                        50
                    )}%
                </strong>
            </div>
        `;
    }

    /* =====================================================
       SKILLS
       ===================================================== */

    window.upgradeSkill =
        function upgradeSkill(
            type
        ) {

            const g =
                window.gameData;

            const limits = {
                hp: 50,
                dmg: 50,
                lifesteal: 20,
                crit: 25
            };

            if (
                !Object.prototype.hasOwnProperty.call(
                    limits,
                    type
                )
            ) {
                return false;
            }

            if (
                g.skillPoints <= 0
            ) {

                log(
                    "❌ Brak punktów umiejętności."
                );

                return false;
            }

            if (
                g.skills[type] >=
                limits[type]
            ) {

                log(
                    "🔒 Ta umiejętność osiągnęła maksymalny poziom."
                );

                return false;
            }

            g.skills[type]++;
            g.skillPoints--;

            recalculatePlayerStats();

            updateSkillsUI();

            saveGame();

            log(
                `✨ ${getSkillName(type)} osiągnęła poziom ${g.skills[type]}.`
            );

            return true;
        };

    function getSkillName(type) {

        const names = {
            hp: "Witalność",
            dmg: "Furia",
            lifesteal: "Wampiryzm",
            crit: "Precyzja"
        };

        return (
            names[type] ||
            type
        );
    }

    function updateSkillsUI() {

        setText(
            "skill-points",
            window.gameData.skillPoints
        );

        setText(
            "skill-lvl-hp",
            window.gameData.skills.hp
        );

        setText(
            "skill-lvl-dmg",
            window.gameData.skills.dmg
        );

        setText(
            "skill-lvl-lifesteal",
            window.gameData.skills.lifesteal
        );

        setText(
            "skill-lvl-crit",
            window.gameData.skills.crit
        );
    }

    /* =====================================================
       EXP / LEVEL
       ===================================================== */

    window.gainExp =
        function gainExp(
            amount
        ) {

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        0
                    )
                );

            if (
                amount <= 0
            ) {
                return 0;
            }

            const g =
                window.gameData;

            g.exp +=
                amount;

            let levelsGained =
                0;

            while (
                g.exp >=
                g.maxExp
            ) {

                g.exp -=
                    g.maxExp;

                g.level++;

                levelsGained++;

                g.maxExp =
                    Math.floor(
                        g.maxExp *
                        1.5
                    );

                /*
                 * 2 punkty za level
                 */

                g.skillPoints +=
                    2;

                /*
                 * Heal po level up
                 */

                recalculatePlayerStats();

                window.playerCurrentHp =
                    window.playerMaxHp;

                log(
                    `⚡ AWANS! Osiągnięto poziom ${g.level}. +2 ✨`
                );

                /*
                 * Auto save po levelu
                 */

                saveGame();
            }

            updateStatusUI();
            updateSkillsUI();

            return levelsGained;
        };

    /* =====================================================
       MINING
       ===================================================== */

    window.mineGold =
        function mineGold() {

            const g =
                window.gameData;

            const base =
                Math.max(
                    1,
                    Math.floor(
                        g.clickPower
                    )
                );

            const randomBonus =
                Math.floor(
                    Math.random() *
                    Math.max(
                        1,
                        g.pickaxeLevel *
                        2
                    )
                );

            const mined =
                base +
                randomBonus;

            g.gold +=
                mined;

            /*
             * Iron
             */

            const ironChance =
                Math.min(
                    0.50,
                    0.05 +
                    (
                        g.pickaxeLevel *
                        0.01
                    )
                );

            if (
                Math.random() <
                ironChance
            ) {

                g.iron++;

                log(
                    "🔩 Wydobyto Żelazo!"
                );
            }

            /*
             * Mithril
             */

            const mithrilChance =
                Math.min(
                    0.25,
                    0.01 +
                    (
                        g.pickaxeLevel *
                        0.002
                    )
                );

            if (
                Math.random() <
                mithrilChance
            ) {

                g.mithril++;

                log(
                    "💎 Wydobyto Mithril!"
                );
            }

            /*
             * Quest
             */

            g.quests.mines++;

            updateStatusUI();
            updateQuestsUI();

            /*
             * Save nie przy każdym kliknięciu
             * - robi to autosave.
             */

            return mined;
        };

    /* =====================================================
       SHOP
       ===================================================== */

    window.buyUpgrade =
        function buyUpgrade(
            type
        ) {

            const g =
                window.gameData;

            /*
             * PICKAXE
             */

            if (
                type ===
                "pickaxe"
            ) {

                const cost =
                    100 *
                    g.pickaxeLevel;

                if (
                    g.gold <
                    cost
                ) {

                    log(
                        `❌ Potrzebujesz ${cost} 🪙.`
                    );

                    return false;
                }

                g.gold -=
                    cost;

                g.pickaxeLevel++;
                g.clickPower +=
                    3;

                updateShopUI();
                updateStatusUI();

                saveGame();

                log(
                    `⛏️ Kilof ulepszony do poziomu ${g.pickaxeLevel}.`
                );

                return true;
            }

            /*
             * MERCENARY
             */

            if (
                type ===
                "mercenary"
            ) {

                const cost =
                    500 *
                    (
                        g.mercenaryLevel +
                        1
                    );

                if (
                    g.gold <
                    cost
                ) {

                    log(
                        `❌ Potrzebujesz ${cost} 🪙.`
                    );

                    return false;
                }

                g.gold -=
                    cost;

                g.mercenaryLevel++;

                /*
                 * Każdy level = +15 DPS.
                 */

                g.baseDps +=
                    15;

                recalculatePlayerStats();

                updateShopUI();
                updateStatusUI();

                saveGame();

                log(
                    `🤖 Dron bojowy LV ${g.mercenaryLevel}. +15 DPS.`
                );

                return true;
            }

            /*
             * HEAL
             */

            if (
                type ===
                "heal"
            ) {

                const cost =
                    200;

                if (
                    g.gold <
                    cost
                ) {

                    log(
                        "❌ Brak złota na Eliksir."
                    );

                    return false;
                }

                if (
                    window.playerCurrentHp >=
                    window.playerMaxHp
                ) {

                    log(
                        "❤️ Masz pełne HP."
                    );

                    return false;
                }

                g.gold -=
                    cost;

                healPlayer(
                    window.playerMaxHp *
                    0.5
                );

                updateStatusUI();
                saveGame();

                log(
                    "❤️ Użyto Eliksiru Życia."
                );

                return true;
            }

            return false;
        };

    /* =====================================================
       SHOP UI
       ===================================================== */

    function updateShopUI() {

        setText(
            "pickaxe-level",
            window.gameData.pickaxeLevel
        );

        setText(
            "mercenary-level",
            window.gameData.mercenaryLevel
        );

        setText(
            "cost-pickaxe",
            (
                100 *
                window.gameData.pickaxeLevel
            )
        );

        setText(
            "cost-merc",
            (
                500 *
                (
                    window.gameData.mercenaryLevel +
                    1
                )
            )
        );
    }

    window.updateShopUI =
        updateShopUI;

    /* =====================================================
       HP
       ===================================================== */

    window.healPlayer =
        function healPlayer(
            amount
        ) {

            if (
                window.isDead
            ) {
                return 0;
            }

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        0
                    )
                );

            const before =
                window.playerCurrentHp;

            window.playerCurrentHp =
                Math.min(
                    window.playerMaxHp,
                    window.playerCurrentHp +
                    amount
                );

            const healed =
                window.playerCurrentHp -
                before;

            return healed;
        };

    window.damagePlayer =
        function damagePlayer(
            amount
        ) {

            if (
                window.isDead
            ) {
                return false;
            }

            if (
                !window.isFighting
            ) {
                return false;
            }

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        0
                    )
                );

            if (
                amount <= 0
            ) {
                return false;
            }

            window.playerCurrentHp -=
                amount;

            if (
                window.playerCurrentHp <=
                0
            ) {

                window.playerCurrentHp =
                    0;

                playerDies();

            }

            updateStatusUI();

            return true;
        };

    /* =====================================================
       DEATH
       ===================================================== */

    window.playerDies =
        function playerDies() {

            if (
                window.isDead
            ) {
                return;
            }

            window.isDead =
                true;

            window.isFighting =
                false;

            /*
             * -20% złota
             */

            window.gameData.gold =
                Math.floor(
                    window.gameData.gold *
                    0.8
                );

            /*
             * Auto stop
             */

            if (
                window.autoExpedition
            ) {

                window.autoExpedition =
                    false;

                updateAutoUI();
            }

            const attackBtn =
                getElement(
                    "attack-btn"
                );

            const resumeBtn =
                getElement(
                    "resume-btn"
                );

            if (attackBtn) {
                attackBtn.classList.add(
                    "hidden"
                );
            }

            if (resumeBtn) {
                resumeBtn.classList.remove(
                    "hidden"
                );
            }

            const status =
                getElement(
                    "combat-status"
                );

            if (status) {

                status.innerHTML =
                    `
                        <span style="color:var(--red);">
                            ☠ DUCH WOJOWNIKA POLEGŁ
                        </span>
                    `;
            }

            log(
                "<span style='color:var(--red);'>☠ ZGINĄŁEŚ! Straciłeś 20% złota.</span>"
            );

            updateStatusUI();
            saveGame();
        };

    /* =====================================================
       RESUME
       ===================================================== */

    window.resumeExpedition =
        function resumeExpedition() {

            window.isDead =
                false;

            window.playerCurrentHp =
                window.playerMaxHp;

            window.isFighting =
                true;

            const attackBtn =
                getElement(
                    "attack-btn"
                );

            const resumeBtn =
                getElement(
                    "resume-btn"
                );

            if (attackBtn) {
                attackBtn.classList.remove(
                    "hidden"
                );
            }

            if (resumeBtn) {
                resumeBtn.classList.add(
                    "hidden"
                );
            }

            log(
                "🟢 Wróciłeś do walki."
            );

            updateStatusUI();

            if (
                typeof window.spawnMonster ===
                "function"
            ) {
                window.spawnMonster();
            }
        };

    /* =====================================================
       AUTO EXPEDITION
       ===================================================== */

    window.toggleAutoExpedition =
        function toggleAutoExpedition() {

            window.autoExpedition =
                !window.autoExpedition;

            if (
                window.autoExpedition &&
                window.isDead
            ) {

                window.autoExpedition =
                    false;

                log(
                    "❌ Nie możesz uruchomić AUTO po śmierci."
                );

                updateAutoUI();

                return false;
            }

            if (
                window.autoExpedition
            ) {

                window.isFighting =
                    true;

                log(
                    "🤖 <span class='text-green'>AUTO EKSPEDYCJA AKTYWNA.</span>"
                );

            } else {

                log(
                    "⏸ AUTO EKSPEDYCJA zatrzymana."
                );
            }

            updateAutoUI();

            return window.autoExpedition;
        };

    /* =====================================================
       AUTO SKIP
       ===================================================== */

    window.toggleAutoSkip =
        function toggleAutoSkip() {

            window.autoSkip =
                !window.autoSkip;

            updateAutoSkipUI();

            log(
                window.autoSkip
                    ? "⏩ Auto Skip: AKTYWNY."
                    : "⏸ Auto Skip: WYŁĄCZONY."
            );

            return window.autoSkip;
        };

    function updateAutoUI() {

        const status =
            getElement(
                "auto-status"
            );

        const button =
            getElement(
                "auto-toggle"
            );

        if (!status) {
            return;
        }

        if (
            window.autoExpedition
        ) {

            status.textContent =
                "ON";

            status.className =
                "status-on";

        } else {

            status.textContent =
                "OFF";

            status.className =
                "status-off";
        }

        if (button) {

            button.textContent =
                window.autoExpedition
                    ? "■ WYŁĄCZ AUTO"
                    : "▶ WŁĄCZ AUTO";
        }
    }

    function updateAutoSkipUI() {

        const buttons =
            document.querySelectorAll(
                ".auto-grid .pixel-button"
            );

        if (
            buttons.length < 2
        ) {
            return;
        }

        buttons[1].textContent =
            window.autoSkip
                ? "⏩ SKIP: ON"
                : "⏩ SKIP: OFF";
    }

    /* =====================================================
       QUESTS
       ===================================================== */

    window.updateQuestsUI =
        function updateQuestsUI() {

            const q =
                window.gameData.quests;

            setText(
                "q-kills",
                q.kills
            );

            setText(
                "q-mines",
                q.mines
            );

            const killsButton =
                getElement(
                    "btn-q-kills"
                );

            if (killsButton) {

                if (
                    q.killsClaimed
                ) {

                    killsButton.disabled =
                        true;

                    killsButton.textContent =
                        "✓ UKOŃCZONE";

                } else if (
                    q.kills >= 10
                ) {

                    killsButton.disabled =
                        false;

                    killsButton.textContent =
                        "ODBierz 1000 🪙";

                } else {

                    killsButton.disabled =
                        true;

                    killsButton.textContent =
                        "ODBierz 1000 🪙";
                }
            }

            const minesButton =
                getElement(
                    "btn-q-mines"
                );

            if (minesButton) {

                if (
                    q.minesClaimed
                ) {

                    minesButton.disabled =
                        true;

                    minesButton.textContent =
                        "✓ UKOŃCZONE";

                } else if (
                    q.mines >= 50
                ) {

                    minesButton.disabled =
                        false;

                    minesButton.textContent =
                        "ODBierz 5 💎";

                } else {

                    minesButton.disabled =
                        true;

                    minesButton.textContent =
                        "ODBierz 5 💎";
                }
            }

            setText(
                "prestige-tokens",
                window.gameData.prestige
            );

            setText(
                "prestige-multiplier",
                (
                    window.gameData.prestige *
                    50
                )
            );
        };

    /* =====================================================
       CLAIM QUEST
       ===================================================== */

    window.claimQuest =
        function claimQuest(
            type
        ) {

            const q =
                window.gameData.quests;

            if (
                type === "kills"
            ) {

                if (
                    q.kills < 10 ||
                    q.killsClaimed
                ) {
                    return false;
                }

                q.killsClaimed =
                    true;

                window.gameData.gold +=
                    1000;

                log(
                    "📜 POGROMCA BESTII ukończony! +1000 🪙"
                );
            }

            if (
                type === "mines"
            ) {

                if (
                    q.mines < 50 ||
                    q.minesClaimed
                ) {
                    return false;
                }

                q.minesClaimed =
                    true;

                window.gameData.mithril +=
                    5;

                log(
                    "📜 GÓRNIK PRZODOWY ukończony! +5 💎"
                );
            }

            updateQuestsUI();
            updateStatusUI();

            saveGame();

            return true;
        };

    /* =====================================================
       PRESTIGE
       ===================================================== */

    window.doPrestige =
        function doPrestige() {

            if (
                window.gameData.level <
                50
            ) {

                log(
                    "❌ Prestiż wymaga poziomu 50."
                );

                return false;
            }

            const accepted =
                window.confirm(
                    "AKTYWOWAĆ PRESTIŻ?\n\n" +
                    "Resetujesz:\n" +
                    "• poziom\n" +
                    "• EXP\n" +
                    "• skille\n" +
                    "• złoto\n" +
                    "• żelazo\n" +
                    "• mithril\n" +
                    "• zadania\n\n" +
                    "EKWIPUNEK ZOSTAJE.\n\n" +
                    "Otrzymasz +50% do DMG, DPS i HP."
                );

            if (!accepted) {
                return false;
            }

            window.gameData.prestige++;

            window.gameData.gold =
                0;

            window.gameData.iron =
                0;

            window.gameData.mithril =
                0;

            window.gameData.level =
                1;

            window.gameData.exp =
                0;

            window.gameData.maxExp =
                100;

            window.gameData.skillPoints =
                0;

            window.gameData.skills = {
                hp: 0,
                dmg: 0,
                lifesteal: 0,
                crit: 0
            };

            window.gameData.quests = {
                kills: 0,
                mines: 0,
                killsClaimed: false,
                minesClaimed: false
            };

            window.isDead =
                false;

            window.isFighting =
                false;

            recalculatePlayerStats();

            window.playerCurrentHp =
                window.playerMaxHp;

            updateAllUI();

            if (
                typeof window.spawnMonster ===
                "function"
            ) {
                window.spawnMonster();
            }

            saveGame();

            log(
                `🌌 PRESTIŻ ${window.gameData.prestige} AKTYWOWANY! +50% GLOBALNYCH STATYSTYK.`
            );

            return true;
        };

    /* =====================================================
       BIOME UI
       ===================================================== */

    window.selectBiomeFromMap =
        function selectBiomeFromMap(
            index
        ) {

            const select =
                getElement(
                    "biome-select"
                );

            if (!select) {
                return;
            }

            /*
             * Przykładowa blokada:
             * biome 1 od level 11,
             * biome 2 od level 31.
             */

            const requirements = [
                1,
                11,
                31
            ];

            const requiredLevel =
                requirements[index] ??
                1;

            if (
                window.gameData.level <
                requiredLevel
            ) {

                log(
                    `🔒 Ten biom wymaga poziomu ${requiredLevel}.`
                );

                return;
            }

            select.value =
                String(index);

            /*
             * Combat.js obsłuży
             * właściwe przełączenie.
             */

            if (
                typeof window.changeBiome ===
                "function"
            ) {

                window.changeBiome();

            } else {

                updateBiomeLabel(index);
            }

            /*
             * Zaznaczenie map node
             */

            document
                .querySelectorAll(
                    ".map-node"
                )
                .forEach(
                    node => {
                        node.classList.remove(
                            "active"
                        );
                    }
                );

            const selected =
                document.querySelector(
                    `.map-node[data-biome="${index}"]`
                );

            if (selected) {
                selected.classList.add(
                    "active"
                );
            }
        };

    function updateBiomeLabel(index) {

        const names = [
            "Mroczny Las",
            "Ruiny Starożytnych",
            "Piekielne Otchłanie"
        ];

        const name =
            names[index] ||
            names[0];

        setText(
            "current-biome-label",
            name
        );

        setText(
            "biome-name",
            name
        );
    }

    /* =====================================================
       GENERIC BIOME EVENT
       ===================================================== */

    window.setCurrentBiomeUI =
        function setCurrentBiomeUI(
            index,
            name
        ) {

            setText(
                "current-biome-label",
                name
            );

            setText(
                "biome-name",
                name
            );

            const select =
                getElement(
                    "biome-select"
                );

            if (select) {
                select.value =
                    String(index);
            }

            document
                .querySelectorAll(
                    ".map-node"
                )
                .forEach(
                    node => {

                        node.classList.toggle(
                            "active",
                            Number(
                                node.dataset.biome
                            ) ===
                            Number(index)
                        );
                    }
                );
        };

    /* =====================================================
       UPDATE EVERYTHING
       ===================================================== */

    function updateAllUI() {

        sanitizeGameData();

        recalculatePlayerStats();

        updateStatusUI();
        updateSkillsUI();
        updateShopUI();
        updateQuestsUI();
        updateAutoUI();
        updateAutoSkipUI();

        /*
         * Inventory count
         */

        if (
            Array.isArray(
                window.inventory
            )
        ) {

            setText(
                "inventory-count",
                window.inventory.length
            );
        }

        /*
         * Current biome
         */

        updateBiomeLabel(
            0
        );
    }

    /* =====================================================
       AUTOSAVE
       ===================================================== */

    function startAutosave() {

        if (
            autosaveTimer
        ) {
            return;
        }

        autosaveTimer =
            window.setInterval(
                () => {

                    saveGame();

                },
                5000
            );
    }

    /* =====================================================
       INVENTORY EVENTS
       ===================================================== */

    function hookInventoryRefresh() {

        /*
         * Odświeżenie liczby itemów
         * po operacjach inventory.
         */

        const originalGiveItem =
            window.giveItem;

        if (
            typeof originalGiveItem ===
            "function" &&
            !originalGiveItem.__pixelHooked
        ) {

            const wrappedGiveItem =
                function(...args) {

                    const result =
                        originalGiveItem.apply(
                            this,
                            args
                        );

                    setTimeout(
                        () => {

                            setText(
                                "inventory-count",
                                Array.isArray(
                                    window.inventory
                                )
                                    ? window.inventory.length
                                    : 0
                            );

                        },
                        0
                    );

                    return result;
                };

            wrappedGiveItem.__pixelHooked =
                true;

            window.giveItem =
                wrappedGiveItem;
        }
    }

    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    function setupKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                /*
                 * 1 = Świat
                 */

                if (
                    event.key === "1"
                ) {

                    const btn =
                        document.querySelector(
                            '.menu-btn[data-screen="world"]'
                        );

                    openTab(
                        "screen-world",
                        btn
                    );
                }

                /*
                 * 2 = Inventory
                 */

                if (
                    event.key === "2"
                ) {

                    const btn =
                        document.querySelector(
                            '.menu-btn[data-screen="inventory"]'
                        );

                    openTab(
                        "screen-inventory",
                        btn
                    );
                }

                /*
                 * 3 = Skills
                 */

                if (
                    event.key === "3"
                ) {

                    const btn =
                        document.querySelector(
                            '.menu-btn[data-screen="skills"]'
                        );

                    openTab(
                        "screen-skills",
                        btn
                    );
                }

                /*
                 * SPACE = atak
                 */

                if (
                    event.code ===
                        "Space" &&
                    document.activeElement?.tagName !==
                        "BUTTON"
                ) {

                    const world =
                        getElement(
                            "screen-world"
                        );

                    if (
                        world &&
                        world.classList.contains(
                            "active"
                        ) &&
                        typeof window.playerAttack ===
                            "function"
                    ) {

                        event.preventDefault();

                        window.playerAttack();
                    }
                }
            }
        );
    }

    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initialize() {

        if (
            initialized
        ) {
            return;
        }

        initialized =
            true;

        /*
         * Load save first.
         */

        loadGame();

        /*
         * Refresh after external scripts
         * become available.
         */

        setTimeout(
            () => {

                if (
                    typeof window.loadInventory ===
                    "function"
                ) {

                    try {
                        window.loadInventory();
                    } catch (error) {
                        console.error(
                            error
                        );
                    }
                }

                if (
                    typeof window.loadCombat ===
                    "function"
                ) {

                    try {
                        window.loadCombat();
                    } catch (error) {
                        console.error(
                            error
                        );
                    }
                }

                if (
                    typeof window.renderInventory ===
                    "function"
                ) {

                    window.renderInventory();
                }

                hookInventoryRefresh();

                /*
                 * Combat powinien być aktywny
                 * na ekranie świata.
                 */

                window.isFighting =
                    true;

                updateAllUI();

                log(
                    "🟢 PIXEL REALMS ONLINE — SYSTEM GOTOWY."
                );

            },
            50
        );

        startAutosave();
        setupKeyboard();
    }

    /* =====================================================
       BEFORE UNLOAD
       ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {
            saveGame();
        }
    );

    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }

})();
