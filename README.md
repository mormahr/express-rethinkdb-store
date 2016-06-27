# express-rethinkdb-store

A (currently basic) implementation of a [RethinkDB](https://www.rethinkdb.com) [Session](https://github.com/expressjs/session) Store.

It's a complete rewrite based on [`express-session-rethinkdb`](https://github.com/armenfilipetyan/express-session-rethinkdb).

## Usage

```javascript
const session = require("express-session")
const RethinkStore = require("express-rethinkdb-store")(session)
const store = new RethinkStore()

app.use(session({
	secret: "supersecret",
	cookie: "connect.sid",
	store: store,
	resave: false,
	saveUninitialized: false
}))
```
**Be aware that `RethinkStore` is initialized with  `require("express-rethinkdb-store")(session)`**

So you have to call the required function with your session to get the RethinkStore class

## Features

* Completely written in ES6 / ES.next
* Highly readable (See [RethinkStore.js](source/RethinkStore.js))
* Data is loaded directly from database, so no stale data in a local cache
	* A cache utilizing RethinkDBs changefeeds is on the roadmap
* RethinkDB can't natively expire documents, so we remove expired sessions automatically after `flushInterval`
  milliseconds (60s by default). When a session gets requested it's expiry is automatically checked and, if expired,
  the session is removed.

## API
Example with default values
```javascript
new RethinkStore({
	connectionOptions: {},      // See: https://www.rethinkdb.com/api/javascript/#connect
	table: "session",           // Session table
	sessionTimeout: 86400000,   // Session timeout in milliseconds
	flushInterval: 60000        // Interval to delete expired sessions from database
})
```

### Internals

#### `callback_decorator`

Used to wrap the modern async/await functions (async functions that return a promise instead of using callbacks).

```javascript
// ES.next Syntax!
class RethinkStore extends session.Store {
	@callback_decorator
	async destroy(sid) {
		await r.table(this.table).get(sid).delete()
	}
}
```

After decoration `destroy` accepts a second parameter `cb`. This is required because `express-session` uses
callback-style
