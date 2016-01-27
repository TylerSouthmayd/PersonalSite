/**
 * Created by Tyler on 8/15/2015.
 */
angular.module('mainApp')
.directive('grid', function (BroadcastUtility, $location)
{
    var gridSetup = [];

    gridSetup.restrict = 'E';
    gridSetup.templateUrl = '../../partials/grid.html';

    gridSetup.link = function(scope, elem, attr)
    {
        console.log(scope, elem, attr);

        scope.universalNavbar = function()
        {
            BroadcastUtility.toggleNavbar();
        };

        function parseGridMethod(info)
        {
            console.log('GRID METHOD: ', info);
            console.log('grid copy', angular.copy(scope.grid));
            scope.method = info.method;
            scope.component = info.component;

            scope.exclude = info.exclude || false;
            var i = 0;
            switch(scope.method)
            {
                case('add'):
                    if(scope.component == '.')
                    {
                        for(i = 0; i < scope.gridChoices.length; i++)
                        {
                            (scope.grid).push({
                                name: scope.gridChoices[i].name,
                                url: scope.gridChoices[i].url,
                                poppable: scope.gridChoices[i].poppable || false
                            });
                        }
                    } else
                    {
                        scope.grid.push({
                            name: scope.component,
                            url: '/partials/' + scope.component + '.html',
                            poppable: (scope.component).indexOf('projects/') == 0
                        });
                    }
                    break;
                case('rm'):
                    if(scope.component == '.' )
                    {
                        if(!scope.exclude)
                        {
                            scope.grid = [];
                        } else
                        {
                            i = 0;
                            while(scope.grid.length > 1)
                            {
                                if(scope.grid[i].name !== scope.exclude)
                                {
                                    scope.grid.splice(i,1);
                                } else i++;
                            }
                        }
                        break;
                    } else
                    {
                        for(i = 0; i < scope.grid.length; i++)
                        {
                            if(scope.grid[i].name == scope.component)
                            {
                                scope.grid.splice(i,1);
                                break;
                            }
                        }
                    }


//                    for(i = 0; i < scope.grid.length; i++)
//                    {
//                        if(scope.component == '.')
//                        {
//                            if(scope.exclude !== false)
//                            {
//                                for(i = 0; i < scope.grid.length; i++)
//                                {
//                                    if(scope.grid[i].name !== scope.exclude)
//                                    {
//                                        scope.grid.splice(i,1);
//                                    }
//                                }
//                            } else scope.grid = [];
//                            break;
//                        } else if(scope.grid[i].name == scope.component)
//                        {
//                            scope.grid.splice(i,1);
//                            break;
//                        }
//                    }
            }
            console.log('$scope.grid', scope.grid);
        }

        scope.$on('Update Grid', function(event, args)
        {
//            console.log('event', event, 'args', args);
//            scope.methodQueue = args;
//            console.log('method queue: ', scope.methodQueue);
            if(Array.isArray(args))
            {
                for(var i = 0; i < args.length; i++)
                {
                    parseGridMethod(args[i]);
                }
            }else parseGridMethod(args);
//            scope.method = args.method;
//            scope.component = args.component;

        });

        scope.popout = function(id, component)
        {
//            console.log('popout id:', id, component);
            if(component.poppable == true)
            {
                $('#'+id).toggleClass('popout');
            }
        };

        scope.init = function()
        {
            scope.grid = [];
            scope.gridComponent = '';
            scope.index = 1;
            scope.gridChoices = [
                {name: "navbar", url: '/partials/navbar.html', poppable: false},
                {name: "intro", url: '/partials/intro.html', poppable: false},
                {name: "projectheader" , url: '/partials/projects/projectheader.html', poppable: false},
                {name: "tylersouthmayd.com" , url: '/partials/projects/tylersouthmayd.com.html', poppable: true},
                {name: "raspberrypi", url: '/partials/projects/raspberrypi.html', poppable: true},
                {name: "uconnsmash.com", url: '/partials/projects/uconnsmash.com.html', poppable: true},
                {name: "chinook", url: '/partials/projects/chinook.html', poppable: true},
                {name: "htmleditor", url: '/partials/projects/htmleditor.html', poppable: true},
                {name: "resume", url: '/partials/resume.html', poppable: true}
            ];
            console.log('gridchoices: ', scope.gridChoices);

            switch($location.path())
            {
                case '/resume':
                    parseGridMethod({method: 'add', component: 'resume'});
                    break;
                case '/home':
                    parseGridMethod({method: 'add', component: 'navbar'});
                    break;
                case '/sandbox':
                    parseGridMethod({method: 'add', component: 'intro'});
                    break;
            }
        };
        scope.init();
    };

    gridSetup.controller = function($scope, $timeout)
    {


    };

    return gridSetup;
});