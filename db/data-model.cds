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
  BookLoans: Composition of many BookLoans on BookLoans.book = $self;
  Books:Composition of many users on Books.Name;
}

entity users {
  key ID          : UUID;
      Name        : String;
      Email       : String;
      phonenumber : Integer;
      Username    : String;
      Password    : String;
      userType    : String;
      BookLoans:Association to one BookLoans;
      users:Association to one Books;

}

entity BookLoans {
  key ID         : UUID;
      BookID     : UUID;
      UserID     : UUID;
      IssueDate  : Date;
      ReturnDate : Date;
      book:Association to one Books;
      users:Composition of many users on users.BookLoans=$self;
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
