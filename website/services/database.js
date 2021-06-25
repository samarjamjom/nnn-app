/*
    NNN website.

    This file is part of the NNN website.

    Authors:
        Qusai Hroub <qusaihroub.r@gmail.com>
        Aseel Arafeh <arafehaseel@gmail.com>

    File description:
        This file contains functions used to deal with database
*/

let BASEURL = 'https://541e1dc0-354b-4134-ae7d-5eaa533a1bf9-bluemix.cloudant.com';
let AUTHENTICATION = 'Basic NTQxZTFkYzAtMzU0Yi00MTM0LWFlN2QtNWVhYTUzM2ExYmY5LWJsdWVtaXg6NDU2YjA3NzhjODFjOWNiMDk5NzZkODU1NjQ5MDM2YzRlYTE1MTQwZTk5NDNlNWM2MGE5ZDM1MGMwNDU5YzIwMw=='

export class DataBase {

    /*
     *    Fetch data from dataBase
     *
     *    @tparam randomNews: isView: boolean, endpoint, BASEURL, id, AUTHENTICATION: string
     *
     *    @param endpoint: direct link or view, isView if the endpoint is View this must be true else must be false
     *                    id, BASEURL is dataBase base url, AUTHENTICATION dataBase key;
     *
     *    @returns list of fetched data.
     */
    getData (endpoint, isView, id) {

        return new Promise((resolve, reject) => {

            let url = BASEURL + endpoint;
            if (isView && id) {

                url += `?key=\"${id}\"`;

            } else if (id !='') {

                url += `/${id}`;

            }

            let http = new XMLHttpRequest();
            http.open("GET", url);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.setRequestHeader('Accept', 'application/json');
            http.setRequestHeader("Authorization", AUTHENTICATION);
            http.onreadystatechange = function() {

                if (http.readyState == 4) {

                    if (http.status == 200) {
                        let data = JSON.parse(http.responseText);
                        let cleanedData = [];

                        if (!id || id == ''){

                            for (let i = 0; i < data.rows.length; i++)
                                cleanedData.push(data.rows[i]);

                        }
                        resolve(cleanedData);
                    } else {
                        reject();
                    }
                }
            }
            http.send();
        });
    }

    /*
     *    Fetch data from dataBase
     *
     *    @tparam randomNews: fields, value, index, endpoint: string
     *
     *    @param endpoint: direct link or view, BASEURL is dataBase base url, AUTHENTICATION dataBase key;
     *
     *    @returns list of fetched data.
     */
    findByIndex(endpoint, fields, index, value) {

        return new Promise((resolve, reject) => {

            let parameters = {
                'selector': {},
                'fields':fields,
            }

            parameters.selector[index] = value;
            const url = BASEURL + endpoint + `/_find`;
            let http = new XMLHttpRequest();
            http.open("POST", url);
            http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            http.setRequestHeader('Accept', 'application/json');
            http.setRequestHeader("Authorization", AUTHENTICATION);
            http.onreadystatechange = function() { //Call a function when the state changes.

                if (http.readyState == 4)
                    if (http.status == 200) {
                        resolve(JSON.parse(http.responseText));
                    } else {
                        reject();
                    }

            }
            http.send(JSON.stringify((parameters)));
        });
    }

    /*
     *    Fetch data from dataBase
     *
     *    @tparam randomNews: fields, value, index, endpoint: string
     *
     *    @param endpoint: direct link or view, BASEURL is dataBase base url, AUTHENTICATION dataBase key;
     *
     *    @returns list of fetched data.
     */
    dbFindByIndex(endpoint, fields, index, value) {

        return new Promise((resolve, reject) => {

            let parameters = {
                'selector': {
                    "createDate": {"$gte": null}
                },
                "sort": [{"createDate": "desc"}],
                'fields':fields,
            }

            parameters.selector[index] = value;
            const url = BASEURL + endpoint + `/_find`;
            let http = new XMLHttpRequest();
            http.open("POST", url);
            http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            http.setRequestHeader('Accept', 'application/json');
            http.setRequestHeader("Authorization", AUTHENTICATION);
            http.onreadystatechange = function() {

                if (http.readyState == 4)
                    if (http.status == 200) {
                        resolve(JSON.parse(http.responseText));
                    } else {
                        reject();
                    }
            }
            http.send(JSON.stringify((parameters)));
        });
    }

    /*
     *    Fetch data from dataBase
     *
     *    @tparam randomNews: isView: boolean, endpoint, id: string
     *
     *    @param endpoint: direct link or view, isView if the endpoint is View this must be true else must be false
     *                    id element id;
     *
     *    @returns list of fetched data .
     */
    getDataWithoutClean (endpoint, isView, id) {

        return new Promise((resolve, reject) => {

            let url = this.baseUrl + endpoint;
            if (isView && id) {

                url += `?key=\"${id}\"`;

            } else if (id !='') {

                url += `/${id}`;

            }

            let http = new XMLHttpRequest();
            http.open("GET", url);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.setRequestHeader('Accept', 'application/json');
            http.setRequestHeader("Authorization", this.authentication);
            http.onreadystatechange = function() {

                if (http.readyState == 4) {

                    if (http.status == 200) {
                        let data = JSON.parse(http.responseText);
                        resolve(data);
                    } else {
                        reject();
                    }
                }
            }
            http.send();
        });
    }
}
