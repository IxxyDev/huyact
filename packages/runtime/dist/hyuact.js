function addEventListener(evName, handler, elem) {
	elem.addEventListener(evName, handler);
	return handler
}
function addEventListeners(listeners = {}, elem) {
	const addedListeners = {};
	Object.entries(listeners).forEach(([evName, handler]) => {
		const listener = addEventListener(evName, handler, elem);
		addedListeners[evName] = listener;
	});
	return addedListeners
}
function removeEventListeners(listeners = {}, elem) {
	Object.entries(listeners).forEach(([evName, handler]) => {
		elem.removeEventListener(evName, handler);
	});
}

function withoutNulls(arr) {
	return arr.filter(item => item != null)
}

const DOM_TYPES = {
	TEXT: 'text',
	ELEMENT: 'element',
	FRAGMENT: 'fragment',
};
function h(tag, props = {}, children = []) {
	return {
		tag,
		props,
		children: mapTextNodes(withoutNulls(children)),
		type: DOM_TYPES.ELEMENT
	}
}
function mapTextNodes(children) {
	return children.map(child =>
		typeof child === 'string' ? hString(child) : child
	)
}
function hString(str) {
	return { type: DOM_TYPES.TEXT, value: str }
}
function hFragment(vNodes) {
	return {
		type: DOM_TYPES.FRAGMENT,
		children: mapTextNodes(withoutNulls(vNodes))
	}
}

function destroyDOM(vdom) {
	const { type } = vdom;
	switch (type) {
		case DOM_TYPES.TEXT: {
			removeTextNode(vdom);
			break
		}
		case DOM_TYPES.ELEMENT: {
			removeElementNode(vdom);
			break
		}
		case DOM_TYPES.FRAGMENT: {
			removeFragmentNodes(vdom);
			break
		}
		default: {
			throw new Error('Cannot destroy DOM of type: ' + type)
		}
	}
}
function removeTextNode(vdom) {
	const { elem } = vdom;
	elem.remove();
}
function removeElementNode(vdom) {
	const { elem, children, listeners } = vdom;
	elem.remove();
	children.forEach(destroyDOM);
	if (listeners) {
		removeEventListeners(listeners, elem);
		delete vdom.listeners;
	}
}
function removeFragmentNodes(vdom) {
	const { children } = vdom;
	children.forEach(destroyDOM);
}

class Dispatcher {
	#subscriptions = new Map()
	#afterHandlers = [];
	subscribe(cmdName, handler) {
		if (!this.#subscriptions.has(cmdName)) {
			this.#subscriptions.set(cmdName, []);
		}
		const handlers = this.#subscriptions.get(cmdName);
		if (handlers.includes(handler)) {
			return () => {}
		}
		handlers.push(handler);
		return () => {
			const idx = handlers.indexOf(handler);
			handlers.splice(idx, 1);
		}
	}
	afterEveryCommand(handler) {
		this.#afterHandlers.push(handler);
		return () => {
			const idx = this.#afterHandlers.indexOf(handler);
			this.#afterHandlers.splice(idx, 1);
		}
	}
	dispatch(cmdName, payload) {
		if (this.#subscriptions.has(cmdName)) {
			this.#subscriptions.get(cmdName).forEach(handler => handler(payload));
		} else {
			console.warn('No handlers for command: ' + cmdName);
		}
		this.#afterHandlers.forEach(handler => handler());
	}
}

function setAttributes(elem, attrs) {
	const { class: className, style, ...otherAttrs } = attrs;
	if (className) {
		setClass(elem, className);
	}
	if (style) {
		Object.entries(style).forEach(([prop, value]) => {
			setStyle(elem, prop, value);
		});
	}
	for (const [name, value] of Object.entries(otherAttrs)) {
		setAttribute(elem, name, value);
	}
}
function setClass(elem, className) {
	elem.className = '';
	if (typeof className === 'string') {
		elem.className = className;
	}
	if (Array.isArray(className)) {
		elem.classList.add(...className);
	}
}
function setStyle(elem, name, value) {
	elem.style[name] = value;
}
function setAttribute(elem, name, value) {
	if (value == null) {
		removeAttribute(elem, name);
	} else if (name.startsWith('data-')) {
		elem.setAttribute(name, value);
	} else {
		elem[name] = value;
	}
}
function removeAttribute(elem, name) {
	elem[name] = null;
	elem.removeAttribute(name);
}

function mountDOM(vdom, parentElem) {
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			createTextNode(vdom, parentElem);
			break
		}
		case DOM_TYPES.ELEMENT: {
			createElementNode(vdom, parentElem);
			break
		}
		case DOM_TYPES.FRAGMENT: {
			createFragmentNode(vdom, parentElem);
			break
		}
		default: {
			throw new Error('Cannot mount DOM of type: ' + vdom.type)
		}
	}
}
function createTextNode(vdom, parentElem) {
	const { value } = vdom;
	const textNode = document.createTextNode(value);
	vdom.el = textNode;
	parentElem.append(textNode);
}
function createElementNode(vdom, parentElem) {
	const { tag, props, children } = vdom;
	const element = document.createElement(tag);
	addProps(element, props, vdom);
	vdom.el = element;
	children.forEach(child => mountDOM(child, element));
	parentElem.append(element);
}
function createFragmentNode(vdom, parentElem) {
	const { children } = vdom;
	vdom.el = parentElem;
	children.forEach(child => mountDOM(child, parentElem));
}
function addProps(elem, props, vdom) {
	const { on: events, ...attrs } = props;
	vdom.listeners = addEventListeners(events, elem);
	setAttributes(elem, attrs);
}

function createApp({ state, view, reducers = {} }) {
	let parentElem = null;
	let vdom = null;
	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(renderApp)];
	function emit(evName, payload) {
		dispatcher.dispatch(evName, payload);
	}
	for (const actionName in reducers) {
		const reducer = reducers[actionName];
		const subs = dispatcher.subscribe(actionName, (payload) => {
			state = reducer(state, payload);
		});
		subscriptions.push(subs);
	}
	function renderApp() {
		if (vdom) {
			destroyDOM(vdom);
		}
		vdom = view(state, emit);
		mountDOM(vdom, parentElem);
	}
	return {
		mount(_parentElem) {
			parentElem = _parentElem;
			renderApp();
		},
		unmount() {
			destroyDOM(vdom);
			vdom = null;
			subscriptions.forEach(unsub => unsub());
		}
	}
}

export { createApp, h, hFragment, hString };
