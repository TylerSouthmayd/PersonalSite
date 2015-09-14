/**
 * Created by Tyler on 7/26/2015.
 */
mainApp.factory('CommandDataSource', CommandDataSource);

function CommandDataSource($http)
{
    var factory = {};
    var urlBase = '../../php/json/';

    factory.getAllCommands = function()
    {
        return $http.get(urlBase + "allCommands.php");
    };

    factory.getAllArguments = function()
    {
        return $http.get(urlBase + "allArguments.php");
    };

    factory.getCommandStructure = function()
    {
        return $http.get(urlBase + "commandStructure.php");
    };

    factory.getArgumentChildren = function(argId, callback)
    {
        return $http.get(urlBase + "argumentChildren.php", { params: {argId: argId}})
            .success(callback)
            .error(function() {console.log('error')});
    };

    return factory;
}