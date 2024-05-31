sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel"
  ],
  function (BaseController, ODataModel) {
    "use strict";

    return BaseController.extend("com.app.centrallibrarysystem.controller.SingleUserPage", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);

      },
      onUserDetailsLoad: function (oEvent) {
        const { ID } = oEvent.getParameter("arguments");
        this.id = ID;
        // const sRouterName = oEvent.getParameter("name");
        const oObjectPage = this.getView().byId("ObjectPageLayout");

        oObjectPage.bindElement(`/users(${ID})`);

      },


      onPressISBN: async function (oEvent) {
        const sISBN = oEvent.getSource().getText();
        const oModel = this.getView().getModel();
        const sPath = `/Books('${sISBN}')`;
        if (!this.oBookPageDialog) {
          this.oBookPageDialog = await this.loadFragment("BookPageDialog")
        }
        this.oBookPageDialog.bindElement(sPath);
        this.oBookPageDialog.open()
      },

      onDeclinePress: function () {
        if (this.oBookPageDialog.isOpen()) {
          this.oBookPageDialog.close()
        }
      },


    });
  }
);
