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
                    this.byId("idBooksTable")
                        .getSelectedItem()
                        .getBindingContext()
                        .getObject()
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
                    //this.getView().byId("idIssueBooks").getBinding("items").refresh();
                    //this.oCreateBooksDialog.close();
                } catch (error) {
                    //this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },


            onReturnBookPress: function () {
                const oView = this.getView();
                const oModel = oView.getModel("ModelV2");
                const aSelectedItems = oView.byId("idUserActiveLoanTable").getSelectedItems();

                if (aSelectedItems.length === 0) {
                    MessageBox.warning("Please select at least one book to return.");
                    return;
                }

                aSelectedItems.forEach(function (oItem) {
                    const oContext = oItem.getBindingContext();
                    const sPath = oContext.getPath();
                    const oBookData = oContext.getObject();

                    //update the book's availability and remove it from the user's active loans
                    oModel.remove(sPath, {
                        success: function () {
                            MessageBox.success(`Book ${oBookData.book.Title} returned successfully.`);
                        },
                        error: function () {
                            MessageBox.error(`Failed to return book ${oBookData.book.Title}.`);
                        }
                    });
                });
                
                // Refresh the total books table
                this._refreshTotalBooksTable();
            },
            _refreshTotalBooksTable: function () {
                const oBooksTable = this.getView().byId("idBooksTable");
                const oBinding = oBooksTable.getBinding("items");

                if (oBinding) {
                    oBinding.refresh();
                }
            },


            //   onPressISBN: async function (oEvent) {
            //       const sISBN = oEvent.getSource().getText();
            //       const oModel = this.getView().getModel();
            //       const sPath = `/Books('${sISBN}')`; // Ensure this path matches your OData service structure

            //       if (!this.oBookPageDialog) {
            //           this.oBookPageDialog = await Fragment.load({
            //               id: this.getView().getId(),
            //               name: "com.app.centrallibrarysystem.fragments.BookPageDialog",
            //               controller: this
            //           });
            //           this.getView().addDependent(this.oBookPageDialog);
            //       }

            //       this.oBookPageDialog.bindElement(sPath);

            //       // Check if the data is loaded
            //       oModel.read(sPath, {
            //           success: function (oData) {
            //               this.oBookPageDialog.open();
            //           }.bind(this),
            //           error: function () {
            //               MessageBox.error("Failed to load book details");
            //           }
            //       });
            //   },

            onDeclinePress: function () {
                if (this.oBookPageDialog && this.oBookPageDialog.isOpen()) {
                    this.oBookPageDialog.close();
                }
            }
        });
    }
);
