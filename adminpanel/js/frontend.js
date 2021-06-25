function showLogOut() {
    let show = document.getElementById('logout-model');
    if (show.style.display == 'none' || show.style.display == '')
        show.style.display = 'flex';
    else
        show.style.display = 'none';
}
/*  
logOut is a function used to clear the data stored in sessionStorage and redirect the user to login 
@param: none
@return: none
*/
function logOut() {
    sessionStorage.clear();
    window.location.href = '#/login.html';
    checkName();
}
/*
    This is a function for general searching used in multiple pages 
    It used in category page tot search based on it's name, used in
    all users page to search based on user name and used in all news
    page to search based on news category name 
*/
/*  
searchElement is a function used to filter the data in the table by specific column index
@param: columnIndex, number 
@return: none
It edit directly the table
*/
function searchElement(columnIndex) {
    let searchInput, searchText, table, tableBody, tr, i, td, span, category;
    console.log(columnIndex);
    // get text from search input
    searchInput = document.getElementById('search');
    searchText = searchInput.value;

    // get all elements in the table body 
    table = document.getElementById('table');
    tableBody = document.getElementsByTagName("tbody")[0];
    tr = tableBody.getElementsByTagName('tr');

    // traverse through each element in the table
    for (i = 0; i < tr.length; i++) {
        // get element searched for from each element in table
        td = tr[i].getElementsByTagName('td')[columnIndex];
        span = td.getElementsByTagName('span')[0];
        searchedElement = span.childNodes[0].nodeValue;

        //check if the element contain search text and filter the result
        if (searchedElement.indexOf(searchText) > -1)
            tr[i].style.display = "";
        else
            tr[i].style.display = "none";

    }
};