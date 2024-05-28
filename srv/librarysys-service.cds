using my.librarysys as my from '../db/data-model';

@path: '/LibrarySystemSRV'
service CatalogService {
  
    entity Books as projection on my.Books;
    entity users as projection on my.users;
    entity BookLoans as projection on my.BookLoans;
    //entity ReservedBooks as projection on my.ReservedBooks;
}
