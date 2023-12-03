import { EntitySheetHelper } from "./helper.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class AdversarySheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["abstractdonjon", "sheet", "actor", "Adversaire"],
      template: "systems/abstractdonjon/templates/adversary-sheet.html",
      width: 700,
      height: 750,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".biographie", ".attributes"],
      dragDrop: []
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("abstractdonjon", "macroShorthand");
    context.systemData = context.data.system;
    context.dtypes = ["String", "Number", "Boolean", "Formula", "Resource"];
    context.biographyHTML = await TextEditor.enrichHTML(context.systemData.biographie, {
      secrets: this.document.isOwner,
      async: true
    });
    context.attacksHTML = await TextEditor.enrichHTML(context.systemData.attacks, {
      secrets: this.document.isOwner,
      async: true
    });
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Attribute Management
    html.find(".attributes .roll-dice").on("click", this._onAttributeDiceRoll.bind(this));
    html.find(".attributes .dice").on("change", this._onAttributeDiceChange.bind(this));
  }
  /* -------------------------------------------- */

  async _onAttributeDiceRoll(event) {
    let amount = this.actor.system.diceAmount;

    let r = new Roll(amount + "d6", this.actor.getRollData());
    await r.evaluate();

    let dices = r.dice[0].results.map(e => e.result);
    this.actor.update({ "system.diceResults": dices });

    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    },
    {rollMode: "gmroll"})
  }

  _onAttributeDiceChange(event) {
    let input = $(event.currentTarget);
    const li = input.parents(".dice-pool")[0];

    let dices = [];
    for (const child of li.children) {
      dices.push(child.value);
    }

    this.actor.update({ "system.diceResults": dices });
  }

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
