sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.centrallibrarysystem.controller.SingleBookPage", {
      onInit: function () {
        //var oRouter = this.getOwnerComponent().getRouter();
        //oRouter.getRoute("RouteSingleBookPage").attachPatternMatched(this._onObjectMatched, this);

      },


      onDeclinePress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteSingleUserPage")
      },


      // _onObjectMatched: function (oEvent) {
      //     var sISBN = oEvent.getParameter("arguments").ISBN;
      //     // Bind the view to the book data
      //     this.getView().bindElement({
      //         path: "/Books('" + sISBN + "')"
      //     });
      // }
    });
  }
);
