sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/core/Fragment",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    function (BaseController, ODataModel, Fragment, MessageBox, MessageToast, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.app.centrallibrarysystem.controller.SingleUserPage", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);
            },
            onUserDetailsLoad: function (oEvent) {
                const { ID } = oEvent.getParameter("arguments");
                this.id = ID;
                const oObjectPage = this.getView().byId("ObjectPageLayout");
                oObjectPage.bindElement(`/users(${ID})`);
            },


            onReserveBookPress: async function (oEvent) {
                //console.log(this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject());

                if (this.byId("idBooksTable").getSelectedItems().length === 0) {
                    MessageToast.show("Please Select at least one Book Reserve..!");
                    return;
                }
            
                var oSelectedItem = oEvent.getSource().getParent();
                console.log(oSelectedItem);
                console.log(oEvent.getSource().getBindingContext().getObject());
                console.log(oEvent.getParameters());
                var oSelectedUser = oSelectedItem.getBindingContext().getObject();
            
                if (this.byId("idBooksTable").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Book");
                    return;
                }
                var oSelectedBook = this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject();
                console.log(oSelectedBook);
            
                const oModel = this.getView().getModel("ModelV2");
            
                // Check if the book is already reserved by the user
                const aFilters = [
                    new Filter("user12_ID", FilterOperator.EQ, oSelectedUser.ID),
                    new Filter("Book12_ID", FilterOperator.EQ, oSelectedBook.ID)
                ];
            
                const aExistingReservations = await new Promise((resolve, reject) => {
                    oModel.read("/IssueingBooks", {
                        filters: aFilters,
                        success: function (oData) {
                            resolve(oData.results);
                        },
                        error: function (oError) {
                            reject(oError);
                        }
                    });
                });
            
                if (aExistingReservations.length > 0) {
                    MessageBox.error("You have already reserved this book.");
                    return;
                }
            
                const userModel = new sap.ui.model.json.JSONModel({
                    user12_ID: oSelectedUser.ID,
                    Book12_ID: oSelectedBook.ID,
                    reservedDate: new Date(),
                });
                this.getView().setModel(userModel, "userModel");
            
                const oPayload = this.getView().getModel("userModel").getProperty("/");
            
                try {
                    await this.createData(oModel, oPayload, "/IssueingBooks");
                    MessageBox.success("Book Reserved Successfully..!");
                } catch (error) {
                    MessageBox.error("Some Technical Issue.");
                }
            },


            // onReserveBookPress: async function (oEvent) {
            //     console.log(
            //         this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject()
            //     );
            
            //     var oSelectedItem = oEvent.getSource().getParent();
            //     console.log(oSelectedItem);
            //     console.log(oEvent.getSource().getBindingContext().getObject());
            //     console.log(oEvent.getParameters());
            //     var oSelectedUser = oSelectedItem.getBindingContext().getObject();
                
            //     if (this.byId("idBooksTable").getSelectedItems().length > 1) {
            //         MessageToast.show("Please Select only one Book");
            //         return;
            //     }
            //     var oSelectedBook = this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject();
            //     console.log(oSelectedBook);

            //     const userModel = new sap.ui.model.json.JSONModel({
            //         user12_ID: oSelectedUser.ID,
            //         Book12_ID: oSelectedBook.ID,
            //         reservedDate: new Date(),
            //     });
            //     this.getView().setModel(userModel, "userModel");

            //     const oPayload = this.getView().getModel("userModel").getProperty("/"),
            //         oModel = this.getView().getModel("ModelV2");

            //     try {
            //         await this.createData(oModel, oPayload, "/IssueingBooks");
            //         sap.m.MessageBox.success("Book Reserved");
            //     } catch (error) {
            //         sap.m.MessageBox.error("Some technical Issue");
            //     }
            // },

            onReturnBookPress: async function () {
                const oView = this.getView();
                const aSelectedItems = oView.byId("idUserActiveLoanTable").getSelectedItems();

                if (aSelectedItems.length === 0) {
                    MessageBox.warning("Please select at least one book to return.");
                    return;
                }

                for (const oItem of aSelectedItems) {
                    const oContext = oItem.getBindingContext();
                    const oBookData = oContext.getObject();

                    const userModel = new sap.ui.model.json.JSONModel({
                        user14_ID: oBookData.ID,
                        book14_ID: oBookData.book.ID,
                        ReturnDate: new Date(),
                    });
                    oView.setModel(userModel, "userModel");

                    const oPayload = oView.getModel("userModel").getProperty("/"),
                        oModel = oView.getModel("ModelV2");

                    try {
                        await this.createData(oModel, oPayload, "/ReturnedBooks");
                        sap.m.MessageBox.success(`Book ${oBookData.book.Title} returned successfully.`);
                    } catch (error) {
                        sap.m.MessageBox.error(`Failed to return book ${oBookData.book.Title}.`);
                    }
                }

                //this._refreshTotalBooksTable();
            },

            // _refreshTotalBooksTable: function () {
            //     const oBooksTable = this.getView().byId("idBooksTable");
            //     const oBinding = oBooksTable.getBinding("items");

            //     if (oBinding) {
            //         oBinding.refresh();
            //     }
            // },


            onSearchBooksFromTable: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new Filter("Author", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("Title", FilterOperator.Contains, sQuery));
                    aFilters.push(new Filter("ISBN", FilterOperator.Contains, sQuery));

                    var oFinalFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });

                    this.getView().byId("idBooksTable").getBinding("items").filter(oFinalFilter);
                } else {
                    this.getView().byId("idBooksTable").getBinding("items").filter([]);
                }
            },

            onDeclinePress: function () {
                if (this.oBookPageDialog && this.oBookPageDialog.isOpen()) {
                    this.oBookPageDialog.close();
                }
            },

            onLogoutBtnPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome", {}, true)
            },
        });
    }
);
