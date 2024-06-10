sap.ui.define(
    [
        "./BaseController",
        //"sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/Token",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast"
        ,
    ],
    function (Controller, Filter, FilterOperator, Token, MessageBox, JSONModel, MessageToast) {
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
                    Language: "",
                    Quantity: "",
                    Availability: ""
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

                // Validate required fields
                if (!oPayload.Title || !oPayload.Author || !oPayload.ISBN ) {
                    MessageBox.error("Please enter all required fields.");
                    return;
                }

                // Check if the book already exists in the library
                const aFilters = [
                    new Filter("Title", FilterOperator.EQ, oPayload.Title),
                    new Filter("ISBN", FilterOperator.EQ, oPayload.ISBN),
                    new Filter("Author", FilterOperator.EQ, oPayload.Author)
                ];

                try {
                    const aFilterPromises = aFilters.map(oFilter =>
                        new Promise((resolve, reject) => {
                            oModel.read("/Books", {
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

                    const [bTitleExists, bISBNExists, bAuthorExists] = await Promise.all(aFilterPromises);
                    if (bTitleExists || bISBNExists || bAuthorExists) {
                        MessageBox.error("Title, ISBN, or Author already exists in the Library. Please Check it Once...");
                        return;
                    }

                    // Set availability equal to quantity
                    oPayload.Availability = oPayload.Quantity;
                    this.getView().getModel("localModel").setData(oPayload);

                    // Create the new book
                    await this.createData(oModel, oPayload, "/Books");
                    this.getView().byId("idBooksTable").getBinding("items").refresh();
                    this.oCreateBookDialog.close();
                    MessageToast.show("Book created successfully");
                } catch (error) {
                    this.oCreateBookDialog.close();
                    MessageBox.error("Some technical issue occurred.");
                }
            },

            // onCreateBook: async function () {
            //     const oPayload = this.getView().getModel("localModel").getProperty("/"),
            //         oModel = this.getView().getModel("ModelV2");
            //     oPayload.Availability = oPayload.Quantity;
            //     this.getView().getModel("localModel").setData(oPayload);

            //     try {
            //         await this.createData(oModel, oPayload, "/Books");
            //         this.getView().byId("idBooksTable").getBinding("items").refresh();
            //         this.oCreateBookDialog.close();
            //     } catch (error) {
            //         this.oCreateBookDialog.close();
            //         MessageBox.error("Some technical Issue");
            //     }
            // },

            //For delete the perticular selected book...
            onCheckDelete: function (oEvent) {
                //MessageToast.show("Book updated successfully");
                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    var oBookName = oSelected.getBindingContext().getObject().title;
                    oSelected.getBindingContext().delete("$auto").then(function () {
                        MessageToast.show("Selected Book SuccessFully Deleted..!");
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

                var oSelected = this.byId("idBooksTable").getSelectedItem();
                if (oSelected) {
                    debugger
                    var oID = oSelected.getBindingContext().getObject().ID
                    var oAuthorName = oSelected.getBindingContext().getObject().Author
                    var oBookname = oSelected.getBindingContext().getObject().Title
                    var oQuantity = oSelected.getBindingContext().getObject().Quantity
                    var oAvailability = oSelected.getBindingContext().getObject().Availability
                    var oLanguage = oSelected.getBindingContext().getObject().Language
                    var oISBN = oSelected.getBindingContext().getObject().ISBN

                    const oNewBookModel = new JSONModel({
                        ID: oID,
                        Author: oAuthorName,
                        Title: oBookname,
                        ISBN: oISBN,
                        Language: oLanguage,
                        Quantity: oQuantity,
                        Availability: oAvailability,

                    });
                    this.getView().setModel(oNewBookModel, "newBookModel");
                    if (!this.oUpdateBooksDialog) {

                        this.oUpdateBooksDialog = await this.loadFragment("UpdateBooksDialog"); // Load your fragment asynchronously
                    }
                    this.oUpdateBooksDialog.open();
                }else{
                    MessageToast.show("Please select a Book to Edit..!");
                }
            },
            //After Update Opens then edit that books and save it...
            onUpdateBooksPress: async function () {
                debugger
                const oPayload = this.getView().getModel("newBookModel").getData();
                var AQ1 = oPayload.Availability;
                var Q1 = parseInt(oPayload.Quantity);
                if (AQ1 > Q1){
                    var A2 = A1 - Q1;
                    var AQ2 = A1 - A2;
                    oPayload.Availability = AQ2;
                    this.getView().getModel("newBookModel").setData(oPayload);
                } else if (AQ1 < Q1) {
                    var A2 = Q1 - AQ1;
                    var B2 = AQ1 + A2;
                    oPayload.Availability = B2;
                    this.getView().getModel("newBookModel").setData(oPayload);
                }
                var oDataModel = this.getOwnerComponent().getModel("ModelV2");
                //console.log(oDataModel.getMetadata().getName());

                try {
                    // Assuming your update method is provided by your OData V2 model
                    oDataModel.update("/Books(" + oPayload.ID + ")", oPayload, {
                      success: function () {
                        this.getView().byId("idBooksTable").getBinding("items").refresh();
                        // MessageToast.show("Edited successful!");
                        this.oUpdateBooksDialog.close();
                      }.bind(this),
                      error: function (oError) {
                        this.oUpdateBooksDialog.close();
                        sap.m.MessageBox.error("Failed to update book: " + oError.message);
                      }.bind(this)
                    });
                  } catch (error) {
                    this.oUpdateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                  }
                // const sPath = "/Books";
                // const oModel = this.getView().getModel("ModelV2");

                // try {
                //     await this.updateData(oModel, oPayload, sPath);
                //     this.getView().byId("idBooksTable").getBinding("items").refresh();
                //     this.oUpdateBooksDialog.close();
                //     MessageToast.show("Book updated successfully");
                // } catch (error) {
                //     MessageBox.error("Failed to update the book");
                // }
                // var oDataModel = new sap.ui.model.odata.v2.ODataModel({
                //     serviceUrl: "https://port4004-workspaces-ws-xm82l.us10.trial.applicationstudio.cloud.sap/odata/v2/LibrarySystemSRV/",
                //     defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
                //     // Configure message parser
                //     messageParser: sap.ui.model.odata.ODataMessageParser
                // })
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

            onClearLoanPress: function (oEvent) {
                const oItem = oEvent.getSource().getParent();
                const oContext = oItem.getBindingContext();
                const sPath = oContext.getPath();
                const oModel = this.getView().getModel("ModelV2");
                const oBookData = oContext.getObject();

                MessageBox.confirm(
                    `Are you sure you want to delete the loan for book '${oBookData.book.Title} '?`,
                    {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (sAction) {
                            if (sAction === MessageBox.Action.YES) {
                                debugger
                                oModel.remove(sPath, {
                                    success: function () {
                                        MessageBox.success(`Loan for book '${oBookData.book.Title}' deleted successfully.`);
                                    },
                                    error: function () {
                                        MessageBox.error(`Failed to delete loan for book '${oBookData.book.Title}'.`);
                                    }
                                });
                                this.getView().byId("myTable").getBinding("items").refresh();
                            }
                        }
                    }
                );
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

            onAcceptButtonIssueBookPress: async function (oEvent) {
                if (this.byId("idIssueBooksTable").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Book");
                    return
                }
                var oSelectedBook = this.byId("idIssueBooksTable").getSelectedItem().getBindingContext().getObject()
                console.log(oSelectedBook)
                var oAvailability = parseInt(oSelectedBook.Book12.Availability) - 1
                debugger
                const userModel = new sap.ui.model.json.JSONModel({
                    user_ID: oSelectedBook.user12.ID,
                    book_ID: oSelectedBook.Book12.ID,
                    IssueDate: new Date(),
                    ReturnDate: new Date(),
                    book: {
                        Availability: oAvailability
                    }
                });
                this.getView().setModel(userModel, "userModel");

                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");

                try {
                    await this.createData(oModel, oPayload, "/BookLoans");
                    sap.m.MessageBox.success("Book Accepted");
                } catch (error) {
                    sap.m.MessageBox.error("Some technical Issue");
                }
            },
            //For Closing Issue Books...
            onCancleIssueBookPress: function () {
                if (this.onIssueBooksFragment.isOpen()) {
                    this.onIssueBooksFragment.close()
                }
            },

            // onIssueBookPress: function () {
            //     debugger

            //     const oLocalModel345 = new JSONModel({
            //         Title: "",
            //         Author: "",
            //         ISBN: "",
            //         Quantity: "",
            //         user_ID: "",
            //         book_ID: ""
            //     });
            //     //var oContext = this.getView().byId("idActiveLoansTable").getBinding("items")
            //     const oLocalModel = this.getView().getModel("localModelIssue");
            //     const oIssueData = {
            //         BookID: oLocalModel345.getProperty("/book_ID"),
            //         UserID: oLocalModel345.getProperty("/user_ID"),
            //         IssueDate: new Date(),
            //         ReturnDate: null // Set the appropriate return date or null
            //     };

            //     const oModel = this.getView().getModel("ModelV2");
            //     oModel.create("/BookLoans", oIssueData, {
            //         success: () => {
            //             MessageToast.show("Book issued successfully");
            //             // Refresh the view to reflect the issued book in active loans and borrowed books
            //             this.onBooksListLoad();
            //         },
            //         error: () => {
            //             MessageToast.show("Error issuing book");
            //         }
            //     });
            //     this.onIssueBooksFragment.close();
            // },


            handlePopoverPress:  function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
    
                // create popover
                if (!this._pPopover) {
                    this._pPopover =  this.loadFragment("ReturnedBooksDialog").then(function(oPopover) {
                        oView.addDependent(oPopover);
                        oPopover.bindElement("");
                        return oPopover;
                    });
                }
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            //Button Reserved Books popup... 
            // onReturnedBooksBtnPress: async function () {
            //     if (!this.onReturnedBooks123) {
            //         this.onReturnedBooks123 = await this.loadFragment("ReturnedBooksDialog")
            //     }
            //     this.onReturnedBooks123.open();
            // },
            //For closing ReservedBooks...
            onCloseReturnBooksPress: function () {
                if (this.onReturnedBooks123.isOpen()) {
                    this.onReturnedBooks123.close()
                }
            },

            //if you click on UNDO button it will redirect to MAINPAGE...
            onBackBtnPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome")
            },

            
            // onRefreshBtnPress:function(){
            //     this.getView().byId("idBooksTable").getBinding("items").refresh();
            // }

        });
    }
);
