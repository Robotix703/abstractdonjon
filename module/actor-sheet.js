import { EntitySheetHelper } from "./helper.js";
import {ATTRIBUTE_TYPES} from "./constants.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SimpleActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stargatecoalition", "sheet", "actor"],
      template: "systems/stargatecoalition/templates/actor-sheet.html",
      width: 700,
      height: 750,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biographie", ".items", ".attributes"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("stargatecoalition", "macroShorthand");
    context.systemData = context.data.system;
    context.dtypes = ATTRIBUTE_TYPES;
    context.biographyHTML = await TextEditor.enrichHTML(context.systemData.biographie, {
      secrets: this.document.isOwner,
      async: true
    });
    context.notesHTML = await TextEditor.enrichHTML(context.systemData.notes, {
      secrets: this.document.isOwner,
      async: true
    });
    context.racialSpecificityHTML = await TextEditor.enrichHTML(context.systemData.racialSpecificity, {
      secrets: this.document.isOwner,
      async: true
    });
    return context;
  }

  /* -------------------------------------------- */

  computeModifiers(data){
    data["system.characteristics.force.modifier"] = this.valueToModifier(data["system.characteristics.force.value"]);
    data["system.characteristics.dexterite.modifier"] = this.valueToModifier(data["system.characteristics.dexterite.value"]);
    data["system.characteristics.constitution.modifier"] = this.valueToModifier(data["system.characteristics.constitution.value"]);
    data["system.characteristics.astuce.modifier"] = this.valueToModifier(data["system.characteristics.astuce.value"]);
    data["system.characteristics.intelligence.modifier"] = this.valueToModifier(data["system.characteristics.intelligence.value"]);
    data["system.characteristics.perception.modifier"] = this.valueToModifier(data["system.characteristics.perception.value"]);
    data["system.characteristics.volonte.modifier"] = this.valueToModifier(data["system.characteristics.volonte.value"]);
    data["system.characteristics.charisme.modifier"] = this.valueToModifier(data["system.characteristics.charisme.value"]);
  }

  computeSkills(data){
    //Total
    data["system.skills.contactWeapon.total"] = data["system.skills.contactWeapon.points"] + data["system.skills.contactWeapon.temp"];
    data["system.skills.unarmedCombat.total"] = data["system.skills.unarmedCombat.points"] + data["system.skills.unarmedCombat.temp"];
    data["system.skills.swimming.total"] = data["system.skills.swimming.points"] + data["system.skills.swimming.temp"];
    data["system.skills.jumpAndClimb.total"] = data["system.skills.jumpAndClimb.points"] + data["system.skills.jumpAndClimb.temp"];

    data["system.skills.rangedWeapon.total"] = data["system.skills.rangedWeapon.points"] + data["system.skills.rangedWeapon.temp"];
    data["system.skills.dodge.total"] = data["system.skills.dodge.points"] + data["system.skills.dodge.temp"];
    data["system.skills.acrobatics.total"] = data["system.skills.acrobatics.points"] + data["system.skills.acrobatics.temp"];
    data["system.skills.stealth.total"] = data["system.skills.stealth.points"] + data["system.skills.stealth.temp"];

    data["system.skills.vigor.total"] = data["system.skills.vigor.points"] + data["system.skills.vigor.temp"];
    data["system.skills.endurance.total"] = data["system.skills.endurance.points"] + data["system.skills.endurance.temp"];
    data["system.skills.recovery.total"] = data["system.skills.recovery.points"] + data["system.skills.recovery.temp"];
    data["system.skills.immunity.total"] = data["system.skills.immunity.points"] + data["system.skills.immunity.temp"];

    data["system.skills.piloting.total"] = data["system.skills.piloting.points"] + data["system.skills.piloting.temp"];
    data["system.skills.sabotage.total"] = data["system.skills.sabotage.points"] + data["system.skills.sabotage.temp"];
    data["system.skills.strategy.total"] = data["system.skills.strategy.points"] + data["system.skills.strategy.temp"];
    data["system.skills.survival.total"] = data["system.skills.survival.points"] + data["system.skills.survival.temp"];

    data["system.skills.archeology.total"] = data["system.skills.archeology.points"] + data["system.skills.archeology.temp"];
    data["system.skills.science.total"] = data["system.skills.science.points"] + data["system.skills.science.temp"];
    data["system.skills.medical.total"] = data["system.skills.medical.points"] + data["system.skills.medical.temp"];
    data["system.skills.technologie.total"] = data["system.skills.technologie.points"] + data["system.skills.technologie.temp"];

    data["system.skills.smell.total"] = data["system.skills.smell.points"] + data["system.skills.smell.temp"];
    data["system.skills.hearing.total"] = data["system.skills.hearing.points"] + data["system.skills.hearing.temp"];
    data["system.skills.touch.total"] = data["system.skills.touch.points"] + data["system.skills.touch.temp"];
    data["system.skills.view.total"] = data["system.skills.view.points"] + data["system.skills.view.temp"];

    data["system.skills.concentration.total"] = data["system.skills.concentration.points"] + data["system.skills.concentration.temp"];
    data["system.skills.empathy.total"] = data["system.skills.empathy.points"] + data["system.skills.empathy.temp"];
    data["system.skills.strongMinded.total"] = data["system.skills.strongMinded.points"] + data["system.skills.strongMinded.temp"];
    data["system.skills.mentalToughness.total"] = data["system.skills.mentalToughness.points"] + data["system.skills.mentalToughness.temp"];

    data["system.skills.bluff.total"] = data["system.skills.bluff.points"] + data["system.skills.bluff.temp"];
    data["system.skills.intimidation.total"] = data["system.skills.intimidation.points"] + data["system.skills.intimidation.temp"];
    data["system.skills.leadership.total"] = data["system.skills.leadership.points"] + data["system.skills.leadership.temp"];
    data["system.skills.negotiation.total"] = data["system.skills.negotiation.points"] + data["system.skills.negotiation.temp"];

    //Actual
    data["system.skillsLimits.force.actual"] =
      data["system.skills.contactWeapon.points"] 
      + data["system.skills.unarmedCombat.points"]
      + data["system.skills.swimming.points"]
      + data["system.skills.jumpAndClimb.points"];

    data["system.skillsLimits.dexterite.actual"] = 
      data["system.skills.rangedWeapon.points"] 
      + data["system.skills.dodge.points"]
      + data["system.skills.acrobatics.points"]
      + data["system.skills.stealth.points"];

    data["system.skillsLimits.constitution.actual"] = 
      data["system.skills.vigor.points"] 
      + data["system.skills.endurance.points"]
      + data["system.skills.recovery.points"]
      + data["system.skills.immunity.points"];

    data["system.skillsLimits.astuce.actual"] = 
      data["system.skills.piloting.points"] 
      + data["system.skills.sabotage.points"]
      + data["system.skills.strategy.points"]
      + data["system.skills.survival.points"];

    data["system.skillsLimits.intelligence.actual"] = 
      data["system.skills.archeology.points"] 
      + data["system.skills.science.points"]
      + data["system.skills.medical.points"]
      + data["system.skills.technologie.points"];

    data["system.skillsLimits.perception.actual"] = 
      data["system.skills.smell.points"] 
      + data["system.skills.hearing.points"]
      + data["system.skills.touch.points"]
      + data["system.skills.view.points"];

    data["system.skillsLimits.volonte.actual"] = 
      data["system.skills.concentration.points"] 
      + data["system.skills.empathy.points"]
      + data["system.skills.strongMinded.points"]
      + data["system.skills.mentalToughness.points"];

    data["system.skillsLimits.charisme.actual"] = 
      data["system.skills.bluff.points"] 
      + data["system.skills.intimidation.points"]
      + data["system.skills.leadership.points"]
      + data["system.skills.negotiation.points"];

    //max
    data["system.skillsLimits.force.max"] = data["system.characteristics.force.modifier"] * 1.5;
    data["system.skillsLimits.dexterite.max"] = data["system.characteristics.dexterite.modifier"] * 1.5;
    data["system.skillsLimits.constitution.max"] = data["system.characteristics.constitution.modifier"] * 1.5;
    data["system.skillsLimits.astuce.max"] = data["system.characteristics.astuce.modifier"] * 1.5;
    data["system.skillsLimits.intelligence.max"] = data["system.characteristics.intelligence.modifier"] * 1.5;
    data["system.skillsLimits.perception.max"] = data["system.characteristics.perception.modifier"] * 1.5;
    data["system.skillsLimits.volonte.max"] = data["system.characteristics.volonte.modifier"] * 1.5;
    data["system.skillsLimits.charisme.max"] = data["system.characteristics.charisme.modifier"] * 1.5;

    //maxSet
    data["system.skillsLimits.force.maxSet"] = data["system.characteristics.force.modifier"] * 3;
    data["system.skillsLimits.dexterite.maxSet"] = data["system.characteristics.dexterite.modifier"] * 3;
    data["system.skillsLimits.constitution.maxSet"] = data["system.characteristics.constitution.modifier"] * 3;
    data["system.skillsLimits.astuce.maxSet"] = data["system.characteristics.astuce.modifier"] * 3;
    data["system.skillsLimits.intelligence.maxSet"] = data["system.characteristics.intelligence.modifier"] * 3;
    data["system.skillsLimits.perception.maxSet"] = data["system.characteristics.perception.modifier"] * 3;
    data["system.skillsLimits.volonte.maxSet"] = data["system.characteristics.volonte.modifier"] * 3;
    data["system.skillsLimits.charisme.maxSet"] = data["system.characteristics.charisme.modifier"] * 3;
  }

  valueToModifier(value) {
    return Math.floor(value/2) - 5
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute Management
    html.find(".attributes").on("click", "a.caracteristics-roll", EntitySheetHelper.onAttributeRoll.bind(this));
    html.find(".resource").on("click", "a.resource-roll", EntitySheetHelper.onRessourceRoll.bind(this));
    html.find(".skills").on("click", "a.skill-roll", EntitySheetHelper.onSkillRoll.bind(this));

    // Item Controls
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onAttackRoll.bind(this));
    html.find(".items .equipped").on("click", this._onItemEquipped.bind(this));
  }
  /* -------------------------------------------- */

  /**
   * Handle click events for Item control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("SIMPLE.ItemNew"), type: "item"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }

  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   */
  _onAttackRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    const damage = item.system.weapon.damage + (item.system.weapon.isImproved ? 1 : 0);
    let r = new Roll(button[0].getAttribute('data-roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3><h3>${damage}</h3>`
    });
  }

  _onItemEquipped(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));

    //Update armor
    if(item.system.armor.isPhysicalArmor) {
      if(button[0].checked) {
        let newArmorValue = this.actor.system.physicalArmor + item.system.armor.protection;
        this.actor.update({"system.physicalArmor": newArmorValue});
      } else {
        let newArmorValue = this.actor.system.physicalArmor - item.system.armor.protection;
        this.actor.update({"system.physicalArmor": (newArmorValue >= 0) ? newArmorValue : 0});
      }
    }
    if(item.system.armor.isEnergetic) {
      if(button[0].checked) {
        let newArmorValue = this.actor.system.energeticArmor + item.system.armor.protection;
        this.actor.update({"system.energeticArmor": newArmorValue});
      } else {
        let newArmorValue = this.actor.system.energeticArmor - item.system.armor.protection;
        this.actor.update({"system.energeticArmor": (newArmorValue >= 0) ? newArmorValue : 0});
      }
    }

    //Update Item
    this.actor.items.getName(item.name).update({"system.armor.isEquip": button[0].checked});
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    this.computeModifiers(formData);
    this.computeSkills(formData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
