sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.app.centrallibraryfiorielements',
            componentId: 'BookLoansObjectPage',
            contextPath: '/Books/BookLoan_ID'
        },
        CustomPageDefinitions
    );
});