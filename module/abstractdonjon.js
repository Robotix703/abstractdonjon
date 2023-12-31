import { SimpleActor } from "./actor.js";
import { SimpleItem } from "./item.js";

import { SimpleItemSheet } from "./item-sheet.js";
import { SkillSheet } from "./skill-sheet.js";

import { PlayerSheet } from "./player-sheet.js";
import { NPCSheet } from "./npc-sheet.js";
import { ObstacleSheet } from "./obstacle-sheet.js";
import { ChallengeSheet } from "./challenge-sheet.js";
import { AdversarySheet } from "./adversary-sheet.js";
import { BossSheet } from "./boss-sheet.js";

import { createabstractdonjonMacro } from "./macro.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once("init", async function () {
  console.log(`Initializing abstractdonjon System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1",
    decimals: 2
  };

  game.abstractdonjon = {
    SimpleActor,
    createabstractdonjonMacro
  };

  CONFIG.Actor.documentClass = SimpleActor;
  CONFIG.Item.documentClass = SimpleItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("abstractdonjon", PlayerSheet, { types: ["Joueur"], label: "Joueur", makeDefault: true });
  Actors.registerSheet("abstractdonjon", NPCSheet, { types: ["PNJ"], label: "PNJ", makeDefault: true });
  Actors.registerSheet("abstractdonjon", ObstacleSheet, { types: ["Obstacle"], label: "Obstacle", makeDefault: true });
  Actors.registerSheet("abstractdonjon", ChallengeSheet, { types: ["Defi"], label: "Défi", makeDefault: true });
  Actors.registerSheet("abstractdonjon", AdversarySheet, { types: ["Adversaire"], label: "Adversaire", makeDefault: true });
  Actors.registerSheet("abstractdonjon", BossSheet, { types: ["Boss"], label: "Boss", makeDefault: true });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("abstractdonjon", SimpleItemSheet, { types: ["Equipement"], label: "Equipement", makeDefault: true });
  Items.registerSheet("abstractdonjon", SkillSheet, { types: ["Skill"], label: "Trait", makeDefault: true });

  // Register system settings
  game.settings.register("abstractdonjon", "macroShorthand", {
    name: "SETTINGS.SimpleMacroShorthandN",
    hint: "SETTINGS.SimpleMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("abstractdonjon", "initFormula", {
    name: "SETTINGS.SimpleInitFormulaN",
    hint: "SETTINGS.SimpleInitFormulaL",
    scope: "world",
    type: String,
    default: "1",
    config: true,
    onChange: formula => _simpleUpdateInit(formula, true)
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("abstractdonjon", "initFormula");
  _simpleUpdateInit(initFormula);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _simpleUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula);
    if (!isValid) {
      if (notify) ui.notifications.error(`${game.i18n.localize("SIMPLE.NotifyInitFormulaInvalid")}: ${formula}`);
      return;
    }
    CONFIG.Combat.initiative.formula = formula;
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function (value) {
    return value.slugify({ strict: true });
  });
});

/**
 * Macrobar hook.
 */
Hooks.on("hotbarDrop", (bar, data, slot) => createabstractdonjonMacro(data, slot));
