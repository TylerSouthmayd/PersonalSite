/**
 * Created by Tyler on 8/1/2015.
 */

angular.module('mainApp')
.directive('keyEventHandler', function ()
{
    var directive = [];

    directive.require = 'terminal'
    directive.restrict = 'A';
    directive.scope =
    {

    };

    directive.link = function (scope, elem, attr, terminalController) {
        //console.log(scope, elem, attr);
    };

    return directive;
});