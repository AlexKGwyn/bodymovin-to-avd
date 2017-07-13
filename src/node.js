 function createNodeWithAttributes(tagName, attributes, name) {
 	var node = createNode(tagName, name);
 	var i, len = attributes.length;
 	for(i = 0; i < len; i += 1) {
 		addAttribute(node, attributes[i].key, attributes[i].value);
 	}
 	return node;
 }

 function isArray(element) {
 	var what = Object.prototype.toString;
 	return what.call(element)  === '[object Array]';
 }

 function createNode(tagName, name) {
 	var node = {
 		[tagName]:{_attr:{}}
 	};
 	if(name) {
 		addAttribute(node, 'android:name', name);
 	}
 	return node; 
 }

 function addAttribute(object, key, value) {
 	var tagName = getTagName(object);
 	var children = getChildren(object);
 	if(isArray(children)){
 		var i = 0, len = children.length;
	 	var attrsContainer;
	 	while(i < len) {
	 		if(children[i]._attr) {
	 			attrsContainer = children[i];
	 			break;
	 		}		
	 		i += 1;
	 	}
	 } else {
	 	attrsContainer = children;
	 }
 	
 	if (!attrsContainer) {
 		attrsContainer = {_attr:{}};
 		object[tagName] = attrsContainer;
 	}
 	attrsContainer._attr[key] = value;
 }

 function getTagName(nodeElem) {
 	var keys = Object.keys(nodeElem);
 	return keys[0];
 }

 function getAttribute(nodeElem, key) {
 	var children = getChildren(nodeElem);
 	if(isArray(children)){
	 	var i =0, len = children.length;
	 	while(i < len) {
	 		if(children[i]._attr && children[i]._attr[key]) {
	 			return children[i]._attr[key];
	 		}
	 		i += 1;
	 	}
	} else if(children._attr && children._attr[key]) {
		return children._attr[key];
	}
 	return '';
 }

function getChildren(nodeElem) {
 	var nodeTagName = getTagName(nodeElem);
 	var children = nodeElem[nodeTagName];
 	return children;
}

 function getChild(nodeElem, childName) {
 	var children = getChildren(nodeElem);
 	if(isArray(children)){
	 	var i =0, len = children.length, tagName;
	 	while(i < len) {
	 		tagName = getTagName(children[i]);
	 		if(tagName === childName) {
	 			return children[i];
	 		}
	 		i += 1;
	 	}
	}
	return '';
 }

 function nestChild(nodeElem, nested) {
 	var tagName = getTagName(nodeElem);
 	if(!isArray(nodeElem[tagName])){
 		var attrs = nodeElem[tagName];
 		nodeElem[tagName] = [attrs];
 	}
 	nodeElem[tagName].push(nested);
 }

 function cloneNode(node, targets, suffix) {
 	var cloningNode = JSON.parse(JSON.stringify(node));
 	renameNode(cloningNode, targets, suffix);
 	return cloningNode;
 }

 function renameNode(nodeElem, targets, suffix) {
 	var children = getChildren(nodeElem);
 	if(children && isArray(children)) {
	 	var i, len = children.length;
	 	for( i = 0; i < len; i += 1) {
	 		renameNode(children[i], targets, suffix);
	 	}
 	}
 	var androidName = getAttribute(nodeElem, 'android:name');
 	if(androidName) {
 		duplicateTargets(targets, androidName, androidName + suffix);
 		addAttribute(nodeElem, 'android:name', androidName + suffix);
 	}
 }

 function duplicateTargets(targets, name, newName) {
 	var i, len = targets.length, newTarget;
 	for( i = 0 ; i < len; i += 1) {
 		if(targets[i].target[0]._attr['android:name'] === name) {
 			newTarget = JSON.parse(JSON.stringify(targets[i]));
 			newTarget.target[0]._attr['android:name'] = newName;
 			targets.push(newTarget);
 		}
 	}
 }

 module.exports = {
 	createNode: createNode,
 	createNodeWithAttributes: createNodeWithAttributes,
 	addAttribute: addAttribute,
 	getTagName: getTagName,
 	getAttribute: getAttribute,
 	nestChild: nestChild,
 	getChild: getChild,
 	getChildren: getChildren,
 	cloneNode: cloneNode
 }