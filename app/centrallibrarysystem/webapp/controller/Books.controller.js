sap.ui.define(
    [
        "./BaseController",
        //"sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/Token",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel"
        ,
    ],
    function (Controller, Filter, FilterOperator, Token, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("com.app.centrallibrarysystem.controller.Books", {
            onInit: function () {
                const oView = this.getView();
                const oMulti1 = oView.byId("idAuthorFilterValue");
                const oMulti2 = oView.byId("idTitleFilterValue");
                const oMulti3 = oView.byId("idISBNFilterValue");

                let validate = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new Token({ key: text, text: text });
                    }
                };
                oMulti1.addValidator(validate);
                oMulti2.addValidator(validate);
                oMulti3.addValidator(validate);

                //For Adding the into Books Table...
                const oLocalModel = new JSONModel({
                    Title: "",
                    Author: "",
                    ISBN: "",
                    Quantity: "",
                });
                this.getView().setModel(oLocalModel, "localModel");
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onBooksListLoad, this);
            },
            //After Adding the Book it will be Fetched in the books...
            onBooksListLoad: function () {
                this.getView().byId("idBooksTable").getBinding("items").refresh();
            },

            //filter when you click on GO..
            onGoPress: function () {
                const oView = this.getView(),
                    oAuthorFilter = oView.byId("idAuthorFilterValue"),
                    oTitleFilter = oView.byId("idTitleFilterValue"),
                    oISBNFilter = oView.byId("idISBNFilterValue"),
                    sAuthor = oAuthorFilter.getTokens(),
                    sTitle = oTitleFilter.getTokens(),
                    sISBN = oISBNFilter.getTokens(),

                    oTable = oView.byId("idBooksTable"),
                    aFilters = [];

                sAuthor.filter((element) => {
                    element ? aFilters.push(new Filter("Author", FilterOperator.EQ, element.getKey())) : "";
                })
                sTitle.filter((element) => {
                    element ? aFilters.push(new Filter("Title", FilterOperator.EQ, element.getKey())) : "";
                })
                sISBN.filter((element) => {
                    element ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, element.getKey())) : "";
                })
                oTable.getBinding("items").filter(aFilters);
            },

            //Clear Filter
            onClearFilterPress: function () {
                const oView = this.getView(),
                    oAuthorFilter = oView.byId("idAuthorFilterValue").removeAllTokens(),
                    oTitleFilter = oView.byId("idTitleFilterValue").removeAllTokens(),
                    oISBNFilter = oView.byId("idISBNFilterValue").removeAllTokens()
            },
            //USERS button for Navigating who Users are there... 
            onUsersPress: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteUsers")
            },

            //button for popup when opens a CreateBookDialog...
            onCreateBtnPress: async function () {
                if (!this.oCreateBookDialog) {
                    this.oCreateBookDialog = await this.loadFragment("CreateBookDialog")
                }
                this.oCreateBookDialog.open()
            },

            //for closing CreateBookDialog...
            onCloseCreateBookDialog: function () {
                if (this.oCreateBookDialog.isOpen()) {
                    this.oCreateBookDialog.close()
                }
            },

            //For adding A new Book To the Library...
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

            //For delete the perticular selected book...
            onCheckDelete: function (oEvent) {
                // debugger;
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    var oBookName = oSelected.getBindingContext().getObject().title;
                    oSelected.getBindingContext().delete("$auto").then(function () {
                        MessageToast.show(oBookName + " SuccessFully Deleted");
                    },
                        function (oError) {
                            MessageToast.show("Deletion Error: ", oError);
                        });
                    this.getView().byId("idBooksTable").getBinding("items").refresh();
                } else {
                    MessageToast.show("Please Select a Book to Delete");
                }
            },


            //For Opens the UpdateBooksDialog ...
            onEditBooksBtnPress: async function () {
                if (!this.oUpdateBooksDialog) {
                    this.oUpdateBooksDialog = await this.loadFragment("UpdateBooksDialog")
                }
                this.oUpdateBooksDialog.open()
            },
            //After Update Opens then edit that books and save it...
            onUpdateBooksPress: async function () {
                if (!this.oUpdateBooksDialog) {
                    this.oUpdateBooksDialog = await this.loadFragment("UpdateBooksDialog")
                }
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    var oAuthorName = oSelected.getBindingContext().getObject().Author
                    var oBookname = oSelected.getBindingContext().getObject().Title
                    var oStock = oSelected.getBindingContext().getObject().Quantity
                    var oISBN = oSelected.getBindingContext().getObject().ISBN

                    const newBookModel = new JSONModel({
                        Author: oAuthorName,
                        Title: oBookname,
                        Quantity: oStock,
                        ISBN: oISBN,
                    });
                    this.getView().setModel(newBookModel, "newBookModel");
                    oUpdateBooksDialog.open()
                } else {
                    MessageToast.show("Select an Item to Edit")
                }

            },



            //for Closing Update Books...
            onCloseUpdateBooksDialog: function () {
                if (this.oUpdateBooksDialog.isOpen()) {
                    this.oUpdateBooksDialog.close()
                }
            },


            //If you press on the ActivLoans button it will prompted a popup withdetails of loans..
            onActiveLoansBtnPress: async function () {
                if (!this.oActiveLoansDialog) {
                    this.oActiveLoansDialog = await this.loadFragment("ActiveLoansDialog")
                }
                this.oActiveLoansDialog.open();
            },
            //close button for ActiveLoans popup closed..
            onCloseActiveLoans: function () {
                if (this.oActiveLoansDialog.isOpen()) {
                    this.oActiveLoansDialog.close()
                }
            },

            //For Issueing Books to User...
            onIssueBooksBtnPress: async function () {
                if (!this.onIssueBooksFragment) {
                    this.onIssueBooksFragment = await this.loadFragment("IssueBooksDialog")
                }
                this.onIssueBooksFragment.open();
            },

            //For Closing Issue Books...
            onCloseIssueBookPress: function () {
                if (this.onIssueBooksFragment.isOpen()) {
                    this.onIssueBooksFragment.close()
                }
            },


            //For Issueing the Book...
            onIssueBookPress: function () {
                var oContext = this.getView().byId("idActiveLoansTable").getBinding("items")
                var oIssueBook = this.getView().getModel("newLoanModel").getData();
                oContext.create(oIssueBook, {
                    success: function () {
                        MessageToast.show("Book created successfully");
                    },
                    error: function () {
                        MessageToast.show("Error creating book");
                    }
                });
                this.oNewLoanDailog.close()
            },

            //Button Reserved Books popup... 
            onReservedBooksBtn: async function () {
                if (!this.onReservedBooks123) {
                    this.onReservedBooks123 = await this.loadFragment("ReservedBooksDialog")
                }
                this.onReservedBooks123.open();
            },
            //For closing ReservedBooks...
            onCloseReservedBooks: function () {
                if (this.onReservedBooks123.isOpen()) {
                    this.onReservedBooks123.close()
                }
            },

            //if you click on UNDO button it will redirect to MAINPAGE...
            onBackBtnPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome")
            },

        });
    }
);
