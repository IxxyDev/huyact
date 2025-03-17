export class Dispatcher {
	#subscriptions = new Map()
	#afterHandlers = [];

	subscribe(cmdName, handler) {
		if (!this.#subscriptions.has(cmdName)) {
			this.#subscriptions.set(cmdName, [])
		}

		const handlers = this.#subscriptions.get(cmdName)
		if (handlers.includes(handler)) {
			return () => {}
		}

		handlers.push(handler)
		return () => {
			const idx = handlers.indexOf(handler)
			handlers.splice(idx, 1)
		}
	}

	afterEveryCommand(handler) {
		this.#afterHandlers.push(handler)

		return () => {
			const idx = this.#afterHandlers.indexOf(handler)
			this.#afterHandlers.splice(idx, 1)
		}
	}

	dispatch(cmdName, payload) {
		if (this.#subscriptions.has(cmdName)) {
			this.#subscriptions.get(cmdName).forEach(handler => handler(payload))
		} else {
			console.warn('No handlers for command: ' + cmdName)
		}

		this.#afterHandlers.forEach(handler => handler())
	}
}
