/**
 * Created by Tyler on 8/15/2015.
 */
angular.module('mainApp')
.directive('grid', function ()
{
    var gridSetup = [];

    gridSetup.restrict = 'E';
    gridSetup.templateUrl = '../../partials/grid.html';

    gridSetup.link = function(scope, elem, attr)
    {
        console.log(scope, elem, attr);
        scope.$on('Update Grid', function(event, args)
        {
            console.log('event', event, 'args', args);
            scope.method = args.method;
            scope.component = args.component;
            switch(scope.method)
            {
                case('add'):
                    scope.grid.push({name: scope.component, url: '/partials/projects/' + scope.component + '.html'});
                    break;
                case('rm'):
                    for(var i = 0; i < scope.grid.length; i++)
                    {
                        if(scope.grid[i].name == scope.component)
                        {
                            scope.grid.splice(i,1);
                            //if removing all dont break
                            break;
                        }
                    }
                    break;
            }
            console.log('$scope.grid', scope.grid);
        });

        scope.init = function()
        {
            scope.grid = [];
            scope.gridComponent = '';
            scope.index = 1;
//            $timeout(function()
//            {
//            }, 2000);
        };
        scope.init();
    };

    gridSetup.controller = function($scope, $timeout)
    {


    };

    return gridSetup;
});