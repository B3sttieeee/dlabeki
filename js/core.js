/* =========================================================
   PIXEL REALMS ONLINE
   CORE.JS
   ULTIMATE GAME CORE
   ========================================================= */

(() => {
    "use strict";

    /* =========================================================
       VERSION
       ========================================================= */

    const CORE_VERSION = "2.5.0";
    const SAVE_VERSION = 7;

    const STORAGE_KEY =
        "pixel_realms_save_v7";

    const SETTINGS_KEY =
        "pixel_realms_settings_v1";

    /* =========================================================
       DEFAULT GAME DATA
       ========================================================= */

    const DEFAULT_GAME_DATA = {

        saveVersion: SAVE_VERSION,

        createdAt: Date.now(),

        lastSavedAt: Date.now(),

        lastOnlineAt: Date.now(),

        playTime: 0,

        /* =====================================================
           PLAYER
           ===================================================== */

        player: {

            name: "Lord Wędrowiec",

            class: "Wojownik",

            level: 1,

            exp: 0,

            maxExp: 100,

            skillPoints: 0,

            talentPoints: 0,

            prestige: 0,

            rebirth: 0,

            power: 0,

            rank: "WĘDROWIEC"
        },

        /* =====================================================
           CURRENCIES
           ===================================================== */

        currencies: {

            gold: 0,

            iron: 0,

            mithril: 0,

            rubies: 0,

            crystals: 0,

            tokens: 0,

            dungeonKeys: 0,

            energy: 100,

            maxEnergy: 100
        },

        /* =====================================================
           BASE STATS
           ===================================================== */

        stats: {

            baseHp: 100,

            baseDmg: 10,

            baseDps: 0,

            baseDefense: 0,

            baseMagicPower: 0,

            baseAttackSpeed: 1,

            baseCrit: 5,

            baseCritDamage: 150,

            baseLifesteal: 0,

            baseDodge: 0,

            baseBlock: 0,

            baseArmorPen: 0,

            baseMagicFind: 0,

            baseGoldBonus: 0,

            baseExpBonus: 0
        },

        /* =====================================================
           CLICK / MINING
           ===================================================== */

        mining: {

            clickPower: 1,

            pickaxeLevel: 1,

            miningSpeed: 1,

            miningLuck: 0,

            oreMultiplier: 1
        },

        /* =====================================================
           MERCENARY
           ===================================================== */

        mercenary: {

            level: 0,

            dps: 0,

            attackSpeed: 1,

            unlocked: false
        },

        /* =====================================================
           COMBAT
           ===================================================== */

        combat: {

            totalKills: 0,

            totalBossKills: 0,

            totalDamage: 0,

            totalCriticalHits: 0,

            totalDeaths: 0,

            totalHealing: 0,

            currentWave: 1,

            highestWave: 1,

            currentDungeon: 1,

            highestDungeon: 1,

            currentRoom: 1,

            highestRoom: 1,

            combo: 0,

            maxCombo: 0,

            autoBattle: false,

            autoSkip: false,

            autoLoot: true,

            autoPotion: true,

            autoBoss: true
        },

        /* =====================================================
           CURRENT PLAYER COMBAT STATE
           ===================================================== */

        combatState: {

            currentHp: 100,

            currentMp: 100,

            maxMp: 100,

            rage: 0,

            maxRage: 100,

            dead: false,

            fighting: false,

            invulnerableUntil: 0,

            lastHitAt: 0
        },

        /* =====================================================
           SKILLS
           ===================================================== */

        skills: {

            hp: 0,

            dmg: 0,

            defense: 0,

            lifesteal: 0,

            crit: 0,

            critDamage: 0,

            attackSpeed: 0,

            dodge: 0,

            block: 0,

            magic: 0,

            gold: 0,

            exp: 0,

            luck: 0
        },

        /* =====================================================
           TALENTS
           ===================================================== */

        talents: {

            points: 0,

            unlocked: [],

            levels: {},

            activeLoadout: [],

            passiveBonuses: {},

            activeSkills: []
        },

        /* =====================================================
           PRESTIGE
           ===================================================== */

        prestige: {

            level: 0,

            totalPrestiges: 0,

            permanentMultiplier: 1,

            permanentDamage: 0,

            permanentHp: 0,

            permanentGold: 0,

            permanentExp: 0,

            permanentLuck: 0
        },

        /* =====================================================
           QUESTS
           ===================================================== */

        quests: {

            kills: 0,

            mines: 0,

            bosses: 0,

            dungeons: 0,

            chests: 0,

            goldEarned: 0,

            damageDealt: 0,

            questsCompleted: 0,

            killsClaimed: false,

            minesClaimed: false,

            bossClaimed: false,

            dungeonClaimed: false
        },

        /* =====================================================
           ACHIEVEMENTS
           ===================================================== */

        achievements: {

            unlocked: [],

            progress: {},

            points: 0
        },

        /* =====================================================
           DAILY SYSTEM
           ===================================================== */

        daily: {

            loginDay: 1,

            streak: 0,

            lastClaimDate: null,

            chestClaimed: false,

            rewardClaimed: false,

            dungeonCompleted: false,

            miningCompleted: false,

            killCompleted: false
        },

        /* =====================================================
           GACHA
           ===================================================== */

        gacha: {

            totalOpens: 0,

            mythicDrops: 0,

            legendaryDrops: 0,

            epicDrops: 0,

            rareDrops: 0,

            pity: 0,

            mythicPity: 0,

            history: []
        },

        /* =====================================================
           GUILD
           ===================================================== */

        guild: {

            joined: false,

            name: "",

            level: 0,

            contribution: 0,

            prestige: 0,

            raidsCompleted: 0,

            guildBuff: 0
        },

        /* =====================================================
           WORLD
           ===================================================== */

        world: {

            currentBiome: 0,

            unlockedBiomes: [0],

            discoveredLocations: [],

            activeLocation: "Przeklęte Katakumby",

            coordinates: {

                x: 142,

                y: 88
            },

            explorationCount: 0
        },

        /* =====================================================
           DUNGEON
           ===================================================== */

        dungeon: {

            active: false,

            difficulty: "Normal",

            room: 1,

            maxRoom: 10,

            timer: 0,

            bossesKilled: 0,

            rewardMultiplier: 1
        },

        /* =====================================================
           EVENTS
           ===================================================== */

        events: {

            activeEvent: "Dragonfall",

            eventProgress: 0,

            eventClaimed: false,

            eventKills: 0,

            eventBosses: 0,

            eventChests: 0
        },

        /* =====================================================
           SETTINGS
           ===================================================== */

        settings: {

            autoSave: true,

            autoLoot: true,

            showDamageNumbers: true,

            showCriticalNumbers: true,

            screenShake: true,

            particles: true,

            sound: true,

            music: true,

            reduceMotion: false
        },

        /* =====================================================
           QUEST STATE
           ===================================================== */

        progression: {

            storyChapter: 1,

            storyStep: 0,

            worldLevel: 1,

            accountLevel: 1,

            reputation: 0
        },

        /* =====================================================
           LEGACY DATA
           ===================================================== */

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

        prestigeLegacy: 0,

        questsLegacy: {

            kills: 0,

            mines: 0,

            killsClaimed: false,

            minesClaimed: false
        }
    };

    /* =========================================================
       GLOBAL STATE
       ========================================================= */

    window.gameData =
        cloneObject(
            DEFAULT_GAME_DATA
        );

    /* =========================================================
       LEGACY GLOBALS
       ========================================================= */

    window.playerMaxHp = 100;

    window.playerCurrentHp = 100;

    window.playerMaxMp = 100;

    window.playerCurrentMp = 100;

    window.totalDmg = 10;

    window.totalDps = 0;

    window.totalCrit = 5;

    window.totalCritDamage = 150;

    window.totalDefense = 0;

    window.totalArmor = 0;

    window.totalLifesteal = 0;

    window.totalDodge = 0;

    window.totalBlock = 0;

    window.totalMagicPower = 0;

    window.totalAttackSpeed = 1;

    window.totalGoldBonus = 0;

    window.totalExpBonus = 0;

    window.totalMagicFind = 0;

    window.totalArmorPen = 0;

    window.isDead = false;

    window.isFighting = false;

    window.autoExpedition = false;

    window.autoSkip = false;

    /* =========================================================
       INTERNAL
       ========================================================= */

    let initialized = false;

    let autosaveTimer = null;

    let playtimeTimer = null;

    let dailyTimer = null;

    let eventTimer = null;

    let saveLock = false;

    let eventListeners = {};

    /* =========================================================
       CLONE
       ========================================================= */

    function cloneObject(
        value
    ) {

        return JSON.parse(
            JSON.stringify(
                value
            )
        );
    }

    /* =========================================================
       SAFE NUMBER
       ========================================================= */

    function safeNumber(
        value,
        fallback = 0
    ) {

        const number =
            Number(value);

        if (
            Number.isFinite(
                number
            )
        ) {
            return number;
        }

        return fallback;
    }

    /* =========================================================
       SAFE INTEGER
       ========================================================= */

    function safeInteger(
        value,
        fallback = 0
    ) {

        return Math.floor(
            safeNumber(
                value,
                fallback
            )
        );
    }

    /* =========================================================
       CLAMP
       ========================================================= */

    function clamp(
        value,
        min,
        max
    ) {

        return Math.min(
            Math.max(
                value,
                min
            ),
            max
        );
    }

    /* =========================================================
       GET ELEMENT
       ========================================================= */

    function getElement(
        id
    ) {

        return document.getElementById(
            id
        );
    }

    /* =========================================================
       SET TEXT
       ========================================================= */

    function setText(
        id,
        value
    ) {

        const element =
            getElement(id);

        if (!element) {
            return;
        }

        element.textContent =
            value;
    }

    /* =========================================================
       SET HTML
       ========================================================= */

    function setHTML(
        id,
        value
    ) {

        const element =
            getElement(id);

        if (!element) {
            return;
        }

        element.innerHTML =
            value;
    }

    /* =========================================================
       SET WIDTH
       ========================================================= */

    function setWidth(
        id,
        value
    ) {

        const element =
            getElement(id);

        if (!element) {
            return;
        }

        element.style.width =
            `${clamp(
                safeNumber(
                    value,
                    0
                ),
                0,
                100
            )}%`;
    }

    /* =========================================================
       FORMAT NUMBER
       ========================================================= */

    window.formatGameNumber =
        function formatGameNumber(
            number
        ) {

            number =
                safeNumber(
                    number,
                    0
                );

            return number.toLocaleString(
                "pl-PL"
            );
        };

    /* =========================================================
       LOG
       ========================================================= */

    function log(
        message
    ) {

        if (
            typeof window.logMessage ===
            "function"
        ) {

            try {

                window.logMessage(
                    message
                );

                return;

            } catch (error) {

                console.error(
                    error
                );
            }
        }

        if (
            typeof window.addCombatLog ===
            "function"
        ) {

            try {

                window.addCombatLog(
                    message
                );

                return;

            } catch (error) {

                console.error(
                    error
                );
            }
        }

        console.log(
            message
        );
    }

    /* =========================================================
       TOAST
       ========================================================= */

    window.gameToast =
        function gameToast(
            text,
            title = "PIXEL REALMS"
        ) {

            if (
                typeof window.showToast ===
                "function"
            ) {

                try {

                    window.showToast(
                        text,
                        title
                    );

                    return;

                } catch (error) {

                    console.error(
                        error
                    );
                }
            }

            log(
                `[${title}] ${text}`
            );
        };

    /* =========================================================
       EVENT SYSTEM
       ========================================================= */

    window.onGame =
        function onGame(
            event,
            callback
        ) {

            if (
                typeof callback !==
                "function"
            ) {
                return () => {};
            }

            if (
                !eventListeners[event]
            ) {

                eventListeners[event] =
                    new Set();
            }

            eventListeners[event].add(
                callback
            );

            return () => {

                eventListeners[event]?.delete(
                    callback
                );
            };
        };

    window.emitGameEvent =
        function emitGameEvent(
            event,
            payload = {}
        ) {

            const listeners =
                eventListeners[event];

            if (!listeners) {
                return;
            }

            listeners.forEach(
                callback => {

                    try {

                        callback(
                            payload
                        );

                    } catch (error) {

                        console.error(
                            `Game event error: ${event}`,
                            error
                        );
                    }
                }
            );
        };

    /* =========================================================
       CREATE DEFAULT
       ========================================================= */

    window.createDefaultGameData =
        function createDefaultGameData() {

            return cloneObject(
                DEFAULT_GAME_DATA
            );
        };

    /* =========================================================
       DEEP MERGE
       ========================================================= */

    function deepMerge(
        target,
        source
    ) {

        if (
            !source ||
            typeof source !==
                "object"
        ) {

            return target;
        }

        Object.keys(
            source
        ).forEach(
            key => {

                const sourceValue =
                    source[key];

                const targetValue =
                    target[key];

                if (
                    sourceValue &&
                    typeof sourceValue ===
                        "object" &&
                    !Array.isArray(
                        sourceValue
                    ) &&
                    targetValue &&
                    typeof targetValue ===
                        "object" &&
                    !Array.isArray(
                        targetValue
                    )
                ) {

                    deepMerge(
                        targetValue,
                        sourceValue
                    );

                } else {

                    target[key] =
                        sourceValue;
                }
            }
        );

        return target;
    }

    /* =========================================================
       MIGRATION
       ========================================================= */

    function migrateSave(
        saved
    ) {

        let data =
            cloneObject(
                saved
            );

        const currentVersion =
            safeInteger(
                data.saveVersion,
                1
            );

        /*
         * Version 1 → 2
         */

        if (
            currentVersion < 2
        ) {

            data.currencies =
                data.currencies ||
                {};

            data.currencies.rubies =
                safeInteger(
                    data.rubies,
                    0
                );

            data.saveVersion =
                2;
        }

        /*
         * Version 2 → 3
         */

        if (
            data.saveVersion < 3
        ) {

            data.player =
                data.player ||
                {};

            data.player.level =
                safeInteger(
                    data.level,
                    1
                );

            data.player.exp =
                safeNumber(
                    data.exp,
                    0
                );

            data.player.maxExp =
                safeNumber(
                    data.maxExp,
                    100
                );

            data.saveVersion =
                3;
        }

        /*
         * Version 3 → 4
         */

        if (
            data.saveVersion < 4
        ) {

            data.combat =
                data.combat ||
                {};

            data.combat.autoBattle =
                Boolean(
                    data.autoExpedition
                );

            data.saveVersion =
                4;
        }

        /*
         * Version 4 → 5
         */

        if (
            data.saveVersion < 5
        ) {

            data.talents =
                data.talents ||
                {
                    points: 0,
                    unlocked: [],
                    levels: {},
                    activeLoadout: [],
                    passiveBonuses: {},
                    activeSkills: []
                };

            data.saveVersion =
                5;
        }

        /*
         * Version 5 → 6
         */

        if (
            data.saveVersion < 6
        ) {

            data.achievements =
                data.achievements ||
                cloneObject(
                    DEFAULT_GAME_DATA
                        .achievements
                );

            data.daily =
                data.daily ||
                cloneObject(
                    DEFAULT_GAME_DATA
                        .daily
                );

            data.saveVersion =
                6;
        }

        /*
         * Version 6 → 7
         */

        if (
            data.saveVersion < 7
        ) {

            data.world =
                data.world ||
                cloneObject(
                    DEFAULT_GAME_DATA
                        .world
                );

            data.guild =
                data.guild ||
                cloneObject(
                    DEFAULT_GAME_DATA
                        .guild
                );

            data.saveVersion =
                7;
        }

        return data;
    }

    /* =========================================================
       MERGE GAME DATA
       ========================================================= */

    function mergeGameData(
        saved
    ) {

        const defaults =
            cloneObject(
                DEFAULT_GAME_DATA
            );

        const migrated =
            migrateSave(
                saved
            );

        deepMerge(
            defaults,
            migrated
        );

        return defaults;
    }

    /* =========================================================
       LEGACY SYNC
       ========================================================= */

    function syncLegacyFieldsFromNewData() {

        const g =
            window.gameData;

        g.gold =
            safeNumber(
                g.currencies.gold,
                0
            );

        g.iron =
            safeInteger(
                g.currencies.iron,
                0
            );

        g.mithril =
            safeInteger(
                g.currencies.mithril,
                0
            );

        g.baseDmg =
            safeNumber(
                g.stats.baseDmg,
                10
            );

        g.baseDps =
            safeNumber(
                g.stats.baseDps,
                0
            );

        g.clickPower =
            safeNumber(
                g.mining.clickPower,
                1
            );

        g.pickaxeLevel =
            safeInteger(
                g.mining.pickaxeLevel,
                1
            );

        g.mercenaryLevel =
            safeInteger(
                g.mercenary.level,
                0
            );

        g.level =
            safeInteger(
                g.player.level,
                1
            );

        g.exp =
            safeNumber(
                g.player.exp,
                0
            );

        g.maxExp =
            safeNumber(
                g.player.maxExp,
                100
            );

        g.highestDungeon =
            safeInteger(
                g.combat.highestDungeon,
                1
            );

        g.skillPoints =
            safeInteger(
                g.player.skillPoints,
                0
            );

        g.prestige =
            safeInteger(
                g.prestige.level,
                0
            );

        g.quests.kills =
            safeInteger(
                g.quests.kills,
                0
            );

        g.quests.mines =
            safeInteger(
                g.quests.mines,
                0
            );
    }

    /* =========================================================
       LEGACY SYNC TO NEW
       ========================================================= */

    function syncLegacyFieldsToNewData() {

        const g =
            window.gameData;

        if (
            Number.isFinite(
                Number(g.gold)
            )
        ) {

            g.currencies.gold =
                Math.max(
                    0,
                    safeNumber(
                        g.gold,
                        g.currencies.gold
                    )
                );
        }

        if (
            Number.isFinite(
                Number(g.iron)
            )
        ) {

            g.currencies.iron =
                Math.max(
                    0,
                    safeInteger(
                        g.iron,
                        g.currencies.iron
                    )
                );
        }

        if (
            Number.isFinite(
                Number(g.mithril)
            )
        ) {

            g.currencies.mithril =
                Math.max(
                    0,
                    safeInteger(
                        g.mithril,
                        g.currencies.mithril
                    )
                );
        }
    }

    /* =========================================================
       SANITIZE
       ========================================================= */

    function sanitizeGameData() {

        const g =
            window.gameData;

        /*
         * Resources
         */

        g.currencies.gold =
            Math.max(
                0,
                safeNumber(
                    g.currencies.gold,
                    0
                )
            );

        g.currencies.iron =
            Math.max(
                0,
                safeInteger(
                    g.currencies.iron,
                    0
                )
            );

        g.currencies.mithril =
            Math.max(
                0,
                safeInteger(
                    g.currencies.mithril,
                    0
                )
            );

        g.currencies.rubies =
            Math.max(
                0,
                safeInteger(
                    g.currencies.rubies,
                    0
                )
            );

        g.currencies.crystals =
            Math.max(
                0,
                safeInteger(
                    g.currencies.crystals,
                    0
                )
            );

        g.currencies.tokens =
            Math.max(
                0,
                safeInteger(
                    g.currencies.tokens,
                    0
                )
            );

        g.currencies.dungeonKeys =
            Math.max(
                0,
                safeInteger(
                    g.currencies.dungeonKeys,
                    0
                )
            );

        g.currencies.energy =
            clamp(
                safeNumber(
                    g.currencies.energy,
                    100
                ),
                0,
                g.currencies.maxEnergy
            );

        g.currencies.maxEnergy =
            Math.max(
                1,
                safeNumber(
                    g.currencies.maxEnergy,
                    100
                )
            );

        /*
         * Stats
         */

        g.stats.baseHp =
            Math.max(
                1,
                safeNumber(
                    g.stats.baseHp,
                    100
                )
            );

        g.stats.baseDmg =
            Math.max(
                1,
                safeNumber(
                    g.stats.baseDmg,
                    10
                )
            );

        g.stats.baseDps =
            Math.max(
                0,
                safeNumber(
                    g.stats.baseDps,
                    0
                )
            );

        /*
         * Player
         */

        g.player.level =
            Math.max(
                1,
                safeInteger(
                    g.player.level,
                    1
                )
            );

        g.player.exp =
            Math.max(
                0,
                safeNumber(
                    g.player.exp,
                    0
                )
            );

        g.player.maxExp =
            Math.max(
                1,
                safeNumber(
                    g.player.maxExp,
                    100
                )
            );

        g.player.skillPoints =
            Math.max(
                0,
                safeInteger(
                    g.player.skillPoints,
                    0
                )
            );

        g.player.talentPoints =
            Math.max(
                0,
                safeInteger(
                    g.player.talentPoints,
                    0
                )
            );

        /*
         * Mining
         */

        g.mining.pickaxeLevel =
            Math.max(
                1,
                safeInteger(
                    g.mining.pickaxeLevel,
                    1
                )
            );

        g.mining.clickPower =
            Math.max(
                1,
                safeNumber(
                    g.mining.clickPower,
                    1
                )
            );

        g.mining.miningSpeed =
            Math.max(
                .1,
                safeNumber(
                    g.mining.miningSpeed,
                    1
                )
            );

        g.mining.miningLuck =
            Math.max(
                0,
                safeNumber(
                    g.mining.miningLuck,
                    0
                )
            );

        /*
         * Mercenary
         */

        g.mercenary.level =
            Math.max(
                0,
                safeInteger(
                    g.mercenary.level,
                    0
                )
            );

        g.mercenary.dps =
            Math.max(
                0,
                safeNumber(
                    g.mercenary.dps,
                    0
                )
            );

        /*
         * Skills
         */

        const skillLimits = {

            hp: 50,

            dmg: 50,

            defense: 50,

            lifesteal: 20,

            crit: 25,

            critDamage: 25,

            attackSpeed: 25,

            dodge: 25,

            block: 25,

            magic: 50,

            gold: 50,

            exp: 50,

            luck: 50
        };

        Object.keys(
            skillLimits
        ).forEach(
            key => {

                g.skills[key] =
                    clamp(
                        safeInteger(
                            g.skills[key],
                            0
                        ),
                        0,
                        skillLimits[key]
                    );
            }
        );

        /*
         * Combat
         */

        g.combat.totalKills =
            Math.max(
                0,
                safeInteger(
                    g.combat.totalKills,
                    0
                )
            );

        g.combat.totalBossKills =
            Math.max(
                0,
                safeInteger(
                    g.combat.totalBossKills,
                    0
                )
            );

        g.combat.currentWave =
            Math.max(
                1,
                safeInteger(
                    g.combat.currentWave,
                    1
                )
            );

        g.combat.highestWave =
            Math.max(
                g.combat.currentWave,
                safeInteger(
                    g.combat.highestWave,
                    1
                )
            );

        g.combat.currentDungeon =
            Math.max(
                1,
                safeInteger(
                    g.combat.currentDungeon,
                    1
                )
            );

        g.combat.highestDungeon =
            Math.max(
                1,
                safeInteger(
                    g.combat.highestDungeon,
                    1
                )
            );

        /*
         * Combat state
         */

        g.combatState.currentHp =
            Math.max(
                0,
                safeNumber(
                    g.combatState.currentHp,
                    g.stats.baseHp
                )
            );

        g.combatState.currentMp =
            Math.max(
                0,
                safeNumber(
                    g.combatState.currentMp,
                    g.combatState.maxMp
                )
            );

        /*
         * Prestige
         */

        g.prestige.level =
            Math.max(
                0,
                safeInteger(
                    g.prestige.level,
                    0
                )
            );

        g.prestige.totalPrestiges =
            Math.max(
                0,
                safeInteger(
                    g.prestige.totalPrestiges,
                    g.prestige.level
                )
            );

        /*
         * World
         */

        g.world.currentBiome =
            Math.max(
                0,
                safeInteger(
                    g.world.currentBiome,
                    0
                )
            );

        if (
            !Array.isArray(
                g.world.unlockedBiomes
            )
        ) {

            g.world.unlockedBiomes =
                [0];
        }

        if (
            !Array.isArray(
                g.world.discoveredLocations
            )
        ) {

            g.world.discoveredLocations =
                [];
        }

        /*
         * Achievements
         */

        if (
            !Array.isArray(
                g.achievements.unlocked
            )
        ) {

            g.achievements.unlocked =
                [];
        }

        /*
         * Gacha
         */

        g.gacha.totalOpens =
            Math.max(
                0,
                safeInteger(
                    g.gacha.totalOpens,
                    0
                )
            );

        g.gacha.pity =
            Math.max(
                0,
                safeInteger(
                    g.gacha.pity,
                    0
                )
            );

        g.gacha.mythicPity =
            Math.max(
                0,
                safeInteger(
                    g.gacha.mythicPity,
                    0
                )
            );

        if (
            !Array.isArray(
                g.gacha.history
            )
        ) {

            g.gacha.history =
                [];
        }

        /*
         * Daily
         */

        if (
            !g.daily.lastClaimDate
        ) {

            g.daily.lastClaimDate =
                null;
        }

        /*
         * Final legacy sync
         */

        syncLegacyFieldsFromNewData();

        g.saveVersion =
            SAVE_VERSION;
    }

    /* =========================================================
       PRESTIGE MULTIPLIER
       ========================================================= */

    window.getPrestigeMultiplier =
        function getPrestigeMultiplier() {

            const level =
                safeInteger(
                    window.gameData
                        .prestige.level,
                    0
                );

            return (
                1 +
                (
                    level *
                    .5
                )
            );
        };

    /* =========================================================
       TOTAL POWER
       ========================================================= */

    window.calculatePower =
        function calculatePower() {

            const damage =
                safeNumber(
                    window.totalDmg,
                    0
                );

            const dps =
                safeNumber(
                    window.totalDps,
                    0
                );

            const hp =
                safeNumber(
                    window.playerMaxHp,
                    0
                );

            const defense =
                safeNumber(
                    window.totalDefense,
                    0
                );

            const crit =
                safeNumber(
                    window.totalCrit,
                    0
                );

            const power =
                Math.floor(
                    (
                        damage *
                        2
                    ) +
                    (
                        dps *
                        1.5
                    ) +
                    (
                        hp *
                        .25
                    ) +
                    (
                        defense *
                        .5
                    ) +
                    (
                        crit *
                        100
                    )
                );

            window.gameData.player.power =
                Math.max(
                    0,
                    power
                );

            return power;
        };

    /* =========================================================
       EQUIPMENT BONUS
       ========================================================= */

    function getEquipmentBonuses() {

        const result = {

            damage: 0,

            dps: 0,

            hp: 0,

            defense: 0,

            magicPower: 0,

            crit: 0,

            critDamage: 0,

            lifesteal: 0,

            dodge: 0,

            block: 0,

            attackSpeed: 0,

            gold: 0,

            exp: 0,

            magicFind: 0,

            armorPen: 0
        };

        if (
            !window.equipped ||
            typeof window.equipped !==
                "object"
        ) {

            return result;
        }

        Object.values(
            window.equipped
        ).forEach(
            item => {

                if (
                    !item ||
                    typeof item !==
                        "object"
                ) {
                    return;
                }

                const level =
                    Math.max(
                        0,
                        safeInteger(
                            item.upgradeLevel,
                            item.level || 0
                        )
                    );

                const upgradeMultiplier =
                    1 +
                    (
                        level *
                        .1
                    );

                result.damage +=
                    safeNumber(
                        item.dmgBonus,
                        item.damage ||
                            0
                    ) *
                    upgradeMultiplier;

                result.dps +=
                    safeNumber(
                        item.dpsBonus,
                        item.dps ||
                            0
                    ) *
                    upgradeMultiplier;

                result.hp +=
                    safeNumber(
                        item.hpBonus,
                        item.hp ||
                            0
                    ) *
                    upgradeMultiplier;

                result.defense +=
                    safeNumber(
                        item.defenseBonus,
                        item.defense ||
                            0
                    ) *
                    upgradeMultiplier;

                result.magicPower +=
                    safeNumber(
                        item.magicPowerBonus,
                        item.magicPower ||
                            0
                    );

                result.crit +=
                    safeNumber(
                        item.critBonus,
                        0
                    );

                result.critDamage +=
                    safeNumber(
                        item.critDamageBonus,
                        0
                    );

                result.lifesteal +=
                    safeNumber(
                        item.lifestealBonus,
                        0
                    );

                result.dodge +=
                    safeNumber(
                        item.dodgeBonus,
                        0
                    );

                result.block +=
                    safeNumber(
                        item.blockBonus,
                        0
                    );

                result.attackSpeed +=
                    safeNumber(
                        item.attackSpeedBonus,
                        0
                    );

                result.gold +=
                    safeNumber(
                        item.goldBonus,
                        0
                    );

                result.exp +=
                    safeNumber(
                        item.expBonus,
                        0
                    );

                result.magicFind +=
                    safeNumber(
                        item.magicFindBonus,
                        0
                    );

                result.armorPen +=
                    safeNumber(
                        item.armorPenBonus,
                        0
                    );
            }
        );

        return result;
    }

    /* =========================================================
       TALENT BONUS
       ========================================================= */

    function getTalentBonuses() {

        const bonuses = {

            damage: 0,

            dps: 0,

            hp: 0,

            defense: 0,

            magicPower: 0,

            crit: 0,

            critDamage: 0,

            lifesteal: 0,

            dodge: 0,

            block: 0,

            attackSpeed: 0,

            gold: 0,

            exp: 0,

            magicFind: 0,

            armorPen: 0
        };

        const stored =
            window.gameData
                .talents
                .passiveBonuses;

        if (
            stored &&
            typeof stored ===
                "object"
        ) {

            Object.keys(
                bonuses
            ).forEach(
                key => {

                    bonuses[key] +=
                        safeNumber(
                            stored[key],
                            0
                        );
                }
            );
        }

        return bonuses;
    }

    /* =========================================================
       RECALCULATE PLAYER STATS
       ========================================================= */

    window.recalculatePlayerStats =
        function recalculatePlayerStats() {

            const g =
                window.gameData;

            sanitizeGameData();

            const equipment =
                getEquipmentBonuses();

            const talents =
                getTalentBonuses();

            const prestigeMultiplier =
                getPrestigeMultiplier();

            /*
             * Base
             */

            let damage =
                g.stats.baseDmg;

            let dps =
                g.stats.baseDps;

            let hp =
                g.stats.baseHp;

            let defense =
                g.stats.baseDefense;

            let magicPower =
                g.stats.baseMagicPower;

            let crit =
                g.stats.baseCrit;

            let critDamage =
                g.stats.baseCritDamage;

            let lifesteal =
                g.stats.baseLifesteal;

            let dodge =
                g.stats.baseDodge;

            let block =
                g.stats.baseBlock;

            let attackSpeed =
                g.stats.baseAttackSpeed;

            let goldBonus =
                g.stats.baseGoldBonus;

            let expBonus =
                g.stats.baseExpBonus;

            let magicFind =
                g.stats.baseMagicFind;

            let armorPen =
                g.stats.baseArmorPen;

            /*
             * Skills
             */

            damage +=
                g.skills.dmg *
                10;

            dps +=
                g.skills.dmg *
                2;

            hp +=
                g.skills.hp *
                20;

            defense +=
                g.skills.defense *
                8;

            lifesteal +=
                g.skills.lifesteal;

            crit +=
                g.skills.crit *
                2;

            critDamage +=
                g.skills.critDamage *
                4;

            attackSpeed +=
                g.skills.attackSpeed *
                .03;

            dodge +=
                g.skills.dodge;

            block +=
                g.skills.block;

            magicPower +=
                g.skills.magic *
                8;

            goldBonus +=
                g.skills.gold *
                2;

            expBonus +=
                g.skills.exp;

            magicFind +=
                g.skills.luck;

            /*
             * Mining
             */

            damage +=
                (
                    g.mining.pickaxeLevel -
                    1
                ) *
                3;

            /*
             * Mercenary
             */

            dps +=
                g.mercenary.dps;

            /*
             * Equipment
             */

            damage +=
                equipment.damage;

            dps +=
                equipment.dps;

            hp +=
                equipment.hp;

            defense +=
                equipment.defense;

            magicPower +=
                equipment.magicPower;

            crit +=
                equipment.crit;

            critDamage +=
                equipment.critDamage;

            lifesteal +=
                equipment.lifesteal;

            dodge +=
                equipment.dodge;

            block +=
                equipment.block;

            attackSpeed +=
                equipment.attackSpeed;

            goldBonus +=
                equipment.gold;

            expBonus +=
                equipment.exp;

            magicFind +=
                equipment.magicFind;

            armorPen +=
                equipment.armorPen;

            /*
             * Talent
             */

            damage +=
                talents.damage;

            dps +=
                talents.dps;

            hp +=
                talents.hp;

            defense +=
                talents.defense;

            magicPower +=
                talents.magicPower;

            crit +=
                talents.crit;

            critDamage +=
                talents.critDamage;

            lifesteal +=
                talents.lifesteal;

            dodge +=
                talents.dodge;

            block +=
                talents.block;

            attackSpeed +=
                talents.attackSpeed;

            goldBonus +=
                talents.gold;

            expBonus +=
                talents.exp;

            magicFind +=
                talents.magicFind;

            armorPen +=
                talents.armorPen;

            /*
             * Prestige
             */

            const permanentDamage =
                safeNumber(
                    g.prestige.permanentDamage,
                    0
                );

            const permanentHp =
                safeNumber(
                    g.prestige.permanentHp,
                    0
                );

            const permanentGold =
                safeNumber(
                    g.prestige.permanentGold,
                    0
                );

            const permanentExp =
                safeNumber(
                    g.prestige.permanentExp,
                    0
                );

            const permanentLuck =
                safeNumber(
                    g.prestige.permanentLuck,
                    0
                );

            damage +=
                permanentDamage;

            hp +=
                permanentHp;

            goldBonus +=
                permanentGold;

            expBonus +=
                permanentExp;

            magicFind +=
                permanentLuck;

            /*
             * Global prestige multiplier
             */

            damage *=
                prestigeMultiplier;

            dps *=
                prestigeMultiplier;

            hp *=
                prestigeMultiplier;

            defense *=
                prestigeMultiplier;

            magicPower *=
                prestigeMultiplier;

            /*
             * Final values
             */

            window.totalDmg =
                Math.max(
                    1,
                    Math.floor(
                        damage
                    )
                );

            window.totalDps =
                Math.max(
                    0,
                    Math.floor(
                        dps
                    )
                );

            window.playerMaxHp =
                Math.max(
                    1,
                    Math.floor(
                        hp
                    )
                );

            window.totalDefense =
                Math.max(
                    0,
                    Math.floor(
                        defense
                    )
                );

            window.totalArmor =
                window.totalDefense;

            window.totalMagicPower =
                Math.max(
                    0,
                    Math.floor(
                        magicPower
                    )
                );

            window.totalCrit =
                clamp(
                    Number(
                        crit.toFixed(2)
                    ),
                    0,
                    100
                );

            window.totalCritDamage =
                Math.max(
                    100,
                    Number(
                        critDamage.toFixed(2)
                    )
                );

            window.totalLifesteal =
                clamp(
                    Number(
                        lifesteal.toFixed(2)
                    ),
                    0,
                    100
                );

            window.totalDodge =
                clamp(
                    Number(
                        dodge.toFixed(2)
                    ),
                    0,
                    100
                );

            window.totalBlock =
                clamp(
                    Number(
                        block.toFixed(2)
                    ),
                    0,
                    100
                );

            window.totalAttackSpeed =
                Math.max(
                    .1,
                    Number(
                        attackSpeed.toFixed(2)
                    )
                );

            window.totalGoldBonus =
                Math.max(
                    0,
                    Number(
                        goldBonus.toFixed(2)
                    )
                );

            window.totalExpBonus =
                Math.max(
                    0,
                    Number(
                        expBonus.toFixed(2)
                    )
                );

            window.totalMagicFind =
                Math.max(
                    0,
                    Number(
                        magicFind.toFixed(2)
                    )
                );

            window.totalArmorPen =
                clamp(
                    Number(
                        armorPen.toFixed(2)
                    ),
                    0,
                    100
                );

            /*
             * HP / MP
             */

            if (
                !Number.isFinite(
                    window.playerCurrentHp
                )
            ) {

                window.playerCurrentHp =
                    window.playerMaxHp;
            }

            if (
                !Number.isFinite(
                    window.playerCurrentMp
                )
            ) {

                window.playerCurrentMp =
                    window.playerMaxMp;
            }

            window.playerCurrentHp =
                clamp(
                    window.playerCurrentHp,
                    0,
                    window.playerMaxHp
                );

            window.playerMaxMp =
                Math.max(
                    100,
                    100 +
                    (
                        g.skills.magic *
                        15
                    ) +
                    (
                        window.totalMagicPower *
                        .1
                    )
                );

            window.playerCurrentMp =
                clamp(
                    window.playerCurrentMp,
                    0,
                    window.playerMaxMp
                );

            calculatePower();

            syncLegacyFieldsFromNewData();

            updateCombatStatsUI();
            updateCharacterStatsUI();
            updateStatusUI();

            window.emitGameEvent(
                "statsChanged",
                {
                    damage:
                        window.totalDmg,

                    dps:
                        window.totalDps,

                    hp:
                        window.playerMaxHp,

                    defense:
                        window.totalDefense,

                    crit:
                        window.totalCrit,

                    critDamage:
                        window.totalCritDamage,

                    lifesteal:
                        window.totalLifesteal
                }
            );

            return {

                damage:
                    window.totalDmg,

                dps:
                    window.totalDps,

                hp:
                    window.playerMaxHp,

                defense:
                    window.totalDefense,

                magicPower:
                    window.totalMagicPower,

                crit:
                    window.totalCrit,

                critDamage:
                    window.totalCritDamage,

                lifesteal:
                    window.totalLifesteal,

                dodge:
                    window.totalDodge,

                block:
                    window.totalBlock,

                attackSpeed:
                    window.totalAttackSpeed,

                goldBonus:
                    window.totalGoldBonus,

                expBonus:
                    window.totalExpBonus,

                magicFind:
                    window.totalMagicFind,

                armorPen:
                    window.totalArmorPen
            };
        };

    /* =========================================================
       UI STATUS
       ========================================================= */

    window.updateStatusUI =
        function updateStatusUI() {

            const g =
                window.gameData;

            syncLegacyFieldsFromNewData();

            /*
             * New resource IDs
             */

            setText(
                "gold-value",
                formatGameNumber(
                    g.currencies.gold
                )
            );

            setText(
                "iron-value",
                formatGameNumber(
                    g.currencies.iron
                )
            );

            setText(
                "mithril-value",
                formatGameNumber(
                    g.currencies.mithril
                )
            );

            setText(
                "ruby-value",
                formatGameNumber(
                    g.currencies.rubies
                )
            );

            /*
             * Legacy IDs
             */

            setText(
                "gold-amount",
                formatGameNumber(
                    g.currencies.gold
                )
            );

            setText(
                "iron-amount",
                formatGameNumber(
                    g.currencies.iron
                )
            );

            setText(
                "mithril-amount",
                formatGameNumber(
                    g.currencies.mithril
                )
            );

            /*
             * Level
             */

            setText(
                "player-level",
                g.player.level
            );

            setText(
                "level-value",
                g.player.level
            );

            /*
             * XP
             */

            setText(
                "player-exp",
                Math.floor(
                    g.player.exp
                )
            );

            setText(
                "player-max-exp",
                Math.floor(
                    g.player.maxExp
                )
            );

            setWidth(
                "exp-bar",
                (
                    g.player.exp /
                    Math.max(
                        1,
                        g.player.maxExp
                    )
                ) *
                100
            );

            /*
             * HP
             */

            setWidth(
                "player-hp-bar",
                (
                    window.playerCurrentHp /
                    Math.max(
                        1,
                        window.playerMaxHp
                    )
                ) *
                100
            );

            setText(
                "player-hp-text",
                `${formatGameNumber(
                    window.playerCurrentHp
                )} / ${formatGameNumber(
                    window.playerMaxHp
                )}`
            );

            /*
             * MP
             */

            setWidth(
                "player-mp-bar",
                (
                    window.playerCurrentMp /
                    Math.max(
                        1,
                        window.playerMaxMp
                    )
                ) *
                100
            );

            setText(
                "player-mp-text",
                `${formatGameNumber(
                    window.playerCurrentMp
                )} / ${formatGameNumber(
                    window.playerMaxMp
                )}`
            );

            /*
             * Energy
             */

            setText(
                "energy-value",
                `${Math.floor(
                    g.currencies.energy
                )} / ${Math.floor(
                    g.currencies.maxEnergy
                )}`
            );

            /*
             * Power
             */

            setText(
                "power-value",
                formatGameNumber(
                    g.player.power
                )
            );

            updateCombatStatsUI();
        };

    /* =========================================================
       COMBAT STATS UI
       ========================================================= */

    function updateCombatStatsUI() {

        setText(
            "combat-dmg",
            formatGameNumber(
                window.totalDmg
            )
        );

        setText(
            "combat-dps",
            formatGameNumber(
                window.totalDps
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
            "combat-crit-damage",
            `${Number(
                safeNumber(
                    window.totalCritDamage,
                    150
                ).toFixed(1)
            )}%`
        );

        setText(
            "combat-defense",
            formatGameNumber(
                window.totalDefense
            )
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

        setText(
            "combat-dodge",
            `${Number(
                safeNumber(
                    window.totalDodge,
                    0
                ).toFixed(1)
            )}%`
        );

        setText(
            "combat-block",
            `${Number(
                safeNumber(
                    window.totalBlock,
                    0
                ).toFixed(1)
            )}%`
        );

        setText(
            "combat-power",
            formatGameNumber(
                window.gameData.player.power
            )
        );
    }

    /* =========================================================
       CHARACTER STATS
       ========================================================= */

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
                    ${formatGameNumber(
                        window.playerMaxHp
                    )}
                </strong>
            </div>

            <div>
                <span class="muted">
                    ⚔ DMG
                </span>

                <strong class="text-red">
                    ${formatGameNumber(
                        window.totalDmg
                    )}
                </strong>
            </div>

            <div>
                <span class="muted">
                    ⚡ DPS
                </span>

                <strong class="text-blue">
                    ${formatGameNumber(
                        window.totalDps
                    )}
                </strong>
            </div>

            <div>
                <span class="muted">
                    🛡 DEF
                </span>

                <strong class="text-cyan">
                    ${formatGameNumber(
                        window.totalDefense
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
                    ☠ KRYT DMG
                </span>

                <strong class="text-red">
                    ${Number(
                        window.totalCritDamage.toFixed(1)
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
                    💨 DODGE
                </span>

                <strong class="text-blue">
                    ${Number(
                        window.totalDodge.toFixed(1)
                    )}%
                </strong>
            </div>

            <div>
                <span class="muted">
                    🪙 GOLD
                </span>

                <strong class="text-gold">
                    +${Number(
                        window.totalGoldBonus.toFixed(1)
                    )}%
                </strong>
            </div>

            <div>
                <span class="muted">
                    ✨ EXP
                </span>

                <strong class="text-purple">
                    +${Number(
                        window.totalExpBonus.toFixed(1)
                    )}%
                </strong>
            </div>

            <div>
                <span class="muted">
                    💎 MAGIC FIND
                </span>

                <strong class="text-cyan">
                    +${Number(
                        window.totalMagicFind.toFixed(1)
                    )}%
                </strong>
            </div>

            <div>
                <span class="muted">
                    ✦ PRESTIŻ
                </span>

                <strong class="text-purple">
                    +${(
                        window.gameData.prestige.level *
                        50
                    )}%
                </strong>
            </div>
        `;
    }

    /* =========================================================
       OPEN SCREEN
       ========================================================= */

    window.openTab =
        function openTab(
            screenId,
            button
        ) {

            document
                .querySelectorAll(
                    ".screen, .game-screen"
                )
                .forEach(
                    screen => {

                        screen.classList.remove(
                            "active"
                        );
                    }
                );

            const target =
                getElement(
                    screenId
                );

            if (target) {

                target.classList.add(
                    "active"
                );
            }

            document
                .querySelectorAll(
                    ".menu-btn"
                )
                .forEach(
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

                const fallback =
                    document.querySelector(
                        `.menu-btn[onclick*="${screenId}"]`
                    );

                if (fallback) {

                    fallback.classList.add(
                        "active"
                    );
                }
            }

            window.isFighting =
                (
                    (
                        screenId ===
                        "screen-world"
                    ) ||
                    (
                        screenId ===
                        "world"
                    )
                ) &&
                !window.isDead;

            window.emitGameEvent(
                "screenChanged",
                {
                    screenId
                }
            );
        };

    /* =========================================================
       SAVE GAME
       ========================================================= */

    window.saveGame =
        function saveGame(
            force = false
        ) {

            if (
                saveLock &&
                !force
            ) {

                return false;
            }

            saveLock =
                true;

            try {

                syncLegacyFieldsToNewData();

                sanitizeGameData();

                window.gameData
                    .lastSavedAt =
                    Date.now();

                window.gameData
                    .lastOnlineAt =
                    Date.now();

                window.gameData
                    .playTime =
                    Math.max(
                        0,
                        safeInteger(
                            window.gameData.playTime,
                            0
                        )
                    );

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        window.gameData
                    )
                );

                /*
                 * Inventory
                 */

                if (
                    typeof window.saveInventory ===
                    "function"
                ) {

                    try {

                        window.saveInventory();

                    } catch (error) {

                        console.error(
                            "Inventory save error:",
                            error
                        );
                    }
                }

                /*
                 * Combat
                 */

                if (
                    typeof window.saveCombat ===
                    "function"
                ) {

                    try {

                        window.saveCombat();

                    } catch (error) {

                        console.error(
                            "Combat save error:",
                            error
                        );
                    }
                }

                /*
                 * Gacha
                 */

                if (
                    typeof window.saveGacha ===
                    "function"
                ) {

                    try {

                        window.saveGacha();

                    } catch (error) {

                        console.error(
                            "Gacha save error:",
                            error
                        );
                    }
                }

                window.emitGameEvent(
                    "gameSaved",
                    {
                        timestamp:
                            Date.now()
                    }
                );

                return true;

            } catch (error) {

                console.error(
                    "Pixel Realms save error:",
                    error
                );

                return false;

            } finally {

                saveLock =
                    false;
            }
        };

    /* =========================================================
       LOAD GAME
       ========================================================= */

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

                    /*
                     * Compatibility
                     * with old save key.
                     */

                    const oldSave =
                        localStorage.getItem(
                            "pixel_realms_save_v1"
                        );

                    if (oldSave) {

                        const parsedOld =
                            JSON.parse(
                                oldSave
                            );

                        window.gameData =
                            mergeGameData(
                                parsedOld
                            );

                        gameToast(
                            "Stary zapis został automatycznie zmigrowany.",
                            "SYSTEM"
                        );

                    } else {

                        window.gameData =
                            cloneObject(
                                DEFAULT_GAME_DATA
                            );
                    }
                }

            } catch (error) {

                console.error(
                    "Pixel Realms load error:",
                    error
                );

                window.gameData =
                    cloneObject(
                        DEFAULT_GAME_DATA
                    );

                log(
                    "⚠️ Nie udało się wczytać zapisu. Utworzono nową postać."
                );
            }

            sanitizeGameData();

            /*
             * Inventory
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
             * Combat
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
             * Gacha
             */

            if (
                typeof window.loadGacha ===
                "function"
            ) {

                try {

                    window.loadGacha();

                } catch (error) {

                    console.error(
                        "Gacha load error:",
                        error
                    );
                }
            }

            /*
             * Recalculate
             */

            recalculatePlayerStats();

            /*
             * Restore HP safely
             */

            window.playerCurrentHp =
                clamp(
                    safeNumber(
                        window.gameData
                            .combatState
                            .currentHp,
                        window.playerMaxHp
                    ),
                    0,
                    window.playerMaxHp
                );

            window.playerCurrentMp =
                clamp(
                    safeNumber(
                        window.gameData
                            .combatState
                            .currentMp,
                        window.playerMaxMp
                    ),
                    0,
                    window.playerMaxMp
                );

            window.isDead =
                Boolean(
                    window.gameData
                        .combatState
                        .dead
                );

            window.isFighting =
                !window.isDead;

            updateAllUI();

            window.emitGameEvent(
                "gameLoaded",
                {
                    version:
                        CORE_VERSION
                }
            );

            return true;
        };

    /* =========================================================
       EXP
       ========================================================= */

    window.gainExp =
        function gainExp(
            amount,
            source = "unknown"
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

            const multiplier =
                1 +
                (
                    window.totalExpBonus /
                    100
                );

            const finalExp =
                Math.floor(
                    amount *
                    multiplier
                );

            g.player.exp +=
                finalExp;

            g.quests =
                g.quests ||
                {};

            let levelsGained =
                0;

            while (
                g.player.exp >=
                g.player.maxExp
            ) {

                g.player.exp -=
                    g.player.maxExp;

                g.player.level++;

                levelsGained++;

                g.player.skillPoints +=
                    2;

                g.player.talentPoints +=
                    1;

                g.player.maxExp =
                    Math.floor(
                        g.player.maxExp *
                        1.5
                    );

                recalculatePlayerStats();

                window.playerCurrentHp =
                    window.playerMaxHp;

                window.playerCurrentMp =
                    window.playerMaxMp;

                emitGameEvent(
                    "levelUp",
                    {
                        level:
                            g.player.level
                    }
                );

                gameToast(
                    `Awansowałeś na poziom ${g.player.level}! +2 punkty umiejętności +1 punkt talentu.`,
                    "LEVEL UP"
                );

                log(
                    `⚡ AWANS! Poziom ${g.player.level}.`
                );
            }

            setText(
                "skill-points",
                g.player.skillPoints
            );

            updateStatusUI();

            if (
                levelsGained > 0
            ) {

                saveGame();
            }

            emitGameEvent(
                "experienceGained",
                {
                    amount:
                        finalExp,

                    source,

                    levelsGained
                }
            );

            return finalExp;
        };

    /* =========================================================
       ADD CURRENCY
       ========================================================= */

    window.addCurrency =
        function addCurrency(
            type,
            amount,
            source = "unknown"
        ) {

            amount =
                safeNumber(
                    amount,
                    0
                );

            if (
                amount === 0
            ) {
                return 0;
            }

            const currencies =
                window.gameData
                    .currencies;

            if (
                !Object.prototype.hasOwnProperty.call(
                    currencies,
                    type
                )
            ) {

                return 0;
            }

            currencies[type] =
                Math.max(
                    0,
                    safeNumber(
                        currencies[type],
                        0
                    ) +
                    amount
                );

            syncLegacyFieldsFromNewData();

            updateStatusUI();

            emitGameEvent(
                "currencyChanged",
                {
                    type,
                    amount,
                    value:
                        currencies[type],
                    source
                }
            );

            return amount;
        };

    /* =========================================================
       REMOVE CURRENCY
       ========================================================= */

    window.removeCurrency =
        function removeCurrency(
            type,
            amount,
            source = "unknown"
        ) {

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        0
                    )
                );

            const currencies =
                window.gameData
                    .currencies;

            if (
                !Object.prototype.hasOwnProperty.call(
                    currencies,
                    type
                )
            ) {

                return false;
            }

            if (
                currencies[type] <
                amount
            ) {

                return false;
            }

            currencies[type] -=
                amount;

            syncLegacyFieldsFromNewData();

            updateStatusUI();

            emitGameEvent(
                "currencySpent",
                {
                    type,
                    amount,
                    value:
                        currencies[type],
                    source
                }
            );

            return true;
        };

    /* =========================================================
       ENERGY
       ========================================================= */

    window.useEnergy =
        function useEnergy(
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

            return removeCurrency(
                "energy",
                amount,
                "energy"
            );
        };

    window.restoreEnergy =
        function restoreEnergy(
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

            const max =
                window.gameData
                    .currencies
                    .maxEnergy;

            const current =
                window.gameData
                    .currencies
                    .energy;

            window.gameData
                .currencies
                .energy =
                Math.min(
                    max,
                    current +
                    amount
                );

            updateStatusUI();
        };

    /* =========================================================
       MINING
       ========================================================= */

    window.mineGold =
        function mineGold() {

            const g =
                window.gameData;

            const power =
                Math.max(
                    1,
                    Math.floor(
                        g.mining.clickPower
                    )
                );

            const luck =
                Math.max(
                    0,
                    g.mining.miningLuck
                );

            const random =
                Math.floor(
                    Math.random() *
                    (
                        1 +
                        g.mining.pickaxeLevel *
                        2
                    )
                );

            const gold =
                Math.max(
                    1,
                    (
                        power +
                        random
                    ) *
                    g.mining.oreMultiplier
                );

            const goldWithBonus =
                Math.floor(
                    gold *
                    (
                        1 +
                        window.totalGoldBonus /
                        100
                    )
                );

            addCurrency(
                "gold",
                goldWithBonus,
                "mining"
            );

            g.quests.mines++;

            g.daily.miningCompleted =
                true;

            /*
             * Iron
             */

            const ironChance =
                Math.min(
                    .75,
                    .05 +
                    (
                        g.mining.pickaxeLevel *
                        .012
                    ) +
                    (
                        luck *
                        .002
                    )
                );

            if (
                Math.random() <
                ironChance
            ) {

                const iron =
                    Math.max(
                        1,
                        Math.floor(
                            1 +
                            Math.random() *
                            3
                        )
                    );

                addCurrency(
                    "iron",
                    iron,
                    "mining"
                );

                log(
                    `🔩 Wydobyto ${iron} Żelaza.`
                );
            }

            /*
             * Mithril
             */

            const mithrilChance =
                Math.min(
                    .35,
                    .01 +
                    (
                        g.mining.pickaxeLevel *
                        .0025
                    ) +
                    (
                        luck *
                        .001
                    )
                );

            if (
                Math.random() <
                mithrilChance
            ) {

                const mithril =
                    Math.max(
                        1,
                        Math.floor(
                            1 +
                            Math.random() *
                            2
                        )
                    );

                addCurrency(
                    "mithril",
                    mithril,
                    "mining"
                );

                log(
                    `💎 Wydobyto ${mithril} Mithrilu.`
                );
            }

            /*
             * EXP
             */

            gainExp(
                Math.floor(
                    2 +
                    g.mining.pickaxeLevel *
                    1.5
                ),
                "mining"
            );

            updateQuestsUI();

            emitGameEvent(
                "mined",
                {
                    gold:
                        goldWithBonus
                }
            );

            return goldWithBonus;
        };

    /* =========================================================
       SHOP UPGRADE
       ========================================================= */

    window.buyUpgrade =
        function buyUpgrade(
            type
        ) {

            const g =
                window.gameData;

            if (
                type ===
                "pickaxe"
            ) {

                const cost =
                    100 *
                    g.mining.pickaxeLevel;

                if (
                    g.currencies.gold <
                    cost
                ) {

                    gameToast(
                        `Potrzebujesz ${formatGameNumber(cost)} złota.`,
                        "KUŹNIA"
                    );

                    return false;
                }

                removeCurrency(
                    "gold",
                    cost,
                    "pickaxe"
                );

                g.mining.pickaxeLevel++;

                g.mining.clickPower +=
                    3;

                g.mining.oreMultiplier +=
                    .04;

                recalculatePlayerStats();

                saveGame();

                log(
                    `⛏️ Kilof ulepszony do poziomu ${g.mining.pickaxeLevel}.`
                );

                return true;
            }

            if (
                type ===
                "mercenary"
            ) {

                const level =
                    g.mercenary.level;

                const cost =
                    500 *
                    (
                        level +
                        1
                    );

                if (
                    g.currencies.gold <
                    cost
                ) {

                    gameToast(
                        `Potrzebujesz ${formatGameNumber(cost)} złota.`,
                        "NAJEMNIK"
                    );

                    return false;
                }

                removeCurrency(
                    "gold",
                    cost,
                    "mercenary"
                );

                g.mercenary.level++;

                g.mercenary.unlocked =
                    true;

                g.mercenary.dps +=
                    15;

                recalculatePlayerStats();

                saveGame();

                log(
                    `🤖 Najemnik LV.${g.mercenary.level}. +15 DPS.`
                );

                return true;
            }

            if (
                type ===
                "heal"
            ) {

                const cost =
                    200;

                if (
                    g.currencies.gold <
                    cost
                ) {

                    return false;
                }

                if (
                    window.playerCurrentHp >=
                    window.playerMaxHp
                ) {

                    return false;
                }

                removeCurrency(
                    "gold",
                    cost,
                    "heal"
                );

                healPlayer(
                    Math.floor(
                        window.playerMaxHp *
                        .5
                    )
                );

                saveGame();

                return true;
            }

            return false;
        };

    window.updateShopUI =
        function updateShopUI() {

            const g =
                window.gameData;

            setText(
                "pickaxe-level",
                g.mining.pickaxeLevel
            );

            setText(
                "mercenary-level",
                g.mercenary.level
            );

            setText(
                "cost-pickaxe",
                formatGameNumber(
                    100 *
                    g.mining.pickaxeLevel
                )
            );

            setText(
                "cost-merc",
                formatGameNumber(
                    500 *
                    (
                        g.mercenary.level +
                        1
                    )
                )
            );
        };

    /* =========================================================
       HP
       ========================================================= */

    window.healPlayer =
        function healPlayer(
            amount,
            source = "heal"
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

            window.gameData.combat
                .totalHealing +=
                healed;

            window.gameData.combatState
                .currentHp =
                window.playerCurrentHp;

            updateStatusUI();

            emitGameEvent(
                "playerHealed",
                {
                    amount:
                        healed,
                    source
                }
            );

            return healed;
        };

    /* =========================================================
       DAMAGE PLAYER
       ========================================================= */

    window.damagePlayer =
        function damagePlayer(
            amount,
            source = "enemy"
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

            /*
             * Dodge
             */

            if (
                Math.random() <
                window.totalDodge /
                100
            ) {

                log(
                    "💨 UNIK! Nie otrzymałeś obrażeń."
                );

                emitGameEvent(
                    "playerDodged",
                    {
                        source
                    }
                );

                return false;
            }

            /*
             * Block
             */

            if (
                Math.random() <
                window.totalBlock /
                100
            ) {

                amount *=
                    .5;

                amount =
                    Math.max(
                        1,
                        Math.floor(
                            amount
                        )
                    );

                log(
                    `🛡️ BLOK! Otrzymałeś tylko ${formatGameNumber(amount)} obrażeń.`
                );
            }

            /*
             * Defense
             */

            const reduction =
                Math.min(
                    .85,
                    window.totalDefense /
                    (
                        window.totalDefense +
                        100
                    )
                );

            amount =
                Math.max(
                    1,
                    Math.floor(
                        amount *
                        (
                            1 -
                            reduction
                        )
                    )
                );

            window.playerCurrentHp -=
                amount;

            window.gameData.combatState
                .currentHp =
                window.playerCurrentHp;

            window.gameData.combatState
                .lastHitAt =
                Date.now();

            emitGameEvent(
                "playerDamaged",
                {
                    amount,
                    source,
                    hp:
                        window.playerCurrentHp
                }
            );

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

    /* =========================================================
       DEATH
       ========================================================= */

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

            window.gameData
                .combatState
                .dead =
                true;

            window.gameData
                .combat
                .totalDeaths++;

            /*
             * Gold penalty
             */

            const goldLoss =
                Math.floor(
                    window.gameData
                        .currencies
                        .gold *
                    .2
                );

            removeCurrency(
                "gold",
                goldLoss,
                "death"
            );

            /*
             * Stop auto
             */

            if (
                window.autoExpedition
            ) {

                window.autoExpedition =
                    false;

                updateAutoUI();
            }

            emitGameEvent(
                "playerDied",
                {
                    goldLoss
                }
            );

            log(
                `<span style="color:var(--red);">☠ ZGINĄŁEŚ! Strata ${formatGameNumber(goldLoss)} 🪙.</span>`
            );

            gameToast(
                `Straciłeś ${formatGameNumber(goldLoss)} złota.`,
                "ŚMIERĆ"
            );

            updateStatusUI();

            saveGame();
        };

    /* =========================================================
       RESUME
       ========================================================= */

    window.resumeExpedition =
        function resumeExpedition() {

            window.isDead =
                false;

            window.gameData
                .combatState
                .dead =
                false;

            window.playerCurrentHp =
                window.playerMaxHp;

            window.playerCurrentMp =
                window.playerMaxMp;

            window.isFighting =
                true;

            emitGameEvent(
                "playerRevived"
            );

            log(
                "🟢 Powróciłeś do walki."
            );

            updateStatusUI();

            if (
                typeof window.spawnMonster ===
                "function"
            ) {

                try {

                    window.spawnMonster();

                } catch (error) {

                    console.error(
                        error
                    );
                }
            }
        };

    /* =========================================================
       AUTO EXPEDITION
       ========================================================= */

    window.toggleAutoExpedition =
        function toggleAutoExpedition() {

            if (
                window.isDead
            ) {

                gameToast(
                    "Nie możesz uruchomić AUTO po śmierci.",
                    "AUTO"
                );

                return false;
            }

            window.autoExpedition =
                !window.autoExpedition;

            window.gameData.combat
                .autoBattle =
                window.autoExpedition;

            window.isFighting =
                window.autoExpedition;

            updateAutoUI();

            emitGameEvent(
                "autoBattleChanged",
                {
                    enabled:
                        window.autoExpedition
                }
            );

            if (
                window.autoExpedition
            ) {

                log(
                    "🤖 <span class='text-green'>AUTO BATTLE AKTYWNE.</span>"
                );

            } else {

                log(
                    "⏸ AUTO BATTLE ZATRZYMANE."
                );
            }

            return window.autoExpedition;
        };

    /* =========================================================
       AUTO SKIP
       ========================================================= */

    window.toggleAutoSkip =
        function toggleAutoSkip() {

            window.autoSkip =
                !window.autoSkip;

            window.gameData.combat
                .autoSkip =
                window.autoSkip;

            updateAutoSkipUI();

            emitGameEvent(
                "autoSkipChanged",
                {
                    enabled:
                        window.autoSkip
                }
            );

            return window.autoSkip;
        };

    /* =========================================================
       AUTO LOOT
       ========================================================= */

    window.toggleAutoLoot =
        function toggleAutoLoot() {

            window.gameData.combat
                .autoLoot =
                !window.gameData.combat
                    .autoLoot;

            gameToast(
                window.gameData.combat
                    .autoLoot
                    ? "Auto Loot aktywny."
                    : "Auto Loot wyłączony.",
                "AUTO LOOT"
            );

            saveGame();

            return window.gameData.combat
                .autoLoot;
        };

    /* =========================================================
       AUTO UI
       ========================================================= */

    function updateAutoUI() {

        const button =
            getElement(
                "auto-toggle"
            );

        const status =
            getElement(
                "auto-status"
            );

        if (
            button
        ) {

            button.textContent =
                window.autoExpedition
                    ? "■ WYŁĄCZ AUTO"
                    : "▶ WŁĄCZ AUTO";
        }

        if (
            status
        ) {

            status.textContent =
                window.autoExpedition
                    ? "ON"
                    : "OFF";

            status.className =
                window.autoExpedition
                    ? "status-on"
                    : "status-off";
        }
    }

    function updateAutoSkipUI() {

        document
            .querySelectorAll(
                "[data-auto-skip]"
            )
            .forEach(
                button => {

                    button.textContent =
                        window.autoSkip
                            ? "⏩ SKIP: ON"
                            : "⏩ SKIP: OFF";
                }
            );
    }

    /* =========================================================
       SKILL SYSTEM
       ========================================================= */

    window.upgradeSkill =
        function upgradeSkill(
            type
        ) {

            const g =
                window.gameData;

            if (
                !Object.prototype.hasOwnProperty.call(
                    g.skills,
                    type
                )
            ) {

                return false;
            }

            const limits = {

                hp: 50,

                dmg: 50,

                defense: 50,

                lifesteal: 20,

                crit: 25,

                critDamage: 25,

                attackSpeed: 25,

                dodge: 25,

                block: 25,

                magic: 50,

                gold: 50,

                exp: 50,

                luck: 50
            };

            const limit =
                limits[type] ??
                50;

            if (
                g.player.skillPoints <=
                0
            ) {

                gameToast(
                    "Brak punktów umiejętności.",
                    "SKILLE"
                );

                return false;
            }

            if (
                g.skills[type] >=
                limit
            ) {

                gameToast(
                    "Osiągnięto maksymalny poziom.",
                    "SKILLE"
                );

                return false;
            }

            g.skills[type]++;

            g.player.skillPoints--;

            recalculatePlayerStats();

            updateSkillsUI();

            saveGame();

            gameToast(
                `${getSkillName(type)} → ${g.skills[type]}/${limit}`,
                "SKILL UPGRADE"
            );

            emitGameEvent(
                "skillUpgraded",
                {
                    skill:
                        type,

                    level:
                        g.skills[type]
                }
            );

            return true;
        };

    function getSkillName(
        type
    ) {

        const names = {

            hp: "Witalność",

            dmg: "Furia",

            defense: "Pancerz",

            lifesteal: "Wampiryzm",

            crit: "Precyzja",

            critDamage: "Morderczy Cios",

            attackSpeed: "Szybkość",

            dodge: "Unik",

            block: "Blok",

            magic: "Arcana",

            gold: "Chciwość",

            exp: "Wiedza",

            luck: "Szczęście"
        };

        return (
            names[type] ||
            type
        );
    }

    function updateSkillsUI() {

        const g =
            window.gameData;

        setText(
            "skill-points",
            g.player.skillPoints
        );

        Object.keys(
            g.skills
        ).forEach(
            skill => {

                setText(
                    `skill-lvl-${skill}`,
                    g.skills[skill]
                );
            }
        );
    }

    /* =========================================================
       TALENTS
       ========================================================= */

    window.unlockTalent =
        function unlockTalent(
            id,
            cost = 1
        ) {

            const g =
                window.gameData;

            cost =
                Math.max(
                    1,
                    safeInteger(
                        cost,
                        1
                    )
                );

            if (
                g.player.talentPoints <
                cost
            ) {

                return false;
            }

            if (
                g.talents.unlocked.includes(
                    id
                )
            ) {

                return false;
            }

            g.player.talentPoints -=
                cost;

            g.talents.unlocked.push(
                id
            );

            g.talents.levels[id] =
                1;

            log(
                `✨ Talent odblokowany: ${id}.`
            );

            gameToast(
                `Talent ${id} został odblokowany.`,
                "TALENT"
            );

            recalculatePlayerStats();

            saveGame();

            emitGameEvent(
                "talentUnlocked",
                {
                    id
                }
            );

            return true;
        };

    /* =========================================================
       QUESTS
       ========================================================= */

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

            setText(
                "q-bosses",
                q.bosses
            );

            setText(
                "q-dungeons",
                q.dungeons
            );

            setText(
                "q-chests",
                q.chests
            );

            const killButton =
                getElement(
                    "btn-q-kills"
                );

            if (
                killButton
            ) {

                if (
                    q.killsClaimed
                ) {

                    killButton.disabled =
                        true;

                    killButton.textContent =
                        "✓ UKOŃCZONE";

                } else if (
                    q.kills >=
                    10
                ) {

                    killButton.disabled =
                        false;

                    killButton.textContent =
                        "ODBIERZ 1,000 🪙";

                } else {

                    killButton.disabled =
                        true;
                }
            }

            const mineButton =
                getElement(
                    "btn-q-mines"
                );

            if (
                mineButton
            ) {

                if (
                    q.minesClaimed
                ) {

                    mineButton.disabled =
                        true;

                    mineButton.textContent =
                        "✓ UKOŃCZONE";

                } else if (
                    q.mines >=
                    50
                ) {

                    mineButton.disabled =
                        false;

                    mineButton.textContent =
                        "ODBIERZ 5 💎";

                } else {

                    mineButton.disabled =
                        true;
                }
            }

            const bossButton =
                getElement(
                    "btn-q-boss"
                );

            if (
                bossButton
            ) {

                if (
                    q.bossClaimed
                ) {

                    bossButton.disabled =
                        true;

                    bossButton.textContent =
                        "✓ UKOŃCZONE";

                } else if (
                    q.bosses >=
                    5
                ) {

                    bossButton.disabled =
                        false;

                } else {

                    bossButton.disabled =
                        true;
                }
            }

            setText(
                "prestige-tokens",
                window.gameData
                    .prestige.level
            );

            setText(
                "prestige-multiplier",
                (
                    (
                        getPrestigeMultiplier() -
                        1
                    ) *
                    100
                ).toFixed(0)
            );
        };

    /* =========================================================
       QUEST PROGRESS
       ========================================================= */

    window.incrementQuest =
        function incrementQuest(
            type,
            amount = 1
        ) {

            const q =
                window.gameData.quests;

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        0
                    )
                );

            if (
                !Object.prototype.hasOwnProperty.call(
                    q,
                    type
                )
            ) {

                return;
            }

            q[type] =
                safeNumber(
                    q[type],
                    0
                ) +
                amount;

            updateQuestsUI();

            emitGameEvent(
                "questProgress",
                {
                    type,
                    amount,
                    current:
                        q[type]
                }
            );
        };

    /* =========================================================
       CLAIM QUEST
       ========================================================= */

    window.claimQuest =
        function claimQuest(
            type
        ) {

            const q =
                window.gameData.quests;

            if (
                type ===
                "kills"
            ) {

                if (
                    q.kills <
                    10 ||
                    q.killsClaimed
                ) {

                    return false;
                }

                q.killsClaimed =
                    true;

                addCurrency(
                    "gold",
                    1000,
                    "quest"
                );

                gainExp(
                    500,
                    "quest"
                );

                log(
                    "📜 POGROMCA BESTII ukończony! +1,000 🪙."
                );
            }

            if (
                type ===
                "mines"
            ) {

                if (
                    q.mines <
                    50 ||
                    q.minesClaimed
                ) {

                    return false;
                }

                q.minesClaimed =
                    true;

                addCurrency(
                    "mithril",
                    5,
                    "quest"
                );

                gainExp(
                    1000,
                    "quest"
                );

                log(
                    "📜 GÓRNIK PRZODOWY ukończony! +5 💎."
                );
            }

            if (
                type ===
                "boss"
            ) {

                if (
                    q.bosses <
                    5 ||
                    q.bossClaimed
                ) {

                    return false;
                }

                q.bossClaimed =
                    true;

                addCurrency(
                    "rubies",
                    10,
                    "quest"
                );

                gainExp(
                    2500,
                    "quest"
                );

                log(
                    "📜 ŁOWCA BOSSÓW ukończony! +10 🩸."
                );
            }

            updateQuestsUI();

            updateStatusUI();

            saveGame();

            return true;
        };

    /* =========================================================
       ACHIEVEMENTS
       ========================================================= */

    const ACHIEVEMENTS = [

        {
            id: "first_kill",
            title: "Pierwsza Krew",
            description:
                "Pokonaj pierwszego przeciwnika.",
            requirement:
                data =>
                    data.combat.totalKills >=
                    1,
            reward:
                {
                    gold: 500,
                    points: 5
                }
        },

        {
            id: "monster_hunter",
            title: "Łowca Bestii",
            description:
                "Pokonaj 100 przeciwników.",
            requirement:
                data =>
                    data.combat.totalKills >=
                    100,
            reward:
                {
                    gold: 5000,
                    points: 10
                }
        },

        {
            id: "boss_slayer",
            title: "Pogromca Bossów",
            description:
                "Pokonaj 10 bossów.",
            requirement:
                data =>
                    data.combat.totalBossKills >=
                    10,
            reward:
                {
                    rubies: 20,
                    points: 20
                }
        },

        {
            id: "million_damage",
            title: "Maszyna Zniszczenia",
            description:
                "Zadaj 1,000,000 obrażeń.",
            requirement:
                data =>
                    data.combat.totalDamage >=
                    1000000,
            reward:
                {
                    mithril: 25,
                    points: 25
                }
        }
    ];

    window.checkAchievements =
        function checkAchievements() {

            const g =
                window.gameData;

            ACHIEVEMENTS.forEach(
                achievement => {

                    if (
                        g.achievements
                            .unlocked
                            .includes(
                                achievement.id
                            )
                    ) {

                        return;
                    }

                    let completed =
                        false;

                    try {

                        completed =
                            achievement
                                .requirement(
                                    g
                                );

                    } catch (error) {

                        console.error(
                            error
                        );
                    }

                    if (
                        !completed
                    ) {
                        return;
                    }

                    g.achievements
                        .unlocked
                        .push(
                            achievement.id
                        );

                    g.achievements
                        .points +=
                        achievement.reward
                            .points ||
                        0;

                    if (
                        achievement.reward.gold
                    ) {

                        addCurrency(
                            "gold",
                            achievement
                                .reward
                                .gold,
                            "achievement"
                        );
                    }

                    if (
                        achievement.reward.mithril
                    ) {

                        addCurrency(
                            "mithril",
                            achievement
                                .reward
                                .mithril,
                            "achievement"
                        );
                    }

                    if (
                        achievement.reward.rubies
                    ) {

                        addCurrency(
                            "rubies",
                            achievement
                                .reward
                                .rubies,
                            "achievement"
                        );
                    }

                    gameToast(
                        `${achievement.title}: ${achievement.description}`,
                        "ACHIEVEMENT"
                    );

                    emitGameEvent(
                        "achievementUnlocked",
                        achievement
                    );
                }
            );
        };

    /* =========================================================
       KILL HOOK
       ========================================================= */

    window.registerKill =
        function registerKill(
            options = {}
        ) {

            const g =
                window.gameData;

            const boss =
                Boolean(
                    options.isBoss
                );

            g.combat.totalKills++;

            if (
                boss
            ) {

                g.combat.totalBossKills++;

                g.quests.bosses++;

                g.daily.killCompleted =
                    true;

                g.events.eventBosses++;
            }

            g.quests.kills++;

            g.events.eventKills++;

            if (
                options.damage
            ) {

                g.combat.totalDamage +=
                    safeNumber(
                        options.damage,
                        0
                    );

                g.quests.damageDealt +=
                    safeNumber(
                        options.damage,
                        0
                    );
            }

            g.combat.combo++;

            g.combat.maxCombo =
                Math.max(
                    g.combat.maxCombo,
                    g.combat.combo
                );

            gainExp(
                options.exp ||
                    (
                        boss
                            ? 1000
                            : 100
                    ),
                boss
                    ? "boss"
                    : "kill"
            );

            addCurrency(
                "gold",
                options.gold ||
                    (
                        boss
                            ? 2500
                            : 150
                    ),
                "kill"
            );

            if (
                boss
            ) {

                addCurrency(
                    "rubies",
                    options.rubies ||
                        0,
                    "boss"
                );
            }

            updateQuestsUI();

            checkAchievements();

            saveGame();

            emitGameEvent(
                "killRegistered",
                {
                    boss,
                    options
                }
            );
        };

    /* =========================================================
       PRESTIGE
       ========================================================= */

    window.doPrestige =
        function doPrestige() {

            const g =
                window.gameData;

            if (
                g.player.level <
                50
            ) {

                gameToast(
                    "Prestiż wymaga poziomu 50.",
                    "PRESTIŻ"
                );

                return false;
            }

            const accepted =
                window.confirm(
                    "AKTYWOWAĆ PRESTIŻ?\n\n" +
                    "Resetowane:\n" +
                    "• poziom\n" +
                    "• EXP\n" +
                    "• skill points\n" +
                    "• podstawowe waluty\n" +
                    "• questy\n\n" +
                    "Ekwipunek zostaje.\n\n" +
                    "Otrzymasz stały bonus +50%."
                );

            if (
                !accepted
            ) {

                return false;
            }

            g.prestige.level++;

            g.prestige.totalPrestiges++;

            g.prestige.permanentMultiplier =
                getPrestigeMultiplier();

            g.prestige.permanentDamage +=
                10;

            g.prestige.permanentHp +=
                50;

            g.prestige.permanentGold +=
                5;

            g.prestige.permanentExp +=
                3;

            g.prestige.permanentLuck +=
                2;

            /*
             * Reset progression
             */

            g.currencies.gold =
                0;

            g.currencies.iron =
                0;

            g.currencies.mithril =
                0;

            g.player.level =
                1;

            g.player.exp =
                0;

            g.player.maxExp =
                100;

            g.player.skillPoints =
                0;

            g.player.talentPoints =
                0;

            Object.keys(
                g.skills
            ).forEach(
                key => {
                    g.skills[key] = 0;
                }
            );

            g.quests.kills =
                0;

            g.quests.mines =
                0;

            g.quests.bosses =
                0;

            g.quests.dungeons =
                0;

            g.quests.killsClaimed =
                false;

            g.quests.minesClaimed =
                false;

            g.quests.bossClaimed =
                false;

            recalculatePlayerStats();

            window.playerCurrentHp =
                window.playerMaxHp;

            window.playerCurrentMp =
                window.playerMaxMp;

            window.isDead =
                false;

            window.isFighting =
                false;

            updateAllUI();

            saveGame(
                true
            );

            gameToast(
                `Prestiż ${g.prestige.level} aktywowany!`,
                "PRESTIŻ"
            );

            emitGameEvent(
                "prestigeActivated",
                {
                    level:
                        g.prestige.level
                }
            );

            return true;
        };

    /* =========================================================
       WORLD / BIOME
       ========================================================= */

    window.unlockBiome =
        function unlockBiome(
            index,
            requirementLevel
        ) {

            const g =
                window.gameData;

            index =
                safeInteger(
                    index,
                    0
                );

            requirementLevel =
                Math.max(
                    1,
                    safeInteger(
                        requirementLevel,
                        1
                    )
                );

            if (
                g.player.level <
                requirementLevel
            ) {

                gameToast(
                    `Ten biom wymaga poziomu ${requirementLevel}.`,
                    "ŚWIAT"
                );

                return false;
            }

            if (
                !g.world
                    .unlockedBiomes
                    .includes(
                        index
                    )
            ) {

                g.world
                    .unlockedBiomes
                    .push(
                        index
                    );
            }

            gameToast(
                "Nowy biom został odblokowany.",
                "ŚWIAT"
            );

            saveGame();

            return true;
        };

    window.setCurrentBiomeUI =
        function setCurrentBiomeUI(
            index,
            name
        ) {

            const g =
                window.gameData;

            g.world.currentBiome =
                safeInteger(
                    index,
                    0
                );

            if (
                name
            ) {

                g.world.activeLocation =
                    name;
            }

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

            if (
                select
            ) {

                select.value =
                    String(
                        index
                    );
            }

            document
                .querySelectorAll(
                    ".map-node"
                )
                .forEach(
                    node => {

                        const nodeBiome =
                            node.dataset
                                ?.biome;

                        if (
                            nodeBiome ===
                            undefined
                        ) {
                            return;
                        }

                        node.classList.toggle(
                            "active",
                            Number(
                                nodeBiome
                            ) ===
                            Number(
                                index
                            )
                        );
                    }
                );

            saveGame();
        };

    /* =========================================================
       DAILY SYSTEM
       ========================================================= */

    function getDateKey(
        timestamp =
            Date.now()
    ) {

        const date =
            new Date(
                timestamp
            );

        return [
            date.getFullYear(),
            String(
                date.getMonth() +
                1
            ).padStart(
                2,
                "0"
            ),
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            )
        ].join(
            "-"
        );
    }

    window.claimDailyReward =
        function claimDailyReward() {

            const g =
                window.gameData;

            const today =
                getDateKey();

            if (
                g.daily
                    .lastClaimDate ===
                today
            ) {

                gameToast(
                    "Dzisiejsza nagroda została już odebrana.",
                    "DAILY"
                );

                return false;
            }

            const previous =
                g.daily
                    .lastClaimDate;

            if (
                previous
            ) {

                const previousDate =
                    new Date(
                        `${previous}T00:00:00`
                    );

                const now =
                    new Date(
                        `${today}T00:00:00`
                    );

                const diff =
                    Math.floor(
                        (
                            now -
                            previousDate
                        ) /
                        86400000
                    );

                if (
                    diff === 1
                ) {

                    g.daily.streak =
                        Math.min(
                            30,
                            g.daily.streak +
                            1
                        );

                } else {

                    g.daily.streak =
                        1;
                }

            } else {

                g.daily.streak =
                    1;
            }

            g.daily.lastClaimDate =
                today;

            g.daily.chestClaimed =
                true;

            const goldReward =
                1000 +
                (
                    g.daily.streak *
                    250
                );

            const expReward =
                500 +
                (
                    g.daily.streak *
                    100
                );

            addCurrency(
                "gold",
                goldReward,
                "daily"
            );

            gainExp(
                expReward,
                "daily"
            );

            if (
                g.daily.streak %
                7 ===
                0
            ) {

                addCurrency(
                    "rubies",
                    5,
                    "daily"
                );
            }

            gameToast(
                `Dzień ${g.daily.streak}: +${formatGameNumber(goldReward)} 🪙 i +${formatGameNumber(expReward)} XP.`,
                "DAILY REWARD"
            );

            saveGame();

            emitGameEvent(
                "dailyClaimed",
                {
                    streak:
                        g.daily.streak
                }
            );

            return true;
        };

    /* =========================================================
       OFFLINE PROGRESS
       ========================================================= */

    function calculateOfflineProgress() {

        const g =
            window.gameData;

        const last =
            safeNumber(
                g.lastOnlineAt,
                Date.now()
            );

        const now =
            Date.now();

        let elapsed =
            Math.floor(
                (
                    now -
                    last
                ) /
                1000
            );

        elapsed =
            clamp(
                elapsed,
                0,
                60 * 60 * 8
            );

        if (
            elapsed <
            60
        ) {

            return {
                seconds:
                    elapsed,

                gold:
                    0,

                exp:
                    0
            };
        }

        const minutes =
            Math.floor(
                elapsed /
                60
            );

        const goldPerMinute =
            Math.max(
                20,
                Math.floor(
                    window.totalDps *
                    .3
                )
            );

        const gold =
            minutes *
            goldPerMinute;

        const exp =
            minutes *
            Math.max(
                10,
                Math.floor(
                    g.player.level *
                    2
                )
            );

        return {
            seconds:
                elapsed,

            gold,

            exp
        };
    }

    function applyOfflineProgress() {

        const reward =
            calculateOfflineProgress();

        if (
            reward.seconds <
            60
        ) {

            return;
        }

        if (
            reward.gold >
            0
        ) {

            addCurrency(
                "gold",
                reward.gold,
                "offline"
            );
        }

        if (
            reward.exp >
            0
        ) {

            gainExp(
                reward.exp,
                "offline"
            );
        }

        const minutes =
            Math.floor(
                reward.seconds /
                60
            );

        gameToast(
            `Podczas Twojej nieobecności zdobyłeś ${formatGameNumber(reward.gold)} 🪙 i ${formatGameNumber(reward.exp)} XP przez ${minutes} min.`,
            "OFFLINE REWARD"
        );
    }

    /* =========================================================
       SETTINGS
       ========================================================= */

    window.saveSettings =
        function saveSettings(
            settings
        ) {

            try {

                localStorage.setItem(
                    SETTINGS_KEY,
                    JSON.stringify(
                        settings
                    )
                );

                return true;

            } catch (error) {

                console.error(
                    error
                );

                return false;
            }
        };

    window.loadSettings =
        function loadSettings() {

            try {

                const saved =
                    localStorage.getItem(
                        SETTINGS_KEY
                    );

                if (!saved) {

                    return cloneObject(
                        DEFAULT_GAME_DATA
                            .settings
                    );
                }

                const parsed =
                    JSON.parse(
                        saved
                    );

                return {
                    ...DEFAULT_GAME_DATA
                        .settings,
                    ...parsed
                };

            } catch (error) {

                console.error(
                    error
                );

                return cloneObject(
                    DEFAULT_GAME_DATA
                        .settings
                );
            }
        };

    /* =========================================================
       UPDATE ALL UI
       ========================================================= */

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
         * Inventory
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
         * Legacy functions
         */

        if (
            typeof window.renderInventory ===
            "function"
        ) {

            try {

                window.renderInventory();

            } catch (error) {

                console.error(
                    "Inventory render error:",
                    error
                );
            }
        }

        if (
            typeof window.updateCombatUI ===
            "function"
        ) {

            try {

                window.updateCombatUI();

            } catch (error) {

                console.error(
                    "Combat UI error:",
                    error
                );
            }
        }

        if (
            typeof window.updateGachaUI ===
            "function"
        ) {

            try {

                window.updateGachaUI();

            } catch (error) {

                console.error(
                    "Gacha UI error:",
                    error
                );
            }
        }
    }

    window.updateAllUI =
        updateAllUI;

    /* =========================================================
       PLAYTIME
       ========================================================= */

    function startPlaytimeCounter() {

        if (
            playtimeTimer
        ) {

            return;
        }

        playtimeTimer =
            setInterval(
                () => {

                    window.gameData
                        .playTime++;

                    if (
                        window.gameData
                            .playTime %
                        30 ===
                        0
                    ) {

                        window.emitGameEvent(
                            "playtimeTick",
                            {
                                seconds:
                                    window.gameData
                                        .playTime
                            }
                        );
                    }

                },
                1000
            );
    }

    /* =========================================================
       ENERGY REGEN
       ========================================================= */

    function startEnergyRegen() {

        if (
            eventTimer
        ) {

            return;
        }

        eventTimer =
            setInterval(
                () => {

                    const g =
                        window.gameData;

                    if (
                        g.currencies.energy >=
                        g.currencies.maxEnergy
                    ) {

                        return;
                    }

                    g.currencies.energy =
                        Math.min(
                            g.currencies.maxEnergy,
                            g.currencies.energy +
                            .5
                        );

                    updateStatusUI();

                },
                30000
            );
    }

    /* =========================================================
       AUTOSAVE
       ========================================================= */

    function startAutosave() {

        if (
            autosaveTimer
        ) {

            return;
        }

        autosaveTimer =
            setInterval(
                () => {

                    if (
                        window.gameData
                            .settings
                            .autoSave
                    ) {

                        saveGame();
                    }

                },
                5000
            );
    }

    /* =========================================================
       INVENTORY HOOK
       ========================================================= */

    function hookInventoryFunctions() {

        /*
         * Nie nadpisujemy istniejących
         * funkcji wielokrotnie.
         */

        if (
            typeof window.giveItem ===
            "function" &&
            !window.giveItem.__pixelWrapped
        ) {

            const original =
                window.giveItem;

            const wrapped =
                function(...args) {

                    const result =
                        original.apply(
                            this,
                            args
                        );

                    setTimeout(
                        () => {

                            if (
                                typeof window.renderInventory ===
                                "function"
                            ) {

                                window.renderInventory();
                            }

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

                    emitGameEvent(
                        "itemGiven",
                        {
                            args,
                            result
                        }
                    );

                    return result;
                };

            wrapped.__pixelWrapped =
                true;

            window.giveItem =
                wrapped;
        }
    }

    /* =========================================================
       KEYBOARD
       ========================================================= */

    function setupKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                const target =
                    event.target;

                if (
                    target &&
                    (
                        target.tagName ===
                        "INPUT" ||
                        target.tagName ===
                        "TEXTAREA" ||
                        target.tagName ===
                        "SELECT"
                    )
                ) {

                    return;
                }

                /*
                 * Q
                 */

                if (
                    event.key.toLowerCase() ===
                    "q"
                ) {

                    if (
                        typeof window.playerAttack ===
                        "function"
                    ) {

                        window.playerAttack();
                    }
                }

                /*
                 * W
                 */

                if (
                    event.key.toLowerCase() ===
                    "w"
                ) {

                    if (
                        typeof window.castFireball ===
                        "function"
                    ) {

                        window.castFireball();
                    }
                }

                /*
                 * E
                 */

                if (
                    event.key.toLowerCase() ===
                    "e"
                ) {

                    if (
                        typeof window.healPlayer ===
                        "function"
                    ) {

                        window.healPlayer(
                            Math.floor(
                                window.playerMaxHp *
                                .2
                            )
                        );
                    }
                }

                /*
                 * R
                 */

                if (
                    event.key.toLowerCase() ===
                    "r"
                ) {

                    if (
                        typeof window.ultimateAttack ===
                        "function"
                    ) {

                        window.ultimateAttack();
                    }
                }

                /*
                 * SPACE
                 */

                if (
                    event.code ===
                    "Space"
                ) {

                    if (
                        target?.tagName !==
                        "BUTTON"
                    ) {

                        const world =
                            document.querySelector(
                                "#screen-world, #world"
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

                /*
                 * Numbers
                 */

                const tabs = {

                    "1": "screen-world",

                    "2": "screen-inventory",

                    "3": "screen-skills",

                    "4": "screen-forge",

                    "5": "screen-shop",

                    "6": "screen-quests",

                    "7": "screen-gacha",

                    "8": "screen-guild"
                };

                if (
                    tabs[event.key]
                ) {

                    openTab(
                        tabs[event.key]
                    );
                }
            }
        );
    }

    /* =========================================================
       UNLOAD SAVE
       ========================================================= */

    window.addEventListener(
        "beforeunload",
        () => {

            try {

                window.gameData
                    .lastOnlineAt =
                    Date.now();

                window.gameData
                    .combatState
                    .currentHp =
                    window.playerCurrentHp;

                window.gameData
                    .combatState
                    .currentMp =
                    window.playerCurrentMp;

                saveGame(
                    true
                );

            } catch (error) {

                console.error(
                    error
                );
            }
        }
    );

    /* =========================================================
       TAB VISIBILITY
       ========================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                window.gameData
                    .lastOnlineAt =
                    Date.now();

                saveGame();

            } else {

                updateAllUI();
            }
        }
    );

    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function initialize() {

        if (
            initialized
        ) {

            return;
        }

        initialized =
            true;

        /*
         * Load settings first
         */

        const settings =
            window.loadSettings();

        window.gameData.settings = {
            ...window.gameData.settings,
            ...settings
        };

        /*
         * Load save
         */

        const existingSave =
            localStorage.getItem(
                STORAGE_KEY
            );

        loadGame();

        /*
         * Offline reward only
         * for existing players
         */

        if (
            existingSave
        ) {

            applyOfflineProgress();
        }

        /*
         * Start systems
         */

        startAutosave();

        startPlaytimeCounter();

        startEnergyRegen();

        setupKeyboard();

        /*
         * External modules
         */

        setTimeout(
            () => {

                try {

                    if (
                        typeof window.loadInventory ===
                        "function"
                    ) {

                        window.loadInventory();
                    }

                } catch (error) {

                    console.error(
                        "Inventory initialization error:",
                        error
                    );
                }

                try {

                    if (
                        typeof window.loadCombat ===
                        "function"
                    ) {

                        window.loadCombat();
                    }

                } catch (error) {

                    console.error(
                        "Combat initialization error:",
                        error
                    );
                }

                try {

                    if (
                        typeof window.loadGacha ===
                        "function"
                    ) {

                        window.loadGacha();
                    }

                } catch (error) {

                    console.error(
                        "Gacha initialization error:",
                        error
                    );
                }

                hookInventoryFunctions();

                /*
                 * Recalculate again after
                 * external modules loaded.
                 */

                recalculatePlayerStats();

                updateAllUI();

                /*
                 * Combat starts
                 */

                window.isFighting =
                    !window.isDead;

                /*
                 * First monster
                 */

                if (
                    typeof window.spawnMonster ===
                    "function"
                ) {

                    try {

                        window.spawnMonster();

                    } catch (error) {

                        console.error(
                            "Spawn monster error:",
                            error
                        );
                    }
                }

                /*
                 * Welcome
                 */

                if (
                    !existingSave
                ) {

                    gameToast(
                        "Witaj w Pixel Realms Online. Twoja przygoda właśnie się zaczyna.",
                        "WELCOME"
                    );

                } else {

                    gameToast(
                        `Witaj ponownie, ${window.gameData.player.name}.`,
                        "PIXEL REALMS"
                    );
                }

                log(
                    `🟢 PIXEL REALMS CORE ${CORE_VERSION} ONLINE.`
                );

                emitGameEvent(
                    "coreReady",
                    {
                        version:
                            CORE_VERSION
                    }
                );

            },
            100
        );
    }

    /* =========================================================
       DOM READY
       ========================================================= */

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
