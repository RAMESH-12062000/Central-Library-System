sap.ui.define([
    "./BaseController",
    //"sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("com.app.centrallibrarysystem.controller.Home", {
            onInit: function () {
                var oModel = new ODataModel("/v2/LibrarySystemSRV/");
                this.getView().setModel(oModel);

            },

            //if you press the Login opens the login page..
            onLoginDialogPress: async function () {
                if (!this.onLoginDialog) {
                    this.onLoginDialog = await this.loadFragment("LoginDialog")
                }
                this.onLoginDialog.open()
            },
            
            //After login popup it will Navigates the through the credentials...
            onLoginPress: function () {
                //const oRouter = this.getOwnerComponent().getRouter();
                //oRouter.navTo("RouteSingleUserPage")
                var oView = this.getView();
                var sUsername = oView.byId("idUsernameInput").getValue();
                var sPassword = oView.byId("idPasswordInput").getValue();
                var oModel = this.getView().getModel();
                //var aUsers = oModel.getProperty("/users");

                var aFilters =[
                    new Filter("Username", FilterOperator.EQ, sUsername),
                    new Filter("Password", FilterOperator.EQ, sPassword),
                ];

                oModel.read("/users",{
                    filters: aFilters,
                    success: function(oData){
                        if(oData.results.length > 0){
                            var oUser = oData.results[0];
                            var userid = oUser.ID;
                            MessageToast.show("Login successful!");

                            if(oUser.userType === "admin"){
                                this.getOwnerComponent().getRouter().navTo("RouteBooks",{id:userid});
                            } else if (oUser.userType === "member"){
                                this.getOwnerComponent().getRouter().navTo("RouteSingleUserPage",{id:userid})
                            }

                            this.onCloseLoginDialog();
                        } else{
                            MessageToast.show("Invalid username or password.");
                        }
                    }.bind(this),
                    error:function(oError){
                        MessageToast.show("Error during login process.");
                    }
                });
            },

            //In the HomePage,this closing button for LOGIN DIALOG...
            onCloseLoginDialog: function () {
                if (this.onLoginDialog.isOpen()) {
                    this.onLoginDialog.close()
                }
            },
            //This is for REGISTER Open...
            onRegisterUserPress: async function () {
                if (!this.oRegisterUserPress) {
                    this.oRegisterUserPress = await this.loadFragment("RegisterUserDialog")
                }
                this.oRegisterUserPress.open()
            },
            //This is for REGISTER Close...
            onCloseRegisterSubmitDialog: function () {
                if (this.oRegisterUserPress.isOpen()) {
                    this.oRegisterUserPress.close()
                }
            },

            onCreateBook: async function () {
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                try {  
                    await this.createData(oModel, oPayload, "/Books");
                    this.getView().byId("idBooksTable").getBinding("items").refresh();
                    this.oCreateBookDialog.close();
                } catch (error) {
                    this.oCreateBookDialog.close();
                    MessageBox.error("Some technical Issue");
                }

            },

        });
    });