
export class addnewsController {

    constructor() {

        this.allNewsPage = [];
        this.form = {};
        this.newsId = mvc.routeParams.id;
        const title = document.getElementsByClassName('title')[0];
        const button = document.getElementsByClassName('button')[0];
        const sub_header = document.getElementsByClassName('header-subheader')[0];
        if (this.newsId != 0) {
            title.innerHTML = "تعديل خبر";
            button.innerHTML = "تعديل الخبر";
            sub_header.innerHTML = " الرئيسية > لوحة التحكم >الأخبار > تعديل خبر"
        }

        //Check role
        this.setScheduleTime();
        dynamicImport("./js/database.js").then(db => {

            db.dbGet("/categories/_design/allcategories/_view/allcategories", true, "").then(cats => {
                this.categories = cats;
                this.categoryId = this.categories[0].id;
                mvc.apply();
                if (this.newsId != 0) {
                    db.dbGet("/news/_design/views/_view/editnews", true, this.newsId).then(news => {
                        if (news.rows.length != 1) {
                            window.location.href = '#/addnews/0';
                        }
                        mvc.apply();
                        this.fillData(news.rows[0].value);
                        this.richTextEditor();

                    });

                } else this.richTextEditor();
            });


            this.db = db;
        });

        this.writerId = JSON.parse(sessionStorage.getItem('user')).id;
        this.editor = null;
        this.newsList = [];
        this.newsImage = "";
        this.title = '';
        this.content = '';
        this.categoryId = '';
        this.seoTitle = '';
        this.seoTags = '';
        this.seoDescription = '';
        this.isActive;
        this.isMainNews = '';
        this.isUrgentNews = '';
        this.createDate = '';
        this.attachment = '';
        this.isApproved = 0;
        this.categories = [];
        this.rev = '';
        this.submitted = false;
        this.errorMessage =0;
    }
    fillData(data) {
        this.newsImage = data.attachment;
        this.title = data.title;
        this.content = data.content;
        this.categoryId = data.categoryId;
        this.seoTitle = data.seoTitle;
        this.seoTags = data.seoTags;
        this.seoDescription = data.seoDescription;
        this.isActive = data.isActive;
        this.isMainNews = data.isMainNews;
        this.isUrgentNews = data.isUrgentNews;
        this.createDate = data.createDate;
        this.attachment = data.attachment;
        this.isApproved = data.isApproved;
        this.writerId = data.writerId;
        this.rev = data._rev;
        mvc.apply();
        let preview = document.querySelector('.addnews-img-container img');
        preview.src = data.attachment;
        preview.parentElement.style.display = "flex";
        document.getElementById('seoDescription').value = data.seoDescription;
        this.idSelector('isMainNews').checked = this.isMainNews;
        this.idSelector('isUrgentNews').checked = this.isUrgentNews;

        document.getElementById('categoryId').value = this.categoryId;
    }


    idSelector = (id) => { return document.getElementById(id) };
    richTextEditor() {

        let newsBody = document.getElementById('editor');
        let toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }], // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
            [{ 'direction': 'rtl' }], // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image', 'video', 'formula'], // add's image support
            [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'] // remove formatting button
        ];
        let options = {
            debug: 'info',
            placeholder: '',
            readOnly: false,
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        };
        this.editor = new Quill(newsBody, options);
        this.editor.container.firstChild.innerHTML = this.content;

        this.editor.format('direction', 'ltr');

    }
    changeDateFormat(date) {
        if (typeof (date) == 'string')
            return date;
        let month = (date.getMonth() + 1) + '';
        if (month.length == 1)
            month = '0' + month;

        let day = (date.getDate()) + '';
        if (day.length == 1)
            day = '0' + day;

        return date.getFullYear() + "-" + (month) + "-" + (day);
    }


    setScheduleTime() {
        let createField = this.idSelector('createDate');
        let checkbox = this.idSelector('enable-checkbox');
        createField.disabled = !checkbox.checked;
        createField.value = this.changeDateFormat(new Date());
    }

    updateExistedNew(data, key) {
        return new Promise((resolve, response) => {
            this.db.dbCreateOrUpdate("/news", data, key).then(response => {
                if (response.error) {
                    window.location.href = "#/home";
                }
                resolve(response);
            });
        })
    }
    saveNews() {



        if (this.attachment == '' ) {
            this.errorMessage++;
            this.errorMessage = this.errorMessage%2;
            if(this.errorMessage)
                {
                    createToast("خطأ", 'قم بإختيار الصورة ', "danger", "times-circle");
                }
            this.submitted = false;
            return;
        }
        if (this.newsId == -1)
            return;
        if (this.submitted)
            return;
        this.submitted = true;
        const id = this.newsId;
        this.newsId = -1;
        let btn = this.idSelector('submit-btn');
        btn.disabled = true;
        btn.style.fontSize = '15px';
        btn.innerHTML = "جاري ارسال الخبر";

        let news = {
            title: this.title,
            content: this.editor.container.firstChild.innerHTML,
            categoryId: this.categoryId,
            seoTitle: this.seoTitle,
            seoTags: this.seoTags,
            seoDescription: this.seoDescription,
            isActive: 1,
            isMainNews: this.evalCheckbox(this.idSelector('isMainNews').checked),
            isUrgentNews: this.evalCheckbox(this.idSelector('isUrgentNews').checked),
            createDate: this.createDate,
            attachment: this.attachment,
            writerId: this.writerId,
            isApproved: this.isApproved,
        }

        if (id != 0) {
            createToast("جاري التعديل", '', "info", "");
            news._rev = this.rev;
            news._id = id;
            this.updateExistedNew(news, id).then(resp => {
                if (resp.ok) {
                    createToast("نجحت العملية", 'تم تعديل الخبر', "success", "check");
                    setTimeout(() => {
                        window.location.href = "#/home";
                        this.$submitted = false;
                    }, 1200);
                }
            });
            return;
        }
        createToast("جاري انشاء الخبر", '', "info", "");
        if (this.createDate == '')
            news.createDate = this.changeDateFormat(new Date());

        this.CreateNews(news).then(resp => {
            createToast("نجحت العملية", 'تمت اضافة الخبر', "success", "check");
            setTimeout(() => window.location.href = "#/mynews", 1000);
        });
    }

    evalCheckbox(value) {
        return value;
    }

    previewImg() {
        let preview = document.querySelector('.addnews-img-container img');
        let file = document.querySelector('input[type="file"]').files[0];
        let reader = new FileReader();
        if (file)
            preview.parentElement.style.display = "flex";
        else {
            preview.parentElement.style.display = "none";
            this.attachment = "";
            return false;
        }
        reader.readAsDataURL(file);

        reader.onload = () => {
            let image = reader.result;
            this.attachment = image;
            preview.src = reader.result;
        };
    }

    getNewsId() {

        return this.db.dbGet("/settings", false, "news");
    }
    CreateNews(data) {

        return new Promise((resolve, reject) => {
            this.getNewsId().then(request => {
                const newsId = request.counter + 1;
                this.db.dbCreateOrUpdate("/news", data, newsId).then(response => {
                    request.counter = request.counter + 1;
                    this.db.dbCreateOrUpdate("/settings", request, request._id).then(response2 => {
                        resolve(response2);
                    });
                })
            })
        })
    }


}