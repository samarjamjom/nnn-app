//Render function for "$click" special attribute.
// function on click
function renderClick(exp, element) {
	try {
		exp = exp.replace(/\$/g, "scope.");
		eventListener(element, 'click', () => { eval('scope.' + exp); });
	} catch (err) {
		console.log(err);
	}
}