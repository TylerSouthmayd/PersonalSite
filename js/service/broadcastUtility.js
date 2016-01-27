/**
 * Created by Tyler on 8/15/2015.
 */
mainApp.factory('BroadcastUtility', function($rootScope)
{
    var service = {};
    service.message = 'init';

    /* * ***** Properties ***** (things to $on)
     * 'Update Grid' - grid method/component obj param
     * 'Activate Tab' - tab id param
     * 'Console Message' - msg param
     *
     *
     *
     ** ***** Properties ***** */

    service.updateGrid = function(grid)
    {
        //console.log('grid', grid);

        service.broadcastPropertyChanged('Update Grid', grid);
//        console.log('Update Grid Broadcasted');
    };

    service.toggleNavbar = function()
    {
        //console.log('grid', grid);

        service.broadcastPropertyChanged('Toggle Navbar');
//        console.log('Update Grid Broadcasted');
    };

    service.resetIntro = function()
    {
//        console.log('reset intro');
        service.broadcastPropertyChanged('Reset Intro');
    };

    service.activateTab = function(tab)
    {
//        console.log('tab from service', tab);
        service.broadcastPropertyChanged('Activate Tab', tab);
    };

    service.consoleMessage = function(msg)
    {
//        console.log('msg from service', msg);
        service.broadcastPropertyChanged('Console Message', msg);
    };

    service.broadcastPropertyChanged = function(property, args)
    {
        $rootScope.$broadcast(property, args);
    };

    return service;
});