import { destroyDOM } from "./destroyDOM"
import { mountDOM } from "./mountDOM"

export function createApp({ state, view }) {
	let parentElem = null
	let vdom = null

	function renderApp() {
		if (vdom) {
			destroyDOM(vdom)
		}

		vdom = view(state)
		mountDOM(vdom, parentElem)
	}

	return {
		mount(_parentElem) {
			parentElem = _parentElem
			renderApp()
		}
	}
}
