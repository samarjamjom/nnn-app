// Render function for "$style" special attribute 
// add or remove style depending on the expression
function renderStyle(exp, element) {
	let hashCode = function (str) {
		var hash = 0;
		if (str.length == 0) {
			return hash;
		}
		for (var i = 0; i < str.length; i++) {
			var char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		return hash;
	}

	let expGroup = exp.split(',');

	expGroup.forEach(ele => {
		let indx = ele.lastIndexOf(":");
		let e = [];
		e.push(ele.substring(0, indx).replace(/'/g, "").trim(), ele.substring(indx + 1).trim());

		let h = "mvc" + hashCode(e[0]);

		createCssClass(h, e[0]);

		renderClass(`${h} : ${e[1]}`, element);
	});
}