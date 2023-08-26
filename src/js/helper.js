var timer;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

function startTimer() {
	timer = new Date();
	console.log("Timer Started");
}

function endTimer() {
	timerEnd = new Date();
	var dif = timerEnd.getTime() - timer.getTime();
	console.log("Timer: " + dif / 1000);
}

function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}
function getArabicNumbers(str) {
	var map =
		[
			"&\#1632;", "&\#1633;", "&\#1634;", "&\#1635;", "&\#1636;",
			"&\#1637;", "&\#1638;", "&\#1639;", "&\#1640;", "&\#1641;"
		];

	var newStr = "";

	str = String(str);

	for (i = 0; i < str.length; i++) {
		newStr += map[parseInt(str.charAt(i))];
	}

	return newStr;
}

function ifEmptyReplaceWithSpace(value) {
	if (value == "") {
		value = " &nbsp; ";
	}
	return value;
}

function processOnClick(event) {
	theDashboard = event.currentTarget.params.dashboard;
	theCurrentRecord = event.currentTarget.params.record;
	theCurrentItem = event.currentTarget.params.item;
	theFunction = event.currentTarget.params.theFunction;
	// First, stop event propagation
	//event.originalEvent.stopPropagation();
	//event.stopPropagation();
	//event.cancelBubble = true;
	//event.stopImmediatePropagation();

	//test = event.isPropagationStopped();
	//test2 = event.originalEvent.isPropagationStopped();

	//console.log("Clicked on", theCurrentRecord);
	theFunction.call(theCurrentItem, theDashboard, theCurrentRecord);
	//event.preventDefault();
	//event.originalEvent.preventDefault();
	//test3 = event.isDefaultPrevented();
	//test4 = event.originalEvent.isDefaultPrevented();
}

function splitDate(date, language) {
	if (language == "ar-AE") {
		var monthNames = ["", "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
			"يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
		];
	} else {
		var monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
	}
	var theDate = String(date).split("-");
	if (theDate) {
		if (theDate.length > 0) {
			var month = parseInt(theDate[1]);
			if (month < 1) {
				month = 1;
			}
			theDate[1] = monthNames[month];
			if (language == "ar-AE") {
				theDate[0] = getArabicNumbers(theDate[0]);
				theDate[2] = getArabicNumbers(theDate[2]);
			}
			return theDate;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/************* Jquery Replacement Functions *******************/
NodeList.prototype.wrap = function (wrapper) {
	// creating a temporary element to contain the HTML string ('wrapper'):
	var temp = document.createElement('div'),
		// a reference to the parent of the first Node:
		parent = this[0].parentNode,
		// a reference to where the newly-created nodes should be inserted:
		insertWhere = this[0].previousSibling,
		// caching a variable:
		target;

	// setting the innerHTML of the temporary element to what was passed-in:
	temp.innerHTML = wrapper;

	// getting a reference to the outermost element in the HTML string passed-in:
	target = temp.firstChild;

	// a naive search for the deepest node of the passed-in string:        
	while (target.firstChild) {
		target = target.firstChild;
	}

	// iterating over each Node:
	[].forEach.call(this, function (a) {
		// appending each of those Nodes to the deepest node of the passed-in string:
		target.appendChild(a);
	});

	// inserting the created-nodes either before the previousSibling of the first
	// Node (if there is one), or before the firstChild of the parent:
	parent.insertBefore(temp.firstChild, (insertWhere ? insertWhere.nextSibling : parent.firstChild));

}
Node.prototype.wrap = function (wrapper) {
	// creating a temporary element to contain the HTML string ('wrapper'):
	var temp = document.createElement('div'),
		// a reference to the parent of the first Node:
		parent = this.parentNode,
		// a reference to where the newly-created nodes should be inserted:
		insertWhere = this.previousSibling,
		// caching a variable:
		target;

	// setting the innerHTML of the temporary element to what was passed-in:
	temp.innerHTML = wrapper;

	// getting a reference to the outermost element in the HTML string passed-in:
	target = temp.firstChild;

	// a naive search for the deepest node of the passed-in string:        
	while (target.firstChild) {
		target = target.firstChild;
	}

	// appending each of those Nodes to the deepest node of the passed-in string:
	target.appendChild(this);

	// inserting the created-nodes either before the previousSibling of the first
	// Node (if there is one), or before the firstChild of the parent:
	if (parent){
		parent.insertBefore(temp.firstChild, (insertWhere ? insertWhere.nextSibling : parent.firstChild));
	}
  return target;
}

NodeList.prototype.unwrap = function () {
	this.forEach(function (el, index) {
		// get the element's parent node
		var parent = el.parentNode;

		// move all children out of the element
		while (el.firstChild) parent.insertBefore(el.firstChild, el);

		// remove the empty element
		parent.removeChild(el);
	});
}

Node.prototype.unwrap = function () {

		// get the element's parent node
		var parent = this.parentNode;

		// move all children out of the element
		while (this.firstChild) parent.insertBefore(this.firstChild, this);

		// remove the empty element
		parent.removeChild(this);

}

NodeList.prototype.appendChild = function (child) {
	this.forEach(function (el, index) {
		el.appendChild(child);
	});
}


Node.prototype.prependChild = function (child) {
	this.insertBefore(child, this.firstChild);
}


NodeList.prototype.remove = function () {
	this.forEach(function (el, index) {
		el.parentNode.removeChild(el);
	});
}


Node.prototype.remove = function (child) {
	this.parentNode.removeChild(this);
}


NodeList.prototype.hide = function () {
	this.forEach(function (el, index) {
		el.style.display = 'none';
	});
}

Node.prototype.hide = function () {
	this.style.display = 'none';
}

NodeList.prototype.show = function () {
	this.forEach(function (el, index) {
		el.style.display = 'block';
	});
}

Node.prototype.show = function () {
	this.style.display = 'block';
}


var createNodeListFromArray = (function () {
	// make an empty node list to inherit from
	var nodelist = document.createDocumentFragment().childNodes;
	// return a function to create object formed as desired
	return function (nodeArray) {
		var nodeLength = nodeArray.length;
		var nodeListObj = {
			'length': { value: nodeLength },
			'item': {
				"value": function (i) {
					return this[+i || 0];
				},
				enumerable: true
			}
		};
		for (var n in nodeArray) {
			var node = nodeArray[n];
			nodeListObj[n] = { value: node, enumerable: true };
		}
		return Object.create(nodelist, nodeListObj); // return an object pretending to be a NodeList
	};
}());

NodeList.prototype.querySelectorAll = function (selector) {
	var nodeArray = [];
	[].forEach.call(this, function (el) {
		var nodeList = el.querySelectorAll(selector);
		[].forEach.call(nodeList, function (el2) {
			nodeArray.push(el2);
		});
	});
	return createNodeListFromArray(nodeArray);
}

NodeList.prototype.addClickHandler = function (clickHandler, params) {
	[].forEach.call(this, function (el) {
		el.addEventListener('click', clickHandler, false);
		el.params = params;
	});
};

Node.prototype.addClickHandler = function (clickHandler, params) {
		this.addEventListener('click', clickHandler, false);
		this.params = params;
};

Node.prototype.toggleClass = function (className) {
	if (this.classList.contains(className)) {
		this.classList.remove(className);
	}else{
		this.classList.add(className);
	}
};

NodeList.prototype.toggleClass = function (className) {
	[].forEach.call(this, function (el) {
		el.toggleClass(className);
	});
};

/******** General Helper Functions *****/
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		enumerable: false,
		value: function (searchElement /*, fromIndex*/) {
			'use strict';
			var O = Object(this);
			var len = parseInt(O.length) || 0;
			if (len === 0) {
				return false;
			}
			var n = parseInt(arguments[1]) || 0;
			var k;
			if (n >= 0) {
				k = n;
			} else {
				k = len + n;
				if (k < 0) { k = 0; }
			}
			var currentElement;
			while (k < len) {
				currentElement = O[k];
				if (searchElement === currentElement ||
					(searchElement !== searchElement && currentElement !== currentElement)) {
					return true;
				}
				k++;
			}
			return false;
		}
	});
}

if (!String.prototype.replaceAll) {
	Object.defineProperty(String.prototype, 'replaceAll', {
		enumerable: false,
		value: function (find, replace) {
			var theString = String(this);
			if (theString) {
				return theString.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
			} else {
				return theString;
			}
		}
	});
}

var timer;
function startTimer() {
	timer = new Date();
	console.log("Timer Started");
}

function endTimer() {
	timerEnd = new Date();
	var dif = timerEnd.getTime() - timer.getTime();
	console.log("Timer: " + dif / 1000);
}

function clone(obj) {
	var copy;
	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj || obj.templateManager instanceof TemplateManager){
		return obj;
	}else if (obj instanceof HTMLDivElement){
		return obj; //obj.cloneNode(true)
	} 

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof HTMLElement){
		return obj.cloneNode(true);
	}else if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}


function stopEventPropagation(e) {
	//e.stopImmediatePropagation();
	e.preventDefault();
	e.stopPropagation();
}

// Check if 2 objects are equal (only checks first level)
function shallowCompare (o1, o2){
	for(var p in o1){
			if(o1.hasOwnProperty(p)){
					if(o1[p] !== o2[p]){
							return false;
					}
			}
	}
	for(var p in o2){
			if(o2.hasOwnProperty(p)){
					if(o1[p] !== o2[p]){
							return false;
					}
			}
	}
	return true;
};


function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}

function str(msg) {
	if (msg) {
		return String(msg).trim();
	}
	return "";
}