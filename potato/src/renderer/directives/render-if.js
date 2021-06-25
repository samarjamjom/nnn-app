// Render function for "$if" special attribute 
// showing or hiding the element depending on the value of the expression
function renderIf(expression, element) {
	try {
		let exp = expression.replace(/\$/g, "scope.");
		createCssClass('hide', 'display: none');
		//check the expression in if attribute.  
		let result = eval(exp);
		//check if the expression true then the hide class will be removed if exist to display the element
		if (result) {
			if (element.classList.contains('hide')) {
				element.classList.remove('hide');
			}
		}
		//if false we will add hide class to hide the element.
		else {
			if (!element.classList.contains('hide')) {
				element.classList.add('hide')
			}
		}
	} catch (err) {
		console.log(err);
	}
}