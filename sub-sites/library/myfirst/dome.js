window.dome = (function () {
	function Dome(els) {
		for (var i = 0, len = els.length; i < len; i++) {
			this[i] = els[i];
		}
		this.length = els.length;
	}

	Dome.prototype = {
		map: function(callback) {
			var results = [];
			for (i = 0, len = this.length; i < len; i++) {
				results.push(callback.call(this, this[i], i));
			}
			return results;
		},
		forEach: function(callback) {
			this.map(callback);
			return this;
		},
		mapOne: function(callback) {
			var m = this.map(callback);
			return m.length > 1 ? m : m[0];
		},
		text: function(text) {
			if (typeof text !== "undefined") {
				return this.forEach(function(el) {
					el.innerText = text;
				});
			} else {
				return this.mapOne(function(el) {
					return el.innerText;
				});
			}
		},
		html: function(html) {
			if (typeof html !== "undefined") {
				return this.forEach(function(el) {
					el.innerHtml = html;
				});
			} else {
				return this.mapOne(function(el) {
					return el.innerHtml;
				});
			}
		},
		addClass: function(classes) {
			var className = "";
			if (typeof classes !== "string") {
				for (var i = 0, len = classes.length; i < len; i++) {
					className += " " + classes[i];
				}
			} else {
				className = " " + classes;
			}
			return this.forEach(function(el) {
				el.className += className;
			});
		},
		removeClass: function(classes) {
			return this.forEach(function (el) {
		        var cs = el.className.split(" "), i;
		 
		        while ( (i = cs.indexOf(clazz)) > -1) { 
		            cs = cs.slice(0, i).concat(cs.slice(++i));
		        }
		        el.className = cs.join(" ");
		    });
		},
		attr: function(attr, val) {
			if (typeof val !== "undefined") {
				return this.forEach(function(el) {
					el.setAttribute(attr, val);
				});
			} else {
				return this.mapOne(function(el) {
					return el.getAttribute(attr);
				});
			}
		},
		append: function(els) {
			return this.forEach(function(parEl, i) {
				els.forEach(function (childEl) {
					if (i > 0) {
		                childEl = childEl.cloneNode(true); 
		            }
		            parEl.appendChild(childEl);
				});
			});
		},
		appendTo: function(els) {
			return this.forEach(function(childEl) {
				els.forEach(function(parEl, i) {
					if (i > 0) {
		                childEl = childEl.cloneNode(true); 
		            }
		            parEl.appendChild(childEl);
				});
			});
		},
		prepend: function(els) {
			return this.forEach(function(parEl, i) {
				var childEl;
				for (var j = els.length - 1; j > -1; j--) {
					childEl = (i > 0) ? els[j].cloneNode(true) : els[j];
					parEl.insertBefore(childEl, parEl.firstChild);
				}
			});
		},
		prependTo: function(els) {
			return this.forEach(function(childEl) {
				els.forEach(function(parEl, i) {
					childEl = (i > 0) ? childEl.cloneNode(true) : childEl;
					parEl.insertBefore(childEl, parEl.firstChild);
				});
			});
		},
		remove: function() {
			return this.forEach(function(el) {
				return el.parentNode.removeChild(el);
			});
		}
	}

	Dome.prototype.on = (function() {
		if (document.addEventListener) {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el.addEventListener("on" + evt, fn);
				});
			};
		} else if (document.attachEvent) {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el.attachEvent("on" + evt, fn);
				});
			};
		} else {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el["on" + evt] = fn;
				});
			};
		}
	}());

	Dome.prototype.off = (function(){
		if (document.removeEventListener) {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el.removeEventListener(evt, fn, false);
				});
			};
		} else if (document.detachEvent) {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el.detachEvent("on" + evt, fn);
				});
			};
		} else {
			return function(evt, fn) {
				return this.forEach(function(el) {
					el["on" + evt] = null;
				});
			};
		}
	}());

	/* 兼容IE8的 Array.prototype.indexOf */
	if (typeof Array.prototype.indexOf !== "function") {
	    Array.prototype.indexOf = function (item) {
	        for(var i = 0, len = this.length; i < len; i++) {
	            if (this[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    };
	}

	return {
		get: function (selector) {
			var els;
			if (typeof selector === "string") {
				els = document.querySelectorAll(selector);
			} else if (selector.length) {
				els = selector;
			} else {
				els = [selector];
			}
			return new Dome(els);
		},
		create: function(tagName, attrs) {
			var el = new Dome([document.createElement(tagName)]);
			if (attrs) {
				if (attrs.className) {
					el.addClass(attrs.className);
					delete attrs.className;
				}
				if (attrs.text) {
					el.text(attrs.text);
					delete attrs.text;
				}
				for (var key in attrs) {
					if (attrs.hasOwnProperty(key)) {
						el.attr(key, attrs[key]);
					}
				}
			}
			return el;
		}
	};

}());