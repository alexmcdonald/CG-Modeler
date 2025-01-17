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
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
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
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function loadForDelete
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function loadForDelete(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = Facade.getObjectAsync(BO_ORDER, jsonQuery)
.then(function (selfJson) {
  me.setProperties(selfJson);
  return Facade.getListAsync("LoOrderItems", me.getQueryBy("orderPkey", me.getPKey()));
})
.then(function (loOrderItemsJson) {
  me.setLoItems(BoFactory.instantiate("LoOrderItems"));
  me.getLoItems().addItems(loOrderItemsJson);
  me.getLoItems().setObjectStatus(STATE.PERSISTED);

  return BoFactory.loadListAsync("LoOrderAttachment", me.getQueryBy("sdoMainPKey", me.getPKey()));
})
.then(function (attachment) {
  me.setLoOrderAttachment(attachment);

  return BoFactory.loadObjectByParamsAsync(BO_ORDERMETA, me.getQueryBy("pKey", me.getSdoMetaPKey()));
})
.then(function (boOrderMeta) {
  me.setBoOrderMeta(boOrderMeta);

  return BoFactory.loadObjectByParamsAsync("LoOrderPayments", me.getQueryBy("sdoMainPKey", me.getPKey()));
})
.then(function (loOrderPayments){
  var jsonParamsForTransactions = [];
  var jsonQueryForTransactions = {};
  if (Utils.isDefined(loOrderPayments))  {
    me.setLoPayments(loOrderPayments);

    var orderPayments = me.getLoPayments().getItems();
    var orderPaymentPkeys = orderPayments.map(function(item){return item.getPKey();});

    jsonParamsForTransactions.push({
      "field" : "orderPaymentPkeys",
      "value" : "'" + orderPaymentPkeys.join("','") + "'"
    });
  }
  if (Utils.isDefined(me.getLoItems()))  {
    var orderItems = me.getLoItems().getItems();
    var orderItemPkeys = orderItems.map(function(item){return item.getPKey();});

    jsonParamsForTransactions.push({
      "field" : "orderItemPkeys",
      "value" : "'" + orderItemPkeys.join("','") + "'"
    });
  }
  if (Utils.isDefined(me.getLoItems())  || Utils.isDefined(loOrderPayments))  {
    jsonQueryForTransactions.params = jsonParamsForTransactions;
    return Facade.getListAsync("LoInventoryTransaction",jsonQueryForTransactions);
  }
}).
then(function (loInventoryTransaction){
  if(Utils.isDefined(loInventoryTransaction)){
    me.setLoInventoryTransactions(BoFactory.instantiateLightweightList("LoInventoryTransaction"));
    me.getLoInventoryTransactions().addItems(loInventoryTransaction);
    me.getLoInventoryTransactions().setObjectStatus(STATE.PERSISTED);
  }
  return BoFactory.loadObjectByParamsAsync("LoSysSignatureBlob", me.getQueryBy("referencePKey", me.getPKey()));
})
.then(function (LoSysSignatureBlob){
  if (Utils.isDefined(LoSysSignatureBlob))  {
    me.setLoSysSignatureBlob(LoSysSignatureBlob);
    var jsonParamsForSignature = [];
    var jsonQueryForSignature = {};
    var signatureBlobs = me.getLoSysSignatureBlob().getItems();

    var referencePKey = signatureBlobs.map(function(item){return item.getSignaturePKey();});


    jsonParamsForSignature.push({
      "field" : "referencePKey",
      "value" : "'" + referencePKey.join("','") + "'"
    });

    jsonQueryForSignature.params = jsonParamsForSignature;

    return Facade.getListAsync("LoSysSignatureAttribute",jsonQueryForSignature);
  }
})
.then(function (LoSysSignatureAttribute){
  if (Utils.isDefined(LoSysSignatureAttribute))  {
    me.setLoSysSignatureAttribute(BoFactory.instantiateLightweightList("LoSysSignatureAttribute"));
    me.getLoSysSignatureAttribute().addItems(LoSysSignatureAttribute);
    me.getLoSysSignatureAttribute().setObjectStatus(STATE.PERSISTED);
  }
  return me;
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}