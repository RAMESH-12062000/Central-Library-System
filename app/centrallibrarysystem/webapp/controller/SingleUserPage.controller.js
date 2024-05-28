sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.centrallibrarysystem.controller.SingleUserPage", {
      onInit: function () {

      },
      onPressISBN: function (oEvent) {
        var oSource = oEvent.getSource();
        var sISBN = oSource.getText();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteSingleBookPage", { ISBN: sISBN });
      },
    });
  }
);
