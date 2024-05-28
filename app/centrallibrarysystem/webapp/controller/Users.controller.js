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

    //   onAllBookListPress: function () {
    //     const oRouter = this.getOwnerComponent().getRouter();
    //     oRouter.navTo("RouteAdmin")
    //   },

      //if yo press on USERS button from booksview then it will routed to UsersPage
      

      onBackBtnPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteUsers")
      }

    });
  }
);
