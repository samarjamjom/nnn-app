//Render function for "$change" special attribute.
// run a function when a change happens on the a element
function renderChange(exp, element) {
	try {
		exp = exp.replace(/\$/g, "scope.");
		eventListener(element, 'change', () => { eval('scope.' + exp); });
	} catch (err) {
		console.log(err);
	}
}
