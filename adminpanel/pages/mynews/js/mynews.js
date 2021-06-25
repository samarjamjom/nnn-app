export class myNewsControler {
    /*  
        intiation of the page
    */
    constructor() {

        this.loading = true;
        this.myNewsPage = [];
        this.categories = [];
        this.dp = null;
        this.user = null;
        this.activeId = -1;
        dynamicImport("./../../adminpanel/js/database.js").then(db => {
            this.db = db;
            this.user = this.db.confirm();
            this.user = this.db.getUser('user');
            console.log(this.user);
            this.getAllCat().then(cats => {
                this.categories = this.db.cleanDataForControllers(cats)
                this.getMyNews(this.user.id).then(news => {
                    this.myNewsPage = this.db.cleanDataForControllers(news.rows);
                    this.loading = false;
                    mvc.apply();
                });

            });

        });

    }
    /*  
        Redirect function is used to direct the user to a new page to edit the new selected
        @param: none
        @return: none
    */
    redirect(id) {
        window.location.href = "#/addnews/" + id;
        document.location.reload(true);
    }
    /*  
        getMyNews function is used to read the news from the DB
        @param: username of the user
        @return: News of the user
    */
    getMyNews(username) {
        return new Promise((resolve, reject) => {
            this.db.dbGet("/news/_design/views/_view/specificUser", true, username).then(news => {
                resolve(news);
            })
        });
    }
    /*  
       getAllCat function is used to get all the categories from the DB
       @param:  none
       @return: all categories
    */
    getAllCat() {
        return new Promise((resolve, reject) => {
            this.db.dbGet("/categories/_design/allcategories/_view/allcategories", true, "").then(cats => {
                resolve(cats);
            })
        });
    }
    /*  
       show function is used to display popup to the user 
       @param: modelId: to distinguish the type of the popup, id: row number 
       @return: none
    */
    show(modelId, id) {
        let element = document.getElementById(modelId);
        element.style.display = 'flex';
        element.className += " modal-active";
        this.activeId = id;
    }
    /*  
       hide function is used to hide the popup shown from the user
       @param: modelId: to distinguish the type of the popup
       @return: none
    */
    hide(modelId) {
        let element = document.getElementById(modelId);
        element.style.display = 'none';
    }
    /*  
        deleteNEws function is used to delete the new choosen from the DB
        @param:  none
        @return: none
    */
    deleteNews() {
        if (this.activeId == -1)
            return;
        createToast("جاري حذف الخبر", '', "info", "");

        const news = this.myNewsPage[this.activeId];
        const id = this.activeId;
        this.activeId = -1;
        this.db.dbDelete('/news', news._id, news._rev).then((req) => {
            if (req.ok) {
                this.myNewsPage.splice(id, 1);
                createToast("نجحت العملية", ' تم حذف الخبر', "success", "check");

            }
            mvc.apply();
        });
        this.hide('delete');
    }
}