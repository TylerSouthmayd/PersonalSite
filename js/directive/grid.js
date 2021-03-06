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

        function parseGridMethod(info)
        {
            console.log('GRID METHOD: ', info);
            console.log('grid copy', angular.copy(scope.grid));
            scope.method = info.method;
            scope.component = info.component;
            scope.option = info.option;
            scope.exclude = info.exclude || false;
            var i = 0;
            var j = 0;
            var shouldPush = true;
            switch(scope.method)
            {
                case('add'):
                    if(scope.component == '.')
                    {
                        for(i = 0; i < scope.gridChoices.length; i++)
                        {
                            if(scope.gridChoices[i].name == scope.exclude)
                            {
                                shouldPush = false;
                                BroadcastUtility.consoleMessage("excluding \'" + scope.exclude + "\' component from \'add .\'" );
                            }
                            for(j = 0; j < scope.grid.length; j++)
                            {
                                if(scope.gridChoices[i].name == scope.grid[j].name)
                                {
                                   shouldPush = false;
                                }
                            }
                            if(shouldPush)
                            {
                                (scope.grid).push({
                                    name: scope.gridChoices[i].name,
                                    url: scope.gridChoices[i].url,
                                    poppable: scope.gridChoices[i].poppable || false
                                });
                            }
                            shouldPush = true;
                        }
                    } else
                    {
                        for(i = 0; i < scope.grid.length; i++)
                        {
                            if(scope.grid[i].name == scope.component)
                            {
                                shouldPush = false;
                            }
                        }
                        if(shouldPush)
                        {
                            scope.grid.push({
                                name: scope.component,
                                url: '/partials/' + scope.component + '.html',
                                poppable: (scope.component).indexOf('projects/') == 0
                            });
                        }
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
                            BroadcastUtility.consoleMessage("excluding \'" + scope.exclude + "\' component from \'rm .\'");
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
                    break;
                case('mv'):
                    console.log('made it to mv');
                    var len = scope.grid.length;
                    for(i = 0; i < len; i++)
                    {
                        if((scope.component).indexOf(scope.grid[i].name) !== -1)
                        {
                            switch(scope.option)
                            {
                                case('--up'):
                                    if(i !== 0) moveObjectAtIndex(scope.grid, i, i - 1);
                                    break;
                                case('--down'):
                                    if(i !== (len - 1)) moveObjectAtIndex(scope.grid, i, i + 2);
                                    break;
                                case('--top'):
                                    moveObjectAtIndex(scope.grid, i, 1);
                                    break;
                                case('--bottom'):
                                    moveObjectAtIndex(scope.grid, i, len);
                                    break;
                            }
                            break;
                        }
                    }
                    break;
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

        function moveObjectAtIndex(array, sourceIndex, destIndex) {
            var placeholder = {};
            var objectToMove = array.splice(sourceIndex, 1, placeholder)[0];
            array.splice(destIndex, 0, objectToMove);
            array.splice(array.indexOf(placeholder), 1);
        }


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
//                case '/resume':
//                    parseGridMethod({method: 'add', component: 'resume'});
//                    break;
                case '/home':
                    parseGridMethod({method: 'add', component: 'navbar'});
                    parseGridMethod({method: 'add', component: 'intro'});
                    break;
//                case '/sandbox':
//                    parseGridMethod({method: 'add', component: 'intro'});
//                    break;
            }
        };
        scope.init();



    };

    gridSetup.controller = function($scope, $timeout)
    {


    };

    return gridSetup;
});