export class CategoriesController {

    constructor() {
        this.categories = [];
        this.activeId = 0;
        this.userData = null;
        this.userRole = -1;
        this.submit = false;
        this.loading = true;
        this.dp = null;
        dynamicImport("./../../adminpanel/js/database.js").then(db => {
            this.db = db;
            this.db.confirm();
            this.getAllCat().then(cats => {
                this.categories = this.db.cleanDataForControllers(cats);
                this.loading = false;
                mvc.apply();
                this.init();
            });

        });

        this.userData = JSON.parse(sessionStorage.getItem('user'));
        this.userRole = this.userData.roleID;

    }


    /** 
     *  This function is used to set category status selection "active or not" 
     *  in selection input for all categories in categories table
     */
    init() {
        const selections = Array.from(document.getElementsByClassName('selection'));
        let i = 0;
        selections.forEach(el => {
            el.value = this.categories[i].isActive;
            i++;
        });
    }


    /** 
     *  This function is used to  hide "create , update and delete" modals 
     *  in the page based on modal id
     * 
     *  @param {number} modalId from the modal element
     */
    hideModal(modalId) {
        let modal = document.getElementById(modalId);
        modal.style.display = "none";
        modal.classList.remove("modal-active");
    }


    /**
     *   This function is used to update category status in the database
     * 
     *   @param {number} id for the category object 
     */
    updateCategoryStatus(id) {
        createToast("جاري التعديل", '', "info", "");
        const category = this.categories[id];
        category.isActive = +!category.isActive;
        this.db.dbCreateOrUpdate('/categories', category, category._id).then(resp => {
            if (resp.ok) {
                this.categories[id]._rev = resp.rev;
                createToast("نجحت العملية", 'تم تعديل حالة الفئة', "success", "check");
            }
        });
    }


    /**
     *  This function is used to  show modal based on the modal id
     *  if the user click on create , delete or update icons
     *  
     *  @param {number} modalId for the modal 
     * 
     *  @param {id} id for category object to edit or delete 
     */
    showModal(modalId, id) {
        let modal = document.getElementById(modalId); //for modal
        modal.style.display = "flex";
        modal.className += " modal-active";
        this.activeId = id;
        if (modalId = "createcategory-modal") {
            document.getElementById("categoryname").value = '';
        }
    }


    /**
     *  This function is used to  get category information from the database
     * 
     *  @return {Object} category information 
     */
    getCatId() {
        return this.db.dbGet("/settings", false, "categories");
    }


    /** 
     *  This function is used to  insert category object into database 
     *  append it into table element in the page
     *  and hide create modal
     */
    createCategory() {
        if (this.submit)
            return;
        this.submit = true;
        createToast("جاري اضافة الفئة", '', "info", "");

        let category = {
            isActive: 1,
            name: document.getElementById('categoryname').value,
        }
        this.CreateCat(category).then(data => {
            if (data.ok) {
                category._rev = data.rev;
                category._id = data.id;
                this.categories.push(category);
                mvc.apply();
                createToast("نجحت العملية", 'تمت اضافة الفئة', "success", "check");
                location.reload();
            }

            this.hideModal('createcategory-modal');
            this.submit = false;
        });

    }


    /** 
     *  This function is used to  insert category object into database
     * 
     *  @param {object} category object
     * 
     *  @returns {Promise} for database insertion
     */
    CreateCat(data) {
        return new Promise((resolve, reject) => {
            this.getCatId().then(request => {
                const _id = request.counter + 1;
                this.db.dbCreateOrUpdate("/categories", data, _id).then(response => {
                    request.counter = request.counter + 1;
                    this.db.dbCreateOrUpdate("/settings", request, request._id).then(response2 => {
                        resolve(response2);
                    });
                })
            })
        })
    }


    /** 
     *  This function is used to  get all categories information from the database
     *  
     *  @returns {Promise} for database read
     */
    getAllCat() {
        return new Promise((resolve, reject) => {
            this.db.dbGet("/categories/_design/allcategories/_view/allcategories", true, "").then(cats => {

                resolve(cats);
            })
        });
    }


    /*
     *  This function is used to delete categroy from the database
     *  update table element and hide update modal
     */
    deleteCategory() {
        if (this.submit)
            return;
        this.submit = true;

        createToast("جاري حذف", '', "info", "");

        if (this.activeId == -1)
            return;
        const id = this.activeId;
        this.activeId = -1;
        const category = this.categories[id];
        this.db.dbDelete('/categories', category._id, category._rev).then(resp => {
            if (resp.ok) {

                this.categories.splice(id, 1);
                mvc.apply();
                this.init();
                createToast("نجحت العملية", 'تم حذف الفئة', "success", "check");
            }
            this.hideModal('delete');
            this.submit = false;

        });
    }


    /** 
     *  This function is used to  update category name in the databse 
     *  apply category name change in the table
     *  and hide update modal 
     */
    updateCategoryName() {
        if (this.activeId == -1)
            return;
        createToast("جاري التعديل", '', "info", "");

        const id = this.activeId;
        this.activeId = -1;
        const category = this.categories[id];
        const newName = document.getElementById('editcategoryname').value;
        category.name = newName;
        this.db.dbCreateOrUpdate('/categories', category, category._id).then(resp => {
            if (resp.ok) {
                this.categories[id].name = newName;
                this.categories[id]._rev = resp.rev;
                mvc.apply();
                this.init();
                createToast("نجحت العملية", 'تم تعديل اسم الفئة', "success", "check");
            }
        });
        this.hideModal('createcategory-edit-modal');

    }

}