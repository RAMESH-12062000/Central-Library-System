sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/centrallibraryfiorielements/test/integration/FirstJourney',
		'com/app/centrallibraryfiorielements/test/integration/pages/BooksList',
		'com/app/centrallibraryfiorielements/test/integration/pages/BooksObjectPage',
		'com/app/centrallibraryfiorielements/test/integration/pages/BookLoansObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage, BookLoansObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/centrallibraryfiorielements') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage,
					onTheBookLoansObjectPage: BookLoansObjectPage
                }
            },
            opaJourney.run
        );
    }
);