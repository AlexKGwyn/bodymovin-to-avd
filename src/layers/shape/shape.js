var masker = require ('../masker')
var transformer = require ('../transformer')
var layer = require ('../layer')
var drawableFactory = require ('./drawable')
var node = require ('../../node')

function shape(layerData, _level) {

	var drawables = [];
	var transforms = [];
	var level = _level || 0;
	var trimPath;

	var state = {
		shapes: layerData.shapes || layerData.it
	}

	function exportNode(name) {
		var groupName = name + '_drawable';
		var gr = node.createNode('group', groupName);
		var drawableNodes;
		var i, len = drawables.length;
		var j, jLen;
		for(i = 0; i < len; i += 1) {
			drawableNodes = drawables[i].exportDrawables(groupName, state.timeOffset);
			jLen = drawableNodes.length;
			for(j = 0; j < jLen; j += 1) {
				node.nestChild(gr, drawableNodes[j]);
			}
		}
		return gr;
	}

	function addPathToDrawables(path) {
		var i, len = drawables.length;
		for(i = 0; i < len; i += 1) {
			drawables[i].addPath(path, transforms, level);
		}
	}

	function traverseShapes() {
		var i,  len = state.shapes.length;
		var shapeGroup, drawable;
		var localDrawables = [];
		for (i = len - 1; i >= 0; i -= 1) {
			if(state.shapes[i].ty === 'gr') {
				shapeGroup = shape(state.shapes[i], level + 1);
				shapeGroup.setTimeOffset(state.timeOffset);
				shapeGroup.setFrameRate(state.frameRate);
				shapeGroup.setDrawables(drawables)
				.setTransforms(transforms)
				.setTrimPath(trimPath)
				.traverseShapes();
			} else if(state.shapes[i].ty === 'fl' || state.shapes[i].ty === 'st') {
				drawable = drawableFactory(state.shapes[i], level, state.timeOffset, state.frameRate);
				drawables.push(drawable);
				localDrawables.push(drawable);
			} else if(state.shapes[i].ty === 'tr') {
				transforms.push(state.shapes[i]);
			} else if(state.shapes[i].ty === 'sh') {
				addPathToDrawables(state.shapes[i]);
			} else if(state.shapes[i].ty === 'tm') {
				trimPath = state.shapes[i];
			} else {
				console.log(state.shapes[i].ty)
			}
		}

		len = localDrawables.length;
		for(i = 0; i < len; i += 1) {
			drawable = localDrawables[i];
			drawable.close();
		}
		return factoryInstance;
	}

	function setTrimPath(_trimPath) {
		trimPath = _trimPath;
		return factoryInstance;
	}

	function setDrawables(_drawables) {
		drawables = _drawables;
		return factoryInstance;
	}

	function setTransforms(_transforms) {
		var i, len = _transforms.length;
		for(i = 0; i < len; i += 1) {
			transforms.push(_transforms[i]);
		}
		return factoryInstance;
	}

	var factoryInstance = {
		setDrawables: setDrawables,
		setTransforms: setTransforms,
		setTrimPath: setTrimPath,
		traverseShapes: traverseShapes,
		exportNode: exportNode
	};
	Object.assign(factoryInstance, layer(state), masker(state), transformer(state)); 
	
	return factoryInstance;
}

module.exports = shape;