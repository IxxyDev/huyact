import { destroyDOM } from "./destroyDOM"
import { Dispatcher } from "./dispatcher"
import { mountDOM } from "./mountDOM"

export function createApp({ state, view, reducers = {} }) {
	let parentElem = null
	let vdom = null

	const dispatcher = new Dispatcher()
	const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

	function emit(evName, payload) {
		dispatcher.dispatch(evName, payload)
	}

	for (const actionName in reducers) {
		const reducer = reducers[actionName]

		const subs = dispatcher.subscribe(actionName, (payload) => {
			state = reducer(state, payload)
		})

		subscriptions.push(subs)
	}

	function renderApp() {
		if (vdom) {
			destroyDOM(vdom)
		}

		vdom = view(state, emit)
		mountDOM(vdom, parentElem)
	}

	return {
		mount(_parentElem) {
			parentElem = _parentElem
			renderApp()
		}
	}
}
