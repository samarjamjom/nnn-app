/** 
       This is the main class to add new user 
*/
export class addusersController {
    /**
        This function (constructor) used to assign the initial value for the user information  
    */
    constructor() {
        this.userid = '';

        const userData = JSON.parse(sessionStorage.getItem('user'));// used to get the user information 
        if (!userData) {
            window.location.href = '/admin-panel-login/login.html';
            return;
        }

        this.db = null;
        this.btnTitle = 'انشاء مستخدم جديد'
        this._id = 0;
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.repassword = '';
        this.token = "";
        this.role = 1;
        this.state = 1;
        this.$submitted = false;
        this._rev = "";
        if (mvc.routeParams.id != 0) {
            this._id = mvc.routeParams.id;
        }
        /** update the user's information  */
        dynamicImport("./js/database.js").then(db => {
            this.db = db;
            if (this._id != 0) {
                this.getExistedUser().then(user => {
                    this._id = user._id;
                    this._rev = user._rev;
                    this.firstName = user.firstName;
                    this.lastName = user.lastName;
                    this.userid = user.username;
                    this.email = user.email;
                    this.repassword = user.password;
                    this.password = user.password;
                    this.token = user.token;
                    this.role = user.role;
                    this.state = user.state;
                    this.userid = user.userid;
                    this.btnTitle = "تعديل المستخدم";
                    mvc.apply();
                });


            }
        });
    }
    /** 
      This function used to save user information  
    */
    saveUser() {
        if (this.$submitted)
            return;
        this.$submitted = true;
        this.userid = document.getElementById('userid').value;
        let btn = document.getElementById('savebtn');
        btn.disabled = true;
        btn.style.background = '#042e64';
        if (this.repassword != this.password) {
            createToast("خطأ", 'كلمتا المرور غير متطابقات', "danger", "times-circle");
            btn.disabled = false;
            btn.style.background = '';
            this.$submitted = false;
            mvc.apply();
            return;
        }
        setTimeout(() => {
            this.$submitted = false;
            mvc.apply();
        }, 2500);
        let user = {
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.userid,
            email: this.email,
            password: this.password,
            token: this.token,
            role: this.role,
            state: this.state,
        }

        if (this._id != 0) {
            user['_rev'] = this._rev;
            user['_id'] = this._id;
            this.updateExistedUser(user, this._id).then(resp => {
                if (resp.ok) {
                    createToast("نجحت العملية", 'تم التعديل', "success", "check");
                    setTimeout(() => {
                        window.location.href = "#/allusers";
                        this.$submitted = false;
                        mvc.apply();
                    }, 1000);
                }
            });
            return;
        }
        this.CreateUserDB(user).then(resp => {
            if (resp.ok == true) {
                createToast("نجحت العملية", 'تم انشاء الحساب', "success", "check");
                setTimeout(() => {
                    window.location.href = "#/allusers";
                }, 1000);
            }
            btn.disabled = false;
            btn.style.background = '';
        })
    }
    /** 
       This function used to change the count of users   
       @param: none
       @returns: a data about all user used to increase the last counter by one 
   */
    getNewId() {
        return this.db.dbGet("/settings", false, "users");
    }
    /** 
           This function used to add the new user into database   
           @param: (data) this is the  input information about the user 
           @returns:status of opration ,if success or fail 
     */
    CreateUserDB(data) {
        return new Promise((resolve, reject) => {
            this.getNewId().then(request => {
                this.db.dbCreateOrUpdate("/users", data, data.username).then(response => {
                    request.counter = request.counter + 1;
                    this.db.dbCreateOrUpdate("/settings", request, request._id).then(response2 => {
                        resolve(response2);
                    });
                }, () => {
                    createToast("خطأ", 'اسم المستخدم مستعمل', "danger", "times-circle");
                    resolve({error:"used"});

                })
            })
        })
    }
    /** 
           This function used to get data for a user    
           @param: none
           @returns:all user's information 
    */
    getExistedUser() {
        return new Promise((resolve, reject) => {
            this.db.dbGet("/users/_design/users/_view/updateuser", true, this._id).then(user => {
                if (user.rows.length != 1) {
                    window.location.href = "#/home";
                    resolve(user);
                    return;
                }
                resolve(user.rows[0].value);
            })
        });
    }
    /** 
           This function used to update user's data   
           @param: (data) user's information 
           @param: (key) user's id 
           @returns:status of opration ,if success or fail 
    */
    updateExistedUser(data, key) {
        return new Promise((resolve, response) => {
            this.db.dbCreateOrUpdate("/users", data, key).then(response => {
                if (response.error) {
                    // window.location.href = "#/home";
                }
                resolve(response);
            });
        })
    }
}