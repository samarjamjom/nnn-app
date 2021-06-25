/*
    NNN website.

    This file is part of the NNN website.

    Authors:
        Qusai Hroub <qusaihroub.r@gmail.com>
        Aseel Arafeh <arafehaseel@gmail.com>
        Amir Altakroori <ameertakrouri99@gmail.com>
        Latifa Masri <latifa.masri1998@gmail.com>

    File description:
        This file contains routeList for home, details, categoies pages.
*/

let mvc = new Mvc();

let routeList = [
    {
        url: "/home",
        template: "/website/templates/home.html",
        controller: "/website/controllers/home.js",
        title: "شبكة الوحدة الإعلامية"
    },
    {
        url: "/details/:id",
        template: "/website/templates/details.html",
        controller: "/website/controllers/detailes.js",
        id: "",
        title: "شبكة الوحدة الإعلامية"
    },
    {
        url: "/categories/:id",
        template: "/website/templates/categories.html",
        controller: "/website/controllers/categories.js",
        id: "",
        title: "شبكة الوحدة الإعلامية"
    },
    {
        url: "/underMaintenance",
        template: "/website/templates/underMaintenance.html",
        controller: "/website/controllers/underMaintenance.js",
        title: "شبكة الوحدة الإعلامية"
    }
];

mvc.addRouteList(routeList);
mvc.init();
