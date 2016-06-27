# express-rethinkdb-store

A (currently basic) implementation of a [RethinkDB](https://www.rethinkdb.com) [Session](https://github.com/expressjs/session) Store.

It's a complete rewrite based on [`express-session-rethinkdb`](https://github.com/armenfilipetyan/express-session-rethinkdb).

## Usage

```javascript
const session = require("express-session")
const RDBStore = require("express-rethinkdb-store")(session)

const options = {
	connectionOptions: {},
	table: "session"
}
const rdbStore = new RDBStore(options)

app.use(session({
	secret: "supersecret",
	cookie: "connect.sid",
	store: rdbStore,
	resave: false,
	saveUninitialized: false
}))
```
