#  NNN website.

# Potato Framework

Potato Framework is a development platform for building web applications using JavaScript.



## Structure

The framework is based on MVC (Model-Veiw-Controller).



## Routing

To create a new route, you have to add a new object to the routes array in the app.js file.

You should define the URL, template path, controller path, and the title of the view.

```
let routes = [
    {
        url: "/",
        template: "../templates/home.html",
        controller: "../controllers/home.js",
        title: "Home"
    },
    {
        url: "/news",
        template: "../templates/news.html",
        controller: "../controllers/news.js",
        title: "News"
    }
]
```



### Default route

You can specify the default path (if the user entered a non existing path) by adding an object with an empty path

```
{
	url: "",
	template: "../templates/404.html",
	controller: "../controllers/404.js",
	title: "Page not found"
}
```



### Passing Parameters

You can pass parameters in the URL, by adding them to the route URL.

Usage example:

```
{
    url: "/news/:type/:id",
    template: "../templates/news.html",
    controller: "../controllers/news.js",
    title: "News"
}
```

URL: ```https://example.com/#/news/2/14/```

The parameters are passed in the ```mvc.routeParams``` object. You can access it from the controller:

```
console.log(mvc.routeParams.id);
```

Output: ```14```



## Binding Variables

You can bind variables in the view pages by using this form : ```{{$varName}}```

Usage example:

```
Controller ->
    this.name = "John Smith";
    this.salary = 2500;
    this.transportation = 300;

View ->
    <p>Hello {{$name}}. Your salary is {{$salary * 0.98 + $transportation}}.

Output ->
    Hello John Smith. Your salary is 2750.
```

## Updating Variables

To update the view after getting a request or changing the data, you can use the ```mvc.apply()``` function.

Usage Example:

```
Controller ->
    sendRequest(data => {
        this.data = data;
        mvc.apply();
    });

View ->
    <span $for="d of data">
        <li>{{$d.title}}</li>
    </span>
```

## Custom Attributes

### $if

You can hide/unhide an element depending on a condition.

Form: ```<tag $if="condition"></tag>```

Usage example: ```<div $if="$news.type == 2"></div>```

### $disabled

You can disable/undisable an element (button) depending on a condition.

Form: ```<tag $disabled="condition"></tag>```

Usage example: ```<button $disabled="$isSubmitDisabled"></button>```

### $for

You can loop an element depending on an array defined in the scope object.

Form:
```
<tag $for="a of arr">
    <sub-tag></sub-tag>
</tag>
```

**Note:** The <sub-tag> will be repeated for each element of the arr **not the <tag>**.

Usage example:

```
<span $for="n of news">
    <ul>
        <li>{{$n.title}}</li>
        <li>{{$n.date}}</li>
    </ul>
</span>
```

### $class

You can add a class to an element depending on a condition.

Form: ```<tag $class="'className' : condition"></tag>```

Usage example: ```<p $class="'error' : $salary < 1500"></p>```

### $style

You can add a style to an element depending on a condition.

Form: ```<tag $style="'css-style' : condition"></tag>```

Usage example: ```<p $style="'background-color: red; color: #fff;' : $salary < 1500"></p>```

### $model

You can link an input value with a variable in the controller. Changes in the input value will update the variable and vice versa.

Form: ```<tag $model="variableName"></tag>```

Usage example:

```
Controller ->
    this.firstName = 'John';

View ->
    <input type="text" $model="firstName">
```

### $click

You can add a click attribute to an element to execute a specific function in the controller on clicking the element.

Form: ```<tag $click="functionName()"></tag>```

Usage example:

```
Controller ->
    constructor() { }
    getData() { console.log('Got Data!'); }

View ->
    <button $click="gotData()">Get Data</button>
```

### $change

You can add a change attribute to an input element to execute a specific function in the controller on changing the input value.

Form: ```<tag $change="functionName()"></tag>```

Usage example:

```
Controller ->
    constructor() { }
    updateData() { console.log('Updated Data!'); }

View ->
    <button $change="updateData()">Update Data</button>
```
### $include

include is used to import other view into the current view to reduce redundancy 

it can be used in 2 differents ways

1- using id:
    u need to add id proberty to the route element 
    eg:

```
    let routeList = [
    {
        id: "contact",
        url: "/contact",
        template: "/templates/contact.html",
        controller: "/controllers/contact.js",
        title: "some page"
    }];

    <div $include = "id:contact"></div>
```

2- calling Template and controller
   

```
    <div $include = "/templates/contact.html , /controllers/contact.js"></div>
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
