/**
 * Created by Tyler on 7/9/2015.
 */
angular.module('mainApp')
.directive('bottomScroll', function ()
{
    return function (scope, elem, attr)
    {
        scope.$watch(function ()
            {
                return elem[0].value;
            },
            function (e)
            {
                elem[0].scrollTop = elem[0].scrollHeight;
            }
        );
    }
});