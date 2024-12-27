"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> namespace: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.

 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 *
 * ------- METHOD RELEVANT GENERATOR PARAMETERS BELOW - ADAPT WITH CAUTION -------
 * @function onInventoryDocumentItemChanged
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @returns promise
 */
function onInventoryDocumentItemChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
  /**
   * Item changed handler to handle updates of the inventory document main item list
   *   Triggering difference calculation
   *   Triggering Price calculation
   *   Triggering marking of invalid items (Modification Reason required use case)
   */

  var promise = when.resolve();

  //get changed item
  var mainItem = handlerParams.listItem;

  for (var i = 0; i < handlerParams.modified.length; i++) {
    switch (handlerParams.modified[i]) {

      case "quantity":

        //update quantity difference of the main item
        var mainList = me.getLoItemsMainList();

        mainList.suspendListRefresh();
        me.calculateItemDifference(mainItem, handlerParams.newValues.quantity);

        //marker that Qty was touched
        if ((handlerParams.newValues.quantity != handlerParams.oldValues.quantity) && mainItem.getSuggestedQuantity() == 0) {
          mainItem.setSuggestedQuantity(mainItem.getTargetQuantity());
        }

        mainList.resumeListRefresh(true);

        //Updating display information of main item
        me.createDisplayInformationForProduct(mainItem.getProductId());

        //Whenever there is a quantity change, we will have to update all the five values
        me.calculateItemValue(mainItem, me.getBoOrderTemplate());
        promise = me.calculateInventoryDocumentValue(mainItem).then(function () {
          me.setCalculationStatus("1");
        });

        break;

      case "modificationReason":
        //mark item if modification reason is missing
        if (me.isModReasonRequired()) {
          if (mainItem.getQuantityDifferenceInformation() != 0 &&
            Utils.isEmptyString(mainItem.getModificationReason())) {
            me.markInvalidItem(mainItem, true);
          } else if (mainItem.getQuantityDifferenceInformation() == 0 ||
            !Utils.isEmptyString(mainItem.getModificationReason())) {
            me.markInvalidItem(mainItem, false);
          }
        }

        break;
    }

  }
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}