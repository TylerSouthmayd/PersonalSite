/**
 * Created by Tyler on 2/14/2016.
 */
mainApp.controller('CarouselController', CarouselController);

function CarouselController($scope)
{
    $scope.interval = 3000;

    $scope.chinookslides = [
        {
            image: "../../img/chinook/register.PNG"
        },
        {
            image: "../../img/chinook/employeedash.PNG"
        },
        {
            image: "../../img/chinook/customerdash.PNG"
        },
        {
            image: "../../img/chinook/manageplaylist.PNG"
        },
        {
            image: "../../img/chinook/tracksearch.PNG"
        },
        {
            image: "../../img/chinook/customershopping.PNG"
        },
        {
            image: "../../img/chinook/customercheckout.PNG"
        }
    ];
    $scope.tylersouthmaydslides = [
        {
            image: "../../img/tylersouthmayd.com/ex1.PNG"
        },
        {
            image: "../../img/tylersouthmayd.com/resandman.PNG"
        },
        {
            image: "../../img/tylersouthmayd.com/help.PNG"
        }
    ];
    $scope.uconnsmashslides = [
        {
            image: "../../img/uconnsmash.com/home.PNG"
        },
        {
            image: "../../img/uconnsmash.com/playerpage.PNG"
        },
        {
            image: "../../img/uconnsmash.com/standings.PNG"
        },
        {
            image: "../../img/uconnsmash.com/tournamentoverview.PNG"
        }
    ];
    $scope.htmleditorslides = [
        {
            image: "../../img/htmleditor/intro.PNG"
        },
        {
            image: "../../img/htmleditor/ex1.PNG"
        },
        {
            image: "../../img/htmleditor/page options.PNG"
        },
        {
            image: "../../img/htmleditor/exporthtml.PNG"
        },
        {
            image: "../../img/htmleditor/exampleoutput.PNG"
        }
    ];

}