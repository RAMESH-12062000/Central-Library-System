sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/core/Fragment",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function (BaseController, ODataModel, Fragment, MessageBox, MessageToast) {
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
                console.log(
                    this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject()
                );
            
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

                const userModel = new sap.ui.model.json.JSONModel({
                    user12_ID: oSelectedUser.ID,
                    Book12_ID: oSelectedBook.ID,
                    reservedDate: new Date(),
                });
                this.getView().setModel(userModel, "userModel");

                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");

                try {
                    await this.createData(oModel, oPayload, "/IssueingBooks");
                    sap.m.MessageBox.success("Book Reserved");
                } catch (error) {
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },

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

            onDeclinePress: function () {
                if (this.oBookPageDialog && this.oBookPageDialog.isOpen()) {
                    this.oBookPageDialog.close();
                }
            }
        });
    }
);
