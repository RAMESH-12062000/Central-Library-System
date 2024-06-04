namespace my.librarysys;

using {cuid} from '@sap/cds/common';


entity Books : cuid {
      Title        : String;
      Author       : String;
      ISBN         : String;
      Quantity     : Integer;
      Availability : String;
      Language     : String;
      users        : Association to users;
      BookLoan_ID  : Composition of many BookLoans
                           on BookLoan_ID.book = $self;
//   Book        : Composition of many users
//                    on Book.Name;
}

entity users {
      key ID          : UUID;
          Name        : String;
          Email       : String;
          phonenumber : String;
          Username    : String;
          Password    : String;
          userType    : String;
          BookLoans   : Association to many BookLoans
                              on BookLoans.user = $self;
          IssueingBooks:Association to many IssueingBooks on IssueingBooks.user12=$self;
//users:Association to one Books;

}

entity BookLoans : cuid {
      IssueDate  : Date;
      ReturnDate : Date;
      book       : Association to one Books;
      user       : Association to one users;

// BookID     : UUID;
// UserID     : UUID;
}

entity IssueingBooks : cuid {
      Book12:Association to Books;
      user12: Association to users;
      reservedDate:Date;
      
}


// entity ReservedBooks : cuid {
//   BookName     : String;
//   ISBN         : String;
//   PersonName   : String;
//   PersonUserId : String;
//   IssueDate    : String;
//   ReturnDate   : String;
//   BookId       : String;

// }
