import { EntitySheetHelper } from "./helper.js";
import {ATTRIBUTE_TYPES} from "./constants.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SimpleItemSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stargatecoalition", "sheet", "item"],
      template: "systems/stargatecoalition/templates/item-sheet.html",
      width: 520,
      height: 480,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    EntitySheetHelper.getAttributeData(context.data);
    context.systemData = context.data.system;
    context.dtypes = ATTRIBUTE_TYPES;
    context.descriptionHTML = await TextEditor.enrichHTML(context.systemData.description, {
      secrets: this.document.isOwner,
      async: true
    });
    context.additionalRuleHTML = await TextEditor.enrichHTML(context.systemData.additionalRule, {
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

    // Attribute Management
    
  }

  handleWeaponType(data){
    if(data["system.objectType.isWeapon"]) {
      data["system.weapon.meleePenalty"] = 0;
      if(data["system.weapon.isStic"]) data["system.weapon.meleePenalty"] = 0;
      if(data["system.weapon.isColdSteel"]) data["system.weapon.meleePenalty"] = 1;
      if(data["system.weapon.isMelee"]) data["system.weapon.meleePenalty"] = 2;
      if(data["system.weapon.isPistol"]) data["system.weapon.meleePenalty"] = 3;
      if(data["system.weapon.isRifle"]) data["system.weapon.meleePenalty"] = 5;
      if(data["system.weapon.isExplosive"]) data["system.weapon.meleePenalty"] = 8;
    }
  }
  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    this.handleWeaponType(formData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
