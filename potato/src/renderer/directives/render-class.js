// Render function for "$class" special attribute 
//add or remove a class depending on the expression
function renderClass(exp, element) {
    try {
        exp = exp.replace(/\$/g, "scope.");
        let expGroup = exp.split(',');
        expGroup.forEach(ele => {
            let splitStr = ele.split(":")
            let className = splitStr[0].replace(/'/g, "").trim();
            if (eval(splitStr[1])){
                element.classList.add(className);
            }
            else{
                element.classList.remove(className);
            }      
        });
    } catch (err) {
        console.log(err);
    }
}