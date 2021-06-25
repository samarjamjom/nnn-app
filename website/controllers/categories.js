/*
    NNN website.

    This file is part of the NNN website.

    Authors:
        Diana Mujahed <diana.muj98@gmail.com>
        Ibrahim Abusamarah <ibrahim.abusamrah123@gmail.com>
        Amir Altakroori <ameertakrouri99@gmail.com>
        Qusai Hroub <qusaihroub.r@gmail.com>

    File description:
        This file contains the controller class of categories page which applies Potato Framework.
 */

import { DataBase } from "../services/database.js";

export class Category {

    constructor() {

        this.dataBase = new DataBase();

        this.websiteStatus();

        this.indexType = mvc.routeParams.id;
        this.category = {};
        this.listMainNews = [];
        this.mainNews = {};
        this.randomNews = [];
        this.writers = [];
        this.writer = {};
        this.rightNewsInCategory = [];
        this.liftNewsInCategory = [];

        this.getCategory(this.indexType);
        this.getAllNews();
        this.getNews();
        this.getRandomNews(this.indexType);

    }

    /*
        get website state from database and rout if it under maintenance.

        @tparam:

        @param:

        @returns:
    */
    websiteStatus() {
        this.dataBase.getDataWithoutClean("/settings", false, "sitemode").then(state => {
            if (!state.state) {
                window.location.href = '/#/underMaintenance';
            }
        });
    }

    /*
        Void function that receives news object of main news from view page
        and set the value of main news function with same receives value

        @tparam news: news object

        @param: identifier for needed news

        @returns:
    */
    changeMainNews(news) {

        this.mainNews = news;
        this.writer = this.writers.filter((el) => { return el.id == this.mainNews.writerId})[0].value;
        mvc.apply();
    }

    /*
        This function used to fetch category with specific id and assign it to "category" local variable for storing it.

        @tparam categoryId: int or string

        @param: identifier for needed category

        @returns:
    */
    getCategory(categoryId) {

        this.dataBase.getData("/categories/_design/allcategories/_view/new-view",true,'').then( data => {
            if (data) {
                this.category = data.filter((el) => { return el.id == categoryId})[0].value;
                mvc.apply();
            } else {
                this.getCategory();
            }
        }, () => {
            this.getCategory();
        });
    }

    /*
        This function used to fetch main news for specific category and assign it "listMainNews" to local variable for storing it.

        @tparam:

        @param:

        @returns:
    */
    getNews() {

        this.dataBase.findByIndex("/news",
                                ["_id", "title", "attachment", "seoDescription", "isMainNews", "createDate", "writerId"], "categoryId", mvc.routeParams.id).then( data => {

            if (data) {
                this.listMainNews = data.docs.filter((el) => { return el.isMainNews});
                if (this.listMainNews.lenght > 3) {
                    this.listMainNews = this.listMainNews.slice(0, 3);
                }
                this.mainNews = this.listMainNews[0];
                this.getWriters();
                mvc.apply();
            } else {
                this.getNews();
            }
        }, () => {
            this.getNews();
        });
    }

    /*
        This function used to fetch all news for specific category and assign it to "liftNewsInCategory and rightNewsInCategory" local variables for storing it.

        @tparam:

        @param:

        @returns:
    */
    getAllNews() {

        this.dataBase.findByIndex("/news", ["_id", "title", "attachment"],"categoryId", mvc.routeParams.id).then( data => {
            if (data) {
                let length = data.docs.length;
                this.liftNewsInCategory = data.docs.slice(0, length / 2);
                this.rightNewsInCategory = data.docs.slice(length / 2, length);
                mvc.apply();
            } else {
                this.getAllNews()
            }
        }, () => {
            this.getAllNews();
        });

    }

    /*
        This function used to fetch random news and assign it to "randomNews" local variable for storing it.

        @tparam:

        @param:

        @returns:
    */
    getRandomNews() {

        this.dataBase.getData("/news/_design/views/_view/random", true, '',).then( data => {
            if (data) {
                this.randomNews = data;
                if (this.randomNews.lenght > 10) {
                    this.randomNews = this.randomNews.slice(0, 10);
                }
                mvc.apply();
            } else {
                this.getRandomNews();
            }
        }, () => {
            this.getRandomNews();
        });

    }

    /*
        This function used to fetch Writers Data and assign it to "writers" local variable for storing it.

        @tparam:

        @param:

        @returns:
    */
    getWriters() {

        this.dataBase.getData("/users/_design/users/_view/generalinfo", true, '').then( data => {
            if (data) {
                this.writers = data;
                this.writer = this.writers.filter((el) => { return el.id == this.mainNews.writerId})[0].value;
                mvc.apply();
            } else {
                this.getWriters();
            }
        }, () => {
            this.getWriters();
        });

    }

}
