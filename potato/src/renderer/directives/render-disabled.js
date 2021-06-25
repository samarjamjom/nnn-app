// Render function for "$disabled" special attribute 
// disable or enable an element depending on the exp
function renderDisabled(exp, element) {
	try {
		exp = exp.replace(/\$/g, "scope.");
		let result = eval(exp);
		element.disabled = result;
	} catch (err) {
		console.log(err);
	}
}