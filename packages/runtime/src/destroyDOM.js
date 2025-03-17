import { removeEventListeners } from "./events";
import { DOM_TYPES } from "./h";

export function destroyDOM(vdom) {
	const { type } = vdom

	switch (type) {
		case DOM_TYPES.TEXT: {
			removeTextNode(vdom)
			break
		}
		case DOM_TYPES.ELEMENT: {
			removeElementNode(vdom)
			break
		}
		case DOM_TYPES.FRAGMENT: {
			removeFragmentNodes(vdom)
			break
		}
		default: {
			throw new Error('Cannot destroy DOM of type: ' + type)
		}
	}
}

function removeTextNode(vdom) {
	const { elem } = vdom
	elem.remove()
}

function removeElementNode(vdom) {
	const { elem, children, listeners } = vdom

	elem.remove()
	children.forEach(destroyDOM)

	if (listeners) {
		removeEventListeners(listeners, elem)
		delete vdom.listeners
	}
}

function removeFragmentNodes(vdom) {
	const { children } = vdom
	children.forEach(destroyDOM)
}
