/**
 * Created by Tyler on 8/15/2015.
 */
mainApp.factory('BroadcastUtility', function($rootScope)
{
    var service = {};
    service.message = 'init';

    /* * ***** Properties ***** (things to $on)
     * 'Update Grid Broadcasted'
     *
     *
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

    service.broadcastPropertyChanged = function(property, args)
    {
        $rootScope.$broadcast(property, args);
    };

    return service;
});