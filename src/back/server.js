const mariadb = require("mariadb");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;
const mariadbHost = process.env.MARIADB_HOST || "localhost";
const mariadbPort = process.env.MARIADB_PORT || "3306";
const mariadbUser = process.env.MARIADB_USER || "UserGed";
const mariadbPass = process.env.MARIADB_PASS || "GEDGROUPE4";
const mariadbDB = process.env.MARIADB_DB || "GED";

const connectionOptions = {
	host: mariadbHost,
	port: mariadbPort,
	user: mariadbUser,
	password: mariadbPass,
	database: mariadbDB,
};

app.get("/", async function (req, res) {
	console.log("MARIADB Connection config:");
	console.log(connectionOptions);

	const pool = mariadb.createPool(connectionOptions);
	let connection;

	try {
		connection = await pool.getConnection();

		let queryStr = "SELECT * FROM USER";
		let rows = await connection.query(queryStr);

		res.send(rows);
	} catch (err) {
		throw err;
	} finally {
		if (connection) return connection.release();
	}
});

app.listen(port, function () {
	console.log("Sample mariaDB app listening on port " + port);
});
