/*
    NNN website.

    This file is part of the NNN website.

    Authors:
        Diana Mujahed <diana.muj98@gmail.com>
        Qusai Hroub <qusaihroub.r@gmail.com>
        Aseel Arafeh <arafehaseel@gmail.com>

    File description:
        This file contains the controller class of header which applies Potato Framework.
 */

import { DataBase } from "../services/database.js";

export class Header {

    constructor() {

        this.dataBase = new DataBase();
        this.urgentNews = [];
        this.categoriesList = [];
        this.mainCategoriesList = [];
        this.moreCategoriesList = [];

        this.getUrgentNews();
        this.getCategoriesList();
    }

    /*
        This function used to retrieve all urgent news from database and assign urgentNews array with them.

        @tparam

        @param

        @returns

    */
    getUrgentNews() {

        this.dataBase.getData("/news/_design/views/_view/urgent", true, '').then( data => {
            if (data) {
                this.urgentNews = data;
                mvc.apply();
            } else {
                this.getUrgentNews();
            }
        }, () => {
            this.getUrgentNews();
        });

    }

    /*
        This function used to retrieve all categories name from database and assign categoriesList array with them.

        @tparam

        @param

        @returns

    */
    getCategoriesList() {

        this.dataBase.getData("/categories/_design/allcategories/_view/new-view", true, '').then( data => {
            if (data) {
                this.categoriesList = data;
                this.sliceCategoriesList();
                mvc.apply();
            } else {
                this.getCategoriesList();
            }
        }, () => {
            this.getCategoriesList();
        });

    }

    /*
        This function devides the categories list into two arrays to use the more option
        when the categories are more than 6

        @tparam

        @param

        @returns

    */
    sliceCategoriesList() {

        if (this.categoriesList.length > 5) {

            this.mainCategoriesList = this.categoriesList.slice(0, 5);
            this.moreCategoriesList = this.categoriesList.slice(5, this.categoriesList.length);

        } else {

            this.mainCategoriesList = this.categoriesList;
            this.moreCategoriesList = [];

        }

    }

}