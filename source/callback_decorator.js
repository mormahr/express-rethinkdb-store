import Promise from "bluebird"

function noop() {
}

/**
 * Decorates a prmomise returning function to call a callback provided as the last argument
 *
 * @returns {Function}
 */
export default function (target, property, descriptor) {
	// Handle to the original function we want do decorate
	const old = descriptor.value
	descriptor.value = function () {
		/**
		 * @type {Array}
		 */
		const args_length = old.length

		/**
		 *
		 * @type {Function}
		 */
		const fn = arguments[args_length] || noop

		// Call the old function
		let promise = old.apply(this, Array.prototype.slice.call(arguments, 0, args_length))

		// Cast to bluebird promise
		promise = Promise.resolve(promise)

		// Call callback when promise resolves
		promise.asCallback(fn)
	}
}

