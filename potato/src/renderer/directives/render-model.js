function renderModel(exp, element) {
	try {
		element.setAttribute('id', exp);
		element.setAttribute('value', scope[exp]);
		eventListener(element, 'change', () => { scope[exp] = document.getElementById(exp).value; });
	} catch (err) {
		console.log(err);
	}
}