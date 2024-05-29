sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.centrallibrarysystem.controller.SingleUserPage", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);

      },
      // onUserDetailsLoad: function (oEvent) {
      //   debugger
      //   const { ID } = oEvent.getParameter("arguments");
      //   this.id = ID;
      //   // const sRouterName = oEvent.getParameter("name");
      //   const oObjectPage = this.getView().byId("ObjectPageLayout");

      //   oObjectPage.bindElement(`/users(${ID})`);
      // },








      onPressISBN: function (oEvent) {
        var oSource = oEvent.getSource();
        var sISBN = oSource.getText();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteSingleBookPage", { ISBN: sISBN });
      },
    });
  }
);
