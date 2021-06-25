export class HomeController {
    constructor() {
        this.mode = null;
        this.changing = false;
        this.userRole = -1;

        this.db = dynamicImport("../adminpanel/js/database.js");
        this.db.then(db => {
        console.log(db);
            this.userRole = db.confirm().data.roleId;
            mvc.apply();
        });

        this.siteMode = null;
        this.getStatus().then(state => {
            this.siteMode = state;
            this.mode = state.state;
            mvc.apply();
        });


    }
    /*  
    changeMode function is change the status of the website and store it in the database
    @return:Promise that contains the state of the website
     */
    changeMode() {
        if (this.changing)
            return;
        this.changing = true;
        mvc.apply();
        this.getStatus().then(res => {
            res.state = !res.state;
            this.db.then(dbObject => dbObject.dbCreateOrUpdate("/settings", res, "sitemode").then(resp => {
                this.mode = res.state;
                this.siteMode = res;
                this.changing = false;
                mvc.apply();
            }));
        })
    }
    /*  
    getStatus function is used to get the status of the website
    @return:Promise that contains the state of the website
*/
    getStatus() {
        return new Promise((resolve, rej) => {
            this.db.then(dbObject => dbObject.dbGet("/settings", false, "sitemode").then(res => {

                resolve(res);
            }));
        })
    }

}