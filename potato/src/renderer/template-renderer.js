// Define global variables
let scope = {};
let testedSpecials = [];
let bindedVars;
let cm = new Map();

// Classes
// Holds data required to a special atributes
class AttrData {
	constructor(query, render) {
		this.type = query.replace("\\", "").replace("\$", "");
		this.query = query;
		this.render = render;
	}
}

// Special attribute class
// class contains element and related special tags
class SpecialAttr {
	constructor(type, element, render) {
		this.attr = type;
		this.element = element;
		this.exp = element.getAttribute("$" + type);
		this.render = render;
	}
}

// List of all special tags with their render functionality
const specails = [
	new AttrData("\\$for", renderFor),
	new AttrData("\\$if", renderIf),
	new AttrData("\\$disabled", renderDisabled),
	new AttrData("\\$style", renderStyle),
	new AttrData("\\$class", renderClass),
	new AttrData("\\$click", renderClick),
	new AttrData("\\$model", renderModel),
	new AttrData("\\$change", renderChange),
	new AttrData("\\$include", renderInclude)
];

// Pulls special tags from a given html
function collectSpecialTags(doc) {
	let specialTags = [];

	// Find all special tags and format them
	for (let i = 0; i < specails.length; i++) {
		let elements = doc.querySelectorAll(`[${specails[i].query}]`);
		elements = [...elements].map(element => element = new SpecialAttr(specails[i].type, element, specails[i].render));
		specialTags = specialTags.concat(elements);
	}

	return specialTags;
}

// Executes {{exp}} using data of a model
function replaceElement(attrString) {
	let value = attrString.replace('$', "scope.");
	value = eval(value);
	return value == undefined ? '' : value;
}

// Replace the binded variable with its real value in html
function apply(doc) {
	let str;
	if (!doc) {
		str = bindedVars;
		doc = viewElement;
	}
	else {
		str = doc.innerHTML;
	}
	str = str.replace(/(\{\{.*?\}\})/g, replaceElement);
	doc.innerHTML = str;
	return doc;
}

// render a specific element
function renderTemplate(view) {
	let specials = collectSpecialTags(view);
	specials.forEach(element => {
		if (testedSpecials.filter(elem => elem.element.isEqualNode(element.element) && elem.attr == element.attr).length == 0) {
			testedSpecials.push(element);
			element.render(element.exp, element.element);
		}
	});
	testedSpecials = [];
}
// update the value of the view and model and render a specific element
function render(view, model, update = false) {
	if (model != null) scope = model;
	if (update) apply();
	renderTemplate(view);
	if (!bindedVars) bindedVars = view.innerHTML;

	if (!update) {
		bindedVars = view.innerHTML;
		apply(view);
	}

	return view;
}

// clear render 
function clearRender() {
	contMap.forEach((value, key, mp) => {
		delete value;
	})
	contMap.clear();
	tempMap.clear();
}