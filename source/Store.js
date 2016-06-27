import rethinkdbdash from "rethinkdbdash"
import callback_decorator from "./callback_decorator"

export default function (session) {
	class Store extends session.Store {
		constructor(options) {
			super()

			const r = this.r = rethinkdbdash(options.databaseOptions)
			this.emit("connect")

			this.sessionTimeout = options.sessionTimeout || 86400000 // 1 day
			this.table = options.table || "session"

			setInterval(() => {
				r.filter(
					r.row("expires").lt(r.now().toEpochTime().mul(1000))
				).delete()
				.catch(error => console.error(error))

			}, options.flushInterval || 60000 )
		}

		@callback_decorator
		async get(sid) {
			const r = this.r

			const session_data = await r.table(this.table).get(sid)
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
				expires: new Date().getTime() + (sess.cookie.originalMaxAge || this.sessionTimeout),
				data: sess
			}

			await r.table(this.table).insert(sessionToStore, {
				conflict: "replace",
				returnChanges: true
			})
		}

		@callback_decorator
		async destroy(sid) {
			const r = this.r

			await r.table(this.table).get(sid).delete()
		}
	}

	return Store
}
