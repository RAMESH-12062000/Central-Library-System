sap.ui.define([
    "./BaseController",
    //"sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
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
                
                //this is model for creating the new User...
                const oLocalModel1 = new  sap.ui.model.json.JSONModel({
                    Name : "",
                    Email:"",
                    Username: "",
                    phonenumber:"",
                    Password: "",
                    userType: "member",
                   
                  });
                  this.getView().setModel(oLocalModel1, "localModel2");

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

                var aFilters = [
                    new Filter("Username", FilterOperator.EQ, sUsername),
                    new Filter("Password", FilterOperator.EQ, sPassword),
                ];

                oModel.read("/users", {
                    filters: aFilters,
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            var oUser = oData.results[0];
                            var userid = oUser.ID;
                            MessageToast.show("Login successful!");

                            if (oUser.userType === "admin") {
                                this.getOwnerComponent().getRouter().navTo("RouteBooks", { ID: userid });
                            } else if (oUser.userType === "member") {
                                this.getOwnerComponent().getRouter().navTo("RouteSingleUserPage", { ID: userid })
                            }

                            this.onCloseLoginDialog();
                        } else {
                            MessageToast.show("Invalid username or password.");
                        }
                    }.bind(this),
                    error: function (oError) {
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
            onSignUpUserPress: async function () {
                if (!this.oRegisterUserPress) {
                    this.oRegisterUserPress = await this.loadFragment("RegisterUserDialog")
                }
                this.oRegisterUserPress.open()
            },

            //for Creating New User...
            onSubmitPress: async function () {
                debugger;
                // Get Payload from localModel2
                const oPayload = this.getView().getModel("localModel2").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                
                // Check if username and password are provided
                if (!oPayload.Username || !oPayload.Password) {
                    sap.m.MessageBox.error("Please enter valid Username and Password");
                    return;
                }

                // Validate email and phone number
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
                var phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
                if (!(emailRegex.test(oPayload.Email) && phoneRegex.test(oPayload.phonenumber))) {
                    MessageToast.show("Please enter valid email and phone number");
                    return;
                }

                // Check if username, email, or phone number already exist
                const aFilters = [
                    new Filter("Username", FilterOperator.EQ, oPayload.Username),
                    new Filter("Email", FilterOperator.EQ, oPayload.Email),
                    new Filter("phonenumber", FilterOperator.EQ, oPayload.phonenumber)
                ];

                const aFilterPromises = aFilters.map(oFilter => 
                    new Promise((resolve, reject) => {
                        oModel.read("/users", {
                            filters: [oFilter],
                            success: function (oData) {
                                if (oData.results.length > 0) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            },
                            error: function (oError) {
                                reject(oError);
                            }
                        });
                    })
                );

                try {
                    const [bUsernameExists, bEmailExists, bPhoneExists] = await Promise.all(aFilterPromises);
                    if (bUsernameExists) {
                        sap.m.MessageBox.error("Username is already used. Please enter a valid username.");
                        return;
                    }
                    if (bEmailExists) {
                        sap.m.MessageBox.error("Email is already used. Please enter a valid email.");
                        return;
                    }
                    if (bPhoneExists) {
                        sap.m.MessageBox.error("Phone number is already used. Please enter a valid phone number.");
                        return;
                    }

                    // Create new user if all checks pass
                    await this.createData(oModel, oPayload, "/users");
                    this.oRegisterUserPress.close();
                    MessageToast.show("Your Details registered successfully");
                } catch (error) {
                    this.oRegisterUserPress.close();
                    sap.m.MessageBox.error("Some technical issue occurred,");
                }
            },



            //This is for REGISTER Close...
            onCloseRegisterSubmitDialog: function () {
                if (this.oRegisterUserPress.isOpen()) {
                    this.oRegisterUserPress.close()
                }
            },
    
        });
    });