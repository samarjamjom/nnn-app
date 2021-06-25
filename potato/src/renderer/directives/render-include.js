let contMap = new Map();
let tempMap = new Map();

// include view and controller to the view
async function renderInclude(exp, element) 
{
	let tempPath, contPath;
	if(exp.includes(":"))
	{
		let id = exp.trim().substr(3,exp.length);
		let found = false;

		for(let i=0;i < mvc.routeMap.length;i++)
		{
			if(mvc.routeMap[i].id == id)
			{
				found = true;
				tempPath = mvc.routeMap[i].template;
				contPath = mvc.routeMap[i].controller;
				break;
			}
		}
		if(!found)
		{
			console.error("no such id " + id);
			return;
		}

	}
	else
	{
		let expGroup = exp.split(',');
		tempPath = expGroup[0].trim();
		contPath = expGroup[1].trim();
	}
	

	let template;
	let reload = false;
	if (tempMap.has(tempPath))
		template = tempMap.get(tempPath);
	else {
		template = await loadDoc(tempPath);
		tempMap.set(tempPath, template);
		reload = true;
	}

	let controller;
	if (contMap.has(contPath))
		controller = contMap.get(contPath);
	else {
		controller = await dynamicImport(contPath);
		controller = new controller[Object.keys(controller)[0]];
		contMap.set(contPath, controller);
		reload = true;
	}

	let oldScope = scope;
	scope = controller;

	var node = document.createElement("LI");
	node.innerHTML = template;
	renderTemplate(node);
	apply(node);
	element.innerHTML = node.innerHTML;

	scope = oldScope;
	if (reload) mvc.apply();
}
