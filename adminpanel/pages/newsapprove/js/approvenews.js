export class approveNewsControler {

    constructor() {

        this.notAppNewsPage = [];
        this.categories = [];
        this.dp = null;
        this.loading = true;
        this.submit = false;
        dynamicImport("./../../adminpanel/js/database.js").then(db => {
            this.db = db;
            this.db.confirm();

            this.getAllCat().then(cats => {
                this.categories = this.db.cleanDataForControllers(cats);
                this.getAllNotAppNews().then(news => {
                    this.notAppNewsPage = this.db.cleanDataForControllers(news);
                    this.loading = false;
                    mvc.apply();
                });
            });

        });
    }

    /*  
        redirect function is used to direct the user to a edit news page to edit the selected news
        @param: id of the selected news
        @return: none
    */
    redirect(id) {
        window.location.href = "#/addnews/" + id;
        document.location.reload(true);
    }

    /*  
        appproveNews function is used to approve all selected news and update its approvition status in the database 
        and show a confirmation message to user for that. 
        @param: none
        @return: none
    */
    appproveNews() {
        if (this.submit)
            return;
        this.submit = true;
        let news;
        let data;
        let j = 0;
        createToast("جاري تأكيد الأخبار المختارة", '', "info", "");
        let approved = [];
        for (let i = 0; i < this.notAppNewsPage.length; i++) {
            let checkbox = document.getElementById(this.notAppNewsPage[i]._id);
            if (checkbox.checked) {
                approved.push(i);
                j++;
            }
        }
        for (let i = 0; i < j; i++) {

            news = this.notAppNewsPage[approved[i]];
            data = {
                "title": news.title,
                "content": news.content,
                "categoryId": news.categoryId,
                "seoTitle": news.seoTitle,
                "seoTags": news.seoTags,
                "seoDescription": news.seoDescription,
                "isActive": news.isActive,
                "isMainNews": news.isMainNews,
                "isUrgentNews": news.isUrgentNews,
                "createDate": news.createDate,
                "writerId": news.writerId,
                "attachment": news.attachment,
                "_rev": news._rev,
                "writerId": news.writerId,
                "isApproved": 1
            }

            let x = this.updateNew(data, news._id + '');
            if (i == j - 1) {
                x.then(finished => {
                    createToast("نجحت العملية", 'تم تأكيد الأخبار', "success", "check");
                    setTimeout(() => {
                        this.submit = false;
                        window.location.reload();
                    }, 1500);
                });
                this.submit = false;
            }
        }
        setTimeout(() => {
            this.submit = false;
        }, 5000);
    }

    /*  
        updateNew function is used to update a specific news in the database
        @param: id of the news , modified data for the news
        @return: {promise} for the database update
    */
    updateNew(data, newsId) {
        return new Promise((resolve, reject) => {
            this.db.dbCreateOrUpdate("/news", data, newsId).then(response => {
                resolve(response);
                mvc.apply();
                console.log("Updated");
            });
        })
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
        deleteNews function is used to delete the selected news from the database
        and from the news table either
        @param:  none
        @return: none
    */
    deleteNews() {
        if (this.activeId == -1)
            return;
        const news = this.notAppNewsPage[this.activeId];
        const id = this.activeId;
        this.activeId = -1;
        this.db.dbDelete('/news', news._id, news._rev).then((req) => {
            if (req.ok)
                this.notAppNewsPage.splice(id, 1);
            mvc.apply();
        });
        this.hide('delete');

    }

    /*  
       getAllNotAppNews function is used to get all nonapproved news from the database
       @param:  none
       @return: {promise} for read news from the database
   */
    getAllNotAppNews() {
        return new Promise((resolve, reject) => {
            this.db.dbGet("/news/_design/views/_view/notapproved", true, "").then(news => {

                resolve(news);
            })
        });
    }

    /*
       getAllCat function is used to  get all categories information from the database
       @returns {Promise} for read categories from the database
    */
    getAllCat() {
        return new Promise((resolve, reject) => {
            this.db.dbGet("/categories/_design/allcategories/_view/allcategories", true, "").then(cats => {

                resolve(cats);
            })
        });
    }

}