import rethinkdbdash from "rethinkdbdash"
import callback_decorator from "./callback_decorator"

export default function (session) {
	class Store extends session.Store {

		/**
		 *
		 * @param {Object} options Options
		 * @param {Object} [options.connectionOptions] {@link https://www.rethinkdb.com/api/javascript/#connect}
		 * @param {String} [options.table = "session"] Session table
		 * @param {Number} [options.sessionTimeout = 86400000] Session Timeout in milliseconds
		 * @param {Number} [options.flushInterval = 60000] Interval to delete expired sessions from database
		 */
		constructor(options) {
			super()

			options = options || {}
			this.r = rethinkdbdash(options.connectionOptions)
			this.emit("connect")

			this.sessionTimeout = options.sessionTimeout || 86400000 // 1 day
			this.table = options.table || "session"

			setInterval(() => {
				this.flush()
			}, options.flushInterval || 60000)
		}

		/**
		 * Delete expired sessions
		 *
		 * @returns {Promise}
		 */
		async flush() {
			const r = this.r

			try {
				await r.table(this.table).filter(
					r.row("expires").lt(r.now().toEpochTime().mul(1000))
				).delete()
			} catch (error) {
				console.error(error)
			}
		}

		@callback_decorator
		async get(sid) {
			const r = this.r

			const session_data = await r.table(this.table).get(sid)
			// provide a default for the filter `sess("expires")` operation
			.default({expires: 0})
			// use session or default to determine if session is expired
			.do(sess => r.branch(
				// condition for expiry
				sess("expires").lt(r.now().toEpochTime().mul(1000)),
				// if expired -> delete session and "return" false
				r.table(this.table).get(sid).delete().do(() => false),
				// if not expired -> return the session
				sess
			))

			if (session_data && session_data.data) {
				return session_data.data
			} else {
				return null
			}
		}

		@callback_decorator
		async set(sid, sess) {
			const r = this.r

			const sessionToStore = {
				id: sid,
				expires: this._getTTL(sess),
				data: sess
			}

			await r.table(this.table).insert(sessionToStore, {
				conflict: "replace"
			})
		}

		/**
		 * Compute TTL for given session
		 *
		 * @param {Object }sess
		 * @returns {Number} TTL
		 * @private
		 */
		_getTTL(sess) {
			return Date.now() + (sess.cookie.originalMaxAge || this.sessionTimeout)
		}

		@callback_decorator
		async destroy(sid) {
			const r = this.r

			await r.table(this.table).get(sid).delete()
		}
	}

	return Store
}
