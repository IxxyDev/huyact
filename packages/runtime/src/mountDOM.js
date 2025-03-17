import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";
import { DOM_TYPES } from "./h";

export function mountDOM(vdom, parentElem) {
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			createTextNode(vdom, parentElem)
			break
		}
		case DOM_TYPES.ELEMENT: {
			createElementNode(vdom, parentElem)
			break
		}
		case DOM_TYPES.FRAGMENT: {
			createFragmentNode(vdom, parentElem)
			break
		}
		default: {
			throw new Error('Cannot mount DOM of type: ' + vdom.type)
		}
	}
}

function createTextNode(vdom, parentElem) {
	const { value } = vdom

	const textNode = document.createTextNode(value)
	vdom.el = textNode

	parentElem.append(textNode)
}

function createElementNode(vdom, parentElem) {
	const { tag, props, children } = vdom
	const element = document.createElement(tag)

	addProps(element, props, vdom)
	vdom.el = element

	children.forEach(child => mountDOM(child, element))
	parentElem.append(element)
}

function createFragmentNode(vdom, parentElem) {
	const { children } = vdom
	vdom.el = parentElem

	children.forEach(child => mountDOM(child, parentElem))
}

function addProps(elem, props, vdom) {
	const { on: events, ...attrs } = props

	vdom.listeners = addEventListeners(events, elem)
	setAttributes(elem, attrs)
}
