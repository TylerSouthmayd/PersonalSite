/**
 * Created by Tyler on 7/3/2015.
 */
mainApp.controller('NavigationController', NavigationController);

function NavigationController($scope, $location, BroadcastUtility)
{
    $scope.$on('Activate Tab', function(prop, tab)
    {
        console.log('tab to activate: ', tab);
        $('#sandboxnav').removeClass('active');
        $('#resumenav').removeClass('active');
        $('#intronav').removeClass('active');
        $('#' + tab).addClass('active');
    });

    $scope.introView = function(id)
    {
        var queue = [
            {method: 'rm', component: '.', exclude: 'navbar'},
            {method: 'add', component: 'intro'}
        ];
        BroadcastUtility.consoleMessage(queue[0].method + ' ' + queue[0].component);
        BroadcastUtility.consoleMessage(queue[1].method + ' ' + queue[1].component);
        BroadcastUtility.updateGrid(queue);
        $('#sandboxnav').removeClass('active');
        $('#resumenav').removeClass('active');
        $('#intronav').addClass('active');
    };

    $scope.resumeView = function()
    {
        var queue = [
            {method: 'rm', component: '.', exclude: 'navbar'},
            {method: 'add', component: 'resume'}
        ];

        BroadcastUtility.consoleMessage(queue[0].method + ' ' + queue[0].component);
        BroadcastUtility.consoleMessage(queue[1].method + ' ' + queue[1].component);
        BroadcastUtility.updateGrid(queue);
        $('#intronav').removeClass('active');
        $('#sandboxnav').removeClass('active');
        $('#resumenav').addClass('active');
    };

    $scope.sandboxView = function()
    {
        var queue = [
            {method: 'rm', component: '.', exclude: 'navbar'}
        ];
        BroadcastUtility.updateGrid(queue);
        $('#intronav').removeClass('active');
        $('#resumenav').removeClass('active');
        $('#sandboxnav').addClass('active');

        BroadcastUtility.consoleMessage(queue[0].method + ' ' + queue[0].component);

    };

    $scope.lazyView = function()
    {
        var queue = [
            {method: 'rm', component: '.'},
            {method: 'add', component: '.'}
        ];
        BroadcastUtility.updateGrid(queue);
        BroadcastUtility.consoleMessage(queue[0].method + ' ' + queue[0].component);
        BroadcastUtility.consoleMessage(queue[1].method + ' ' + queue[1].component);

    };

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.url();
    };

    $scope.init = function()
    {
        $('#intronav')
            .addClass('active')
            .popover({
                trigger : 'hover',
                placement: 'bottom',
                html: true,
                content:
                    function()
                    {
                        return $('#intropopover-content').html();
                    }
                }
            );

        $('#resumenav').popover({
            trigger : 'hover',
            placement: 'bottom',
            html: true,
            content:
                function()
                {
                    return $('#resumepopover-content').html();
                }
        });
        $('#sandboxnav').popover({
            trigger : 'hover',
            placement: 'bottom',
            html: true,
            content:
                function()
                {
                    return $('#sandboxpopover-content').html();
                }
        });
        $('#lazynav').popover({
            trigger : 'hover',
            placement: 'bottom',
            html: true,
            content:
                function()
                {
                    return $('#lazypopover-content').html();
                }
        });
    };
    $scope.init();
}