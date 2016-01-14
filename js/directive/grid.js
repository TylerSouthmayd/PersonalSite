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
//            console.log('event', event, 'args', args);
            scope.methodQueue = args;
            console.log('method queue: ', scope.methodQueue);
            scope.method = args.method;
            scope.component = args.component;
            var i = 0;
            switch(scope.method)
            {
                case('add'):
                    if(scope.component == '.')
                    {
                        for(i = 0; i < scope.gridChoices.length; i++)
                        {
                            scope.grid.push({
                                name: scope.gridChoices[i].name,
                                url: scope.gridChoices[i].url
                            });
                        }
                    } else
                    {
                        scope.grid.push({
                            name: scope.component,
                            url: '/partials/' + scope.component + '.html'
                        });
                    }
                    break;
                case('rm'):
                    for(i = 0; i < scope.grid.length; i++)
                    {
                        if(scope.component == '.' )
                        {
                            scope.grid = [];
                            break;
                        } else if(scope.grid[i].name == scope.component)
                        {
                            scope.grid.splice(i,1);
                            break;
                        }
                    }
            }
            console.log('$scope.grid', scope.grid);
        });

        scope.init = function()
        {
            scope.grid = [];
            scope.gridComponent = '';
            scope.index = 1;
            scope.gridChoices = [
                {name: "ProjectHeader" , url: '/partials/projects/ProjectHeader.html'},
                {name: "TylerSouthmayd.com" , url: '/partials/projects/TylerSouthmayd.com.html'},
                {name: "RaspberryPi", url: '/partials/projects/RaspberryPi.html'},
                {name: "UConnSmash.com", url: '/partials/projects/UConnSmash.com.html'},
                {name: "Chinook", url: '/partials/projects/Chinook.html'},
                {name: "HTMLEditor", url: '/partials/projects/HTMLEditor.html'},
                {name: "Navbar", url: '/partials/navigation.html'}
            ];
            console.log('gridchoices: ', scope.gridChoices);
        };
        scope.init();
    };

    gridSetup.controller = function($scope, $timeout)
    {


    };

    return gridSetup;
});