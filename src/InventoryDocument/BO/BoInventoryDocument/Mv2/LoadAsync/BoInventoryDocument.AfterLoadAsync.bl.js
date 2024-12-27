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
 * @function afterLoadAsync
 * @this BoInventoryDocument
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context) {
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Function Summary:
     *  - Setting the Description Text using in the UI title
     *  - Handling of prepopulated items
     *  - Create unit information string for main items
     *  - Filtering main list to isOrderUnit
     */
    var jqueryParams = [];
    var jqueryQuery = {};
    jqueryParams.push({
        "field": "commitDate",
        "value": me.getOrderDate()
    });

    jqueryParams.push({
        "field": "orderId",
        "value": me.getPKey()
    });

    jqueryQuery.params = jqueryParams;


    var promise = BoFactory.createObjectAsync(
        "BoHelperSimplePricingCalculator",
        {}
    ).then(function (calculator) {
        
        //Set pricing handler
        me.setSimplePricingCalculator(calculator);

        //loading main list (left side of UI screen)
        //This list is used for saving changes
        return  BoFactory.loadListAsync(LO_INVENTORYDOCUMENTITEMS, jqueryQuery).then(
            function (loItemsMainList) {
    
                me.setLoItemsMainList(loItemsMainList);
                me.addItemChangedEventListener('loItemsMainList', me.onInventoryDocumentItemChanged);
    
                //loading detail list (right side of the UI screen)
                //this list is only used to show details in the UI
                //the main list and the item list is linked (see addWeakReferencedItems in function FillUnitOfMeasureList)
                //That weak linking means changes done in the detail list are synchronized with the main list
                //No need to load this list from DB because needed items are coppied over from main list
                return BoFactory.createListAsync(LO_INVENTORYDOCUMENTITEMS, {}).then(
                    function (loItemsUnitOfMeasureList) {
                        loItemsUnitOfMeasureList.orderBy({ "sort": "ASC" });
                        me.setLoItemsUnitOfMeasureList(loItemsUnitOfMeasureList);
    
                        //set description used for UI title binding
                        me.fillDescription();
    
                        //set pKey for prepopulated UoM items (are not stored in DB)
                        //set object status to new that propopulated items are not saved
                        var loItemsMainList = me.getLoItemsMainList();
                        var mainListItems = loItemsMainList.getAllItems();
                        loItemsMainList.suspendListRefresh();
    
                        var currentProduct = "";
                        var currentMainItem = "";
    
                        mainListItems.forEach(item => {
    
                            //set pKey if item was prepopulated by Datasource
                            if (item.getIsAddedMissingUoMItem() == "1") {
                                item.setPKey(PKey.next());
                                item.setObjectStatus(mainItem.self.STATE_NEW);
                            }
    
                            //set main item link for non-main items
                            //this will only work if list is ordered by isOrderUnit (main items first)
                            if (item.getProductId() === currentProduct) {
                                if (item.getIsOrderUnit() == "0" &&
                                    !Utils.isEmptyString(currentMainItem)) {
                                    item.setMainItemReference(currentMainItem);
                                }
                            } else {
                                currentProduct = item.getProductId();
                                if (item.getIsOrderUnit() == '1') {
                                    item.setMainItemReference(item.getPKey());
                                    currentMainItem = item.getPKey();
                                }
                            }

                        //set order item fields according to presetting policy
                        if (me.getDocumentType() === "ProductCheckOut" && me.getBoOrderTemplate().getCheckOutType() === "SKU Check-Out") {
                            switch (me.getBoOrderTemplate().getItemPresettingPolicy()) {

                                //The system shows no line items, the user has to add / scan all products manually
                                case "BlindMode":
                                    AppLog.error("'Blind Mode' is not supported for inventory checkout documents. Please set the 'Item Presetting Policy' of the order template to 'Prepopulated'.");
                                    break;

                                //Non-blind mode: The system shows the line item with the expected quantity
                                case "NonBlindMode":
                                    AppLog.error("'Non Blind Mode' is not supported for inventory checkout documents. Please set the 'Item Presetting Policy' of the order template to 'Prepopulated'.");
                                    break;


                                // User needs to update only the quantities for products with deviations to the expected 
                                case "Prepopulated":
                                    //for added UoM item no prepopulation needed
                                    //if targetQuantity = suggestedQuantity then item qunatity was changed manually by user
                                    if (item.getIsAddedMissingUoMItem() == "0" &&
                                        (item.getTargetQuantity() != item.getSuggestedQuantity()) &&
                                        item.getQuantity() != item.getTargetQuantity()) {
                                        item.setQuantity(item.getTargetQuantity());
                                    }
                                    //calculate item difference because there can exist items with quantity != 0
                                    me.calculateItemDifference(item);
                                    break;
                            }

                            me.calculateItemValue(item, me.getBoOrderTemplate());
                        }
                        });
                        loItemsMainList.resumeListRefresh(true);
    
                        //create main item unit information
                        me.createDisplayInformationForMainItemList(mainListItems);
    
                        //show only the main items
                        loItemsMainList.setFilter("isOrderUnit", "1", "EQ");
    
                        //EA Right handling
                        me.setEARights();

                        me.calculateInventoryDocumentValue().then(function () {
                            me.setCalculationStatus("1");
                          });
                        return me;
                    }
                );
            }
        );;
    })
    
   

    // Set InventoryReferenceIds
    me.setInventoryReferenceIds();

    // Set inventory search keys for item meta and payment metas
    me.getBoOrderTemplate().setIvcSearchKeysForItemMetas(
        me.getOrderAccountId(),
        me.getInventoryReference1Id(),
        me.getInventoryReference2Id(),
        me.getInventoryReference3Id(),
        me.getInventoryReference4Id(),
        me.getInventoryReference5Id()
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}