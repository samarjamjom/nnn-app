// adds a css class
function createCssClass(name, attr) 
{
	if (cm.has(name))
		return;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `.${name} { ${attr} }`;
	document.getElementsByTagName('head')[0].appendChild(style);

	cm.set(name, true);
}

// create action listener to a specific element
function eventListener(element, event, func) {
	let id;
	let elementID = element.getAttribute('id');
	if (elementID) {
		id = elementID;
	} else {
		id = uniqueId();
		element.setAttribute('id', id);
	}
	document.addEventListener(event, ev => {
		if (ev.target.getAttribute("id") != id) return;
		ev.preventDefault();
		func();
	});
};

// returns a random id
function uniqueId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return '_' + Math.random().toString(36).substr(2, 9);
};