sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.centrallibrarysystem.controller.Users", {
      onInit: function () {

      },

      onBackBtnPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBooks")
      }

    });
  }
);
