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
        $('#lazynav').removeClass('active');
        $('#' + tab).addClass('active');
    });

    $scope.introView = function(id)
    {
        var queue = {method: 'cd home', consoleCommand: true};
        BroadcastUtility.consoleMessage(queue);
        $('#sandboxnav').removeClass('active');
        $('#resumenav').removeClass('active');
        $('#lazynav').removeClass('active');
        $('#intronav').addClass('active');
    };

    $scope.resumeView = function()
    {
        var queue = {method: 'cd resume', consoleCommand: true};
        BroadcastUtility.consoleMessage(queue);
        $('#intronav').removeClass('active');
        $('#lazynav').removeClass('active');
        $('#sandboxnav').removeClass('active');
        $('#resumenav').addClass('active');
    };

    $scope.sandboxView = function()
    {
        var queue = {method: 'cd sandbox', consoleCommand: true};
        BroadcastUtility.consoleMessage(queue);
        $('#intronav').removeClass('active');
        $('#resumenav').removeClass('active');
        $('#lazynav').removeClass('active');
        $('#sandboxnav').addClass('active');
    };

    $scope.lazyView = function()
    {
        var queue = {method: 'cd lazyview', consoleCommand: true};
        BroadcastUtility.consoleMessage(queue);
        $('#intronav').removeClass('active');
        $('#resumenav').removeClass('active');
        $('#sandboxnav').removeClass('active');
        $('#lazynav').addClass('active');

    };

    $scope.toggleHelpModal = function()
    {
//        $('#helpModal').modal('toggle');
        var queue = {method: 'help', consoleCommand: true};

        BroadcastUtility.consoleMessage(queue);
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
        $('#helpnav').popover({
            trigger : 'hover',
            placement: 'bottom',
            html: true,
            content:
                function()
                {
                    return $('#helppopover-content').html();
                }
        });
    };
    $scope.init();
}