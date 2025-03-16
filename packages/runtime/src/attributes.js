export function setAttributes(elem, attrs) {
	const { class: className, style, ...otherAttrs } = attrs

	if (className) {
		setClass(elem, className)
	}

	if (style) {
		Object.entries(style).forEach(([prop, value]) => {
			setStyle(elem, prop, value)
		})
	}

	for (const [name, value] of Object.entries(otherAttrs)) {
		setAttribute(elem, name, value)
	}
}

function setClass(elem, className) {
	elem.className = ''

	if (typeof className === 'string') {
		elem.className = className
	}

	if (Array.isArray(className)) {
		elem.classList.add(...className)
	}
}

function setStyle(elem, name, value) {
	elem.style[name] = value
}

function removeStyle(elem, name) {
	elem.style[name] = null
}

function setAttribute(elem, name, value) {
	if (value == null) {
		removeAttribute(elem, name)
	} else if (name.startsWith('data-')) {
		elem.setAttribute(name, value)
	} else {
		elem[name] = value
	}
}

function removeAttribute(elem, name) {
	elem[name] = null
	elem.removeAttribute(name)
}
