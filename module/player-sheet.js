import { EntitySheetHelper } from "./helper.js";
import {ATTRIBUTE_TYPES} from "./constants.js";

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
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biographie", ".items", ".attributes"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("abstractdonjon", "macroShorthand");
    context.systemData = context.data.system;
    context.dtypes = ATTRIBUTE_TYPES;
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
    if ( !this.isEditable ) return;

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
  async _onDiceRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));

    let r = new Roll("1d6", this.actor.getRollData());
    await r.evaluate();

    this.actor.items.getName(item.name).update({"system.dice": r.total});
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2>`
    })
  }

  _onItemUpdate(event) {
    let input = $(event.currentTarget);
    const li = input.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));

    this.actor.items.getName(item.name).update({"system.dice": input[0].value});
  }

  _onAddDice(event) {
    let dices = this.actor.system.characteristics.force;
    dices.push(1);
    this.actor.update({"system.characteristics.force": dices});
  }

  _onRemoveDice(event) {
    let input = $(event.currentTarget);
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
