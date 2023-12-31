import { EntitySheetHelper } from "./helper.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class PlayerSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["abstractdonjon", "sheet", "actor", "Joueur"],
      template: "systems/abstractdonjon/templates/player-sheet.html",
      width: 700,
      height: 750,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".biographie", ".items", ".attributes"],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
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
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    //Items
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onDiceRoll.bind(this));
    html.find(".items .dice").on("change", this._onItemUpdate.bind(this));

    //Skills
    html.find(".skills .rollable").on("click", this._onDiceRoll.bind(this));
    html.find(".skills .dice").on("change", this._onItemUpdate.bind(this));

    //Attributes
    html.find(".attributes .add-dice").on("click", this._onAddDice.bind(this));
    html.find(".attributes .remove-dice").on("click", this._onRemoveDice.bind(this));
    html.find(".attributes .roll-dice").on("click", this._onAttributeDiceRoll.bind(this));
    html.find(".attributes .dice").on("change", this._onAttributeDiceChange.bind(this));
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
    switch (button.dataset.action) {
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }

  /* -------------------------------------------- */

  async _onDiceRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));

    let r = new Roll("1d6", this.actor.getRollData());
    await r.evaluate();

    this.actor.items.getName(item.name).update({ "system.dice": r.total });
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2>`
    })
  }

  async _onAttributeDiceRoll(event) {
    let button = $(event.currentTarget);
    let name = "";

    let amount;
    switch (button[0].getAttribute('data-roll')) {
      case "force":
        name = "Force";
        amount = this.actor.system.characteristics.force.length ? this.actor.system.characteristics.force.length : 0;
        break;
      case "dexterite":
        name = "Dextérité";
        amount = this.actor.system.characteristics.dexterite.length ? this.actor.system.characteristics.dexterite.length : 0;
        break;
      case "sagesse":
        name = "Sagesse";
        amount = this.actor.system.characteristics.sagesse.length ? this.actor.system.characteristics.sagesse.length : 0;
        break;
      case "intelligence":
        name = "Intelligence";
        amount = this.actor.system.characteristics.intelligence.length ? this.actor.system.characteristics.intelligence.length : 0;
        break;
      case "bonus":
        name = "Bonus";
        amount = 1;
        break;
    }

    let r = new Roll(amount + "d6", this.actor.getRollData());
    await r.evaluate();

    let dices = r.dice[0].results.map(e => e.result);
    switch (button[0].getAttribute('data-roll')) {
      case "force":
        this.actor.update({ "system.characteristics.force": dices });
        break;
      case "dexterite":
        this.actor.update({ "system.characteristics.dexterite": dices });
        break;
      case "sagesse":
        this.actor.update({ "system.characteristics.sagesse": dices });
        break;
      case "intelligence":
        this.actor.update({ "system.characteristics.intelligence": dices });
        break;
      case "bonus":
        this.actor.update({ "system.characteristics.bonus": dices[0] });
        break;
    }

    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${name}</h2>`
    })
  }

  _onItemUpdate(event) {
    let input = $(event.currentTarget);
    const li = input.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));

    this.actor.items.getName(item.name).update({ "system.dice": input[0].value });
  }

  _onAttributeDiceChange(event) {
    let input = $(event.currentTarget);
    const li = input.parents(".dice-pool")[0];

    let dices = [];
    for (const child of li.children) {
      dices.push(child.value);
    }

    switch (li.getAttribute('data-roll')) {
      case "force":
        this.actor.update({ "system.characteristics.force": dices });
        break;
      case "dexterite":
        this.actor.update({ "system.characteristics.dexterite": dices });
        break;
      case "sagesse":
        this.actor.update({ "system.characteristics.sagesse": dices });
        break;
      case "intelligence":
        this.actor.update({ "system.characteristics.intelligence": dices });
        break;
      case "bonus":
        this.actor.update({ "system.characteristics.bonus": dices[0] });
        break;
    }
  }

  _onAddDice(event) {
    let button = $(event.currentTarget);
    let dices = [];

    switch (button[0].getAttribute('data-roll')) {
      case "force":
        dices = this.actor.system.characteristics.force;
        dices.push(1);
        this.actor.update({ "system.characteristics.force": dices });
        break;
      case "dexterite":
        dices = this.actor.system.characteristics.dexterite;
        dices.push(1);
        this.actor.update({ "system.characteristics.dexterite": dices });
        break;
      case "sagesse":
        dices = this.actor.system.characteristics.sagesse;
        dices.push(1);
        this.actor.update({ "system.characteristics.sagesse": dices });
        break;
      case "intelligence":
        dices = this.actor.system.characteristics.intelligence;
        dices.push(1);
        this.actor.update({ "system.characteristics.intelligence": dices });
        break;
    }
  }

  _onRemoveDice(event) {
    let button = $(event.currentTarget);
    let dices = [];

    switch (button[0].getAttribute('data-roll')) {
      case "force":
        dices = this.actor.system.characteristics.force;
        dices.splice(-1);
        this.actor.update({ "system.characteristics.force": dices });
        break;
      case "dexterite":
        dices = this.actor.system.characteristics.dexterite;
        dices.splice(-1);
        this.actor.update({ "system.characteristics.dexterite": dices });
        break;
      case "sagesse":
        dices = this.actor.system.characteristics.sagesse;
        dices.splice(-1);
        this.actor.update({ "system.characteristics.sagesse": dices });
        break;
      case "intelligence":
        dices = this.actor.system.characteristics.intelligence;
        dices.splice(-1);
        this.actor.update({ "system.characteristics.intelligence": dices });
        break;
    }
  }
  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
