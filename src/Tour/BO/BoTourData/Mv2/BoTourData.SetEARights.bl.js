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
 * @function setEARights
 * @this BoTourData
 * @kind businessobject
 * @namespace CORE
 */
function setEARights(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
    var acl = me.getACL();
    var considerVehicleStatus = me.getConsiderVehicleStatus();

    if (Utils.isDefined(considerVehicleStatus)) {
      considerVehicleStatus = considerVehicleStatus.toLowerCase();
    }

    if(me.getActualStartDate() === Utils.getMinDateAnsi()) {
        acl.removeRight(AclObjectType.PROPERTY, "actualStartDate", AclPermission.VISIBLE);
        acl.removeRight(AclObjectType.PROPERTY, "actualStartTime", AclPermission.VISIBLE);
    } else {
      acl.addRight(AclObjectType.PROPERTY, "actualStartDate", AclPermission.VISIBLE);
      acl.addRight(AclObjectType.PROPERTY, "actualStartTime", AclPermission.VISIBLE);
    } 
    if(me.getActualEndDate() === Utils.getMinDateAnsi()) {
        acl.removeRight(AclObjectType.PROPERTY, "actualEndDate", AclPermission.VISIBLE);
        acl.removeRight(AclObjectType.PROPERTY, "actualEndTime", AclPermission.VISIBLE);
    } else {
      acl.addRight(AclObjectType.PROPERTY, "actualEndDate", AclPermission.VISIBLE);
      acl.addRight(AclObjectType.PROPERTY, "actualEndTime", AclPermission.VISIBLE);
    }

    if (considerVehicleStatus == "no") {
      acl.removeRight(AclObjectType.PROPERTY, "vehicleOkStart", AclPermission.VISIBLE);
      acl.removeRight(AclObjectType.PROPERTY, "vehicleStatusStart", AclPermission.VISIBLE);
    }

    // odometerEnd will be disabled always in the current release.
    acl.removeRight(AclObjectType.PROPERTY, "odometerEnd", AclPermission.EDIT);

    var tourStatus = me.getTourStatus().toLowerCase();
    if (tourStatus === "completed" || tourStatus === "canceled") {
      acl.removeRight(AclObjectType.OBJECT, "BoTourData", AclPermission.EDIT);
    } else {
      acl.addRight(AclObjectType.OBJECT, "BoTourData", AclPermission.EDIT);
      if (tourStatus === "initial" || tourStatus === "open") {
        acl.removeRight(AclObjectType.PROPERTY, "startDate", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "startTime", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "endDate", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "endTime", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "luStartWarehouse", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "luEndWarehouse", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "luCoDriver", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "luTruck", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "luTrailer1", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "luTrailer2", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "odometerStart", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "vehicleOkStart", AclPermission.EDIT);
        acl.removeRight(AclObjectType.PROPERTY, "vehicleStatusStart", AclPermission.EDIT);
      }
  
      if (tourStatus === "running") {
        if(me.getStartTourActivitiesCompleted() == 0){
          acl.addRight(AclObjectType.PROPERTY, "startDate", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "startTime", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "endDate", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "endTime", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "luStartWarehouse", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "luEndWarehouse", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "luCoDriver", AclPermission.EDIT);
          if (me.getLuTemplate().considerMultipleWarehouses == 0) {
            acl.removeRight(AclObjectType.PROPERTY,"luEndWarehouse",AclPermission.EDIT);
          }
          acl.addRight(AclObjectType.PROPERTY, "luTruck", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "luTrailer1", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "luTrailer2", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "odometerStart", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "vehicleOkStart", AclPermission.EDIT);
          acl.addRight(AclObjectType.PROPERTY, "vehicleStatusStart", AclPermission.EDIT);
        
        }
        else{
          acl.removeRight(AclObjectType.PROPERTY, "startDate", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "startTime", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "endDate", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "endTime", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "luStartWarehouse", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "luEndWarehouse", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "luCoDriver", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "luTruck", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "luTrailer1", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "luTrailer2", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "odometerStart", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "vehicleOkStart", AclPermission.EDIT);
          acl.removeRight(AclObjectType.PROPERTY, "vehicleStatusStart", AclPermission.EDIT);
        }
      }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}