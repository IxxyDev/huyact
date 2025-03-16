export function addEventListener(evName, handler, elem) {
	elem.addEventListener(evName, handler)
	return handler
}

export function addEventListeners(listeners = {}, elem) {
	const addedListeners = {}

	Object.entries(listeners).forEach(([evName, handler]) => {
		const listener = addEventListener(evName, handler, elem)
		addedListeners[evName] = listener
	})
	return addedListeners
}
