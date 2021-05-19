const mariadb = require("mariadb");
const express = require("express");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {}; /* see below */
const testFolder = '/Users/user/Desktop/CoursENTP';
const fs = require('fs');

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
		fs.readdir(testFolder, (err, files) => {
			files.forEach(file => {
				pdfExtract.extract('/Users/user/Desktop/CoursENTP/'+file, options, (err, data) => {
					if (err) return console.log(err);
					//console.log(file + " auteur " + data.meta.metadata);
					console.log(file + " auteur " + data.meta.info.Author);
				});
			});
		});
	} catch (err) {
		throw err;
	} finally {
		if (connection) return connection.release();
	}
});

app.get("/nouveauDocument", async function (req, res) {
	const pool = mariadb.createPool(connectionOptions);
	pool.getConnection()
		.then(conn => {
			conn.query("SELECT 1 as val")
				.then((rows) => {
					conn.query('INSERT INTO DOCUMENT value (?,?,?,?,?,?,?,?,?,?,?,?)', [data.meta.metadata._metadata.title, "2018"]);
					/* Récupération des chemins fichier
					fs.readdir(testFolder, (err, files) => {
						files.forEach(file => {
							pdfExtract.extract('/Users/user/Desktop/CoursENTP/'+file, options, (err, data) => {
								if (err) return console.log(err);
							});
						});
					});*/
				})
				.then((res) => {
					console.log(res);
					conn.end();
				})
				.catch(err => {
					//handle error
					console.log(err);
					conn.end();
				})
		}).catch(err => {
		//not connected
	});
});

app.listen(port, function () {
	console.log("Sample mariaDB app listening on port " + port);
});
