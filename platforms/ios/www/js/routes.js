var routes = angular.module('HT.routes', []);
routes.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("tab", {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html",
        })
        .state('tab.home', {
            url: '/home',
            cache:'false',
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab-home.html',
                    controller:"homeCtrl",
                    reload:true,
                }
            }
        })
        .state('tab.fund', {
            url: '/fund',
            cache:'false',
            views: {
                'tab-fund': {
                    templateUrl: 'templates/tab-fund.html',
                    controller:"fundCtrl",
                    reload:true,
                }
            }
        })
        .state('tab.property', {
            url: '/property',
            cache:'false',
            views: {
                'tab-property': {
                    templateUrl: 'templates/tab-property.html',
                    controller:"propertyCtrl",
                    reload:true,
                }
            },
        })




    $urlRouterProvider.otherwise("/tab/home");
});
