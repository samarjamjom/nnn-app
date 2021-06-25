let viewElement;
let controllerObj;
// class that contains route information
class routeObj {
    constructor(title, route, template, controller) {
        // pathes
        this.title = title;
        this.controller = c;
        this.route = r;
        this.template = t;
        this.routeParams = {};
    }
}

// Mvc Class
// ************* Methods *************
// - add route 
//      adds route information to route map
// - add route list
//      adds route list to route map
// - init 
//      intiating mvc and start exection of the mvc
// - update
//      changes view and controller depending on the ur
// - apply
//      updates the view
// - clear
//      clears the controller and view value
// - extend Directives
//      adds new directive to the directive list
// ***********************************

// ************* Variables *************
//  - routeMap
//      contains routing information
// - controller
//      contains the current controller of the view
// - template
//      contians the original unrendered view
// - default Route
//      default Route information
// ***********************************

class Mvc {
    constructor() {
        this.routeMap = [];
        this.controller = {};
        this.template = {};
        this.defaultRoute = "";
        this.routeParams = {};
    }

    addRoute(title, controller, route, template) {
        this.routeMap = this.routeMap.push(new routeObj(title, route, template, controller));
    }

    addRouteList(list) {
        this.routeMap = this.routeMap.concat(list);
    }

    init() {
        // get View Element
        viewElement = document.querySelector('[view]');
        // check if view element exists
        if (!viewElement) return;
        // set default wrote
        this.defaultRoute = { currentRoute: this.routeMap[Object.getOwnPropertyNames(this.routeMap)[0]] };
        //update page when rute Changes
        window.onhashchange = this.update.bind(this);
        this.update();
    }

    update() {
        this.clear();
        routeObj = analyzeUrl(window.location.href, this.routeMap); //get the route object        
        //Set to default route object if no route found
        if (!routeObj)
            routeObj = this.defaultRoute;

        this.routeParams = routeObj.routeParams;
        document.title = routeObj.currentRoute.title;

        loadMvc(routeObj.currentRoute.template, routeObj.currentRoute.controller)
            .then((obj) => {
                viewElement.innerHTML = obj.template;
                controllerObj = new obj.controller[Object.keys(obj.controller)[0]];
                controllerObj.routeParams = this.routeParams;
                render(viewElement, controllerObj);
            });
    }

    apply() {
        render(viewElement, controllerObj, true);
    }

    // clears the MVC
    clear() {
        viewElement.innerHTML = "";
        clearRender();
        delete this.controller;
        this.controller = {};
        this.template = {};
    }

    extendDirectives(name,renderer)
    {
        specails.push(new AttrData(name, renderer));
    }
}
