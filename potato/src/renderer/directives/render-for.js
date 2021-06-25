
let forId = 0;
let formap = new Map();

// Render function for "$for" special attribute 
// repeat a specific element couple of times
function renderFor(exp, element) {
	try {
		// save and restore original date to be looped on
		let content = element.innerHTML;

		if (element.hasAttribute('data-forId')) {
			content = formap.get(element.getAttribute('data-forId'));
		}
		else {
			element.setAttribute('data-forId', forId);
			formap.set(forId + "", content);
			forId++;
		}

		// define the iteration symbol of this for loop
		let def = exp.split(':');
		let iterSymbol = 'i';
		if (def.length > 1)
			iterSymbol = def[1].trim();

		// define array and the element
		let subArr = def[0].split('of')[0].trim();
		let arrName = def[0].split('of')[1].trim();

		let array = eval('scope.' + arrName);
		if (!array) return;
		let iterregx = new RegExp(`\\$` + iterSymbol + '(?![a-z])', 'g');

		let newElement = "";

		for (let i = 0; i < array.length; i++) {
			let template = content.replace(new RegExp("\[$]" + subArr, 'g'), "$" + arrName + `[${i}]`).replace(iterregx, i);
			let oldval = scope[subArr];
			scope[subArr] = array[i];

			var node = document.createElement("tbody");
			node.innerHTML = template;
			renderTemplate(node);
			apply(node);
			template = node.innerHTML;

			scope[subArr] = oldval;
			newElement += template;
		}

		element.innerHTML = newElement;
	} catch (err) {
		console.log(err);
	}
}