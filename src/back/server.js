const mariadb = require("mariadb");
const express = require("express");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const fs = require("fs");
const pdfExtract = new PDFExtract();
const options = {}; /* see below */
const testFolder = "/var/www/html/";

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
		let queryStr =
			"INSERT INTO USER VALUE ('ieuhcouqfvhvoubf', 'logintest', 'loginpwd', true)";
		let rows = await connection.query(queryStr);

		res.send(rows);
		console.log(rows);

		fs.readdir(testFolder, (err, files) => {
			console.log(files);
		});
	} catch (err) {
		throw err;
	} finally {
		if (connection) return connection.release();
	}
});

app.get("/nouveauDocument", async function (req, res) {
	const pool = mariadb.createPool(connectionOptions);
	pool
		.getConnection()
		.then((conn) => {
			conn
				.query("SELECT 1 as val")
				.then((rows) => {
					/* Récupération des chemins fichier */
					fs.readdir(testFolder, (err, files) => {
						if (files !== undefined) {
							files.forEach((file) => {
								pdfExtract.extract(testFolder + file, options, (err, data) => {
									if (err) return console.log(err);
									if (data.meta.metadata !== null) {
										Object.entries(data.meta.metadata).forEach(
											([key, value]) => {
												var donnees = [];
												donnees.push(file);
												donnees.push(file);
												if (data.meta.metadata[key]["dc:title"] === undefined)
													donnees.push(null);
												else donnees.push(data.meta.metadata[key]["dc:title"]);
												if (
													data.meta.metadata[key]["xmp:createdate"] ===
													undefined
												)
													donnees.push(null);
												else
													donnees.push(
														data.meta.metadata[key]["xmp:createdate"].substring(
															0,
															10
														)
													);
												if (
													data.meta.metadata[key]["xmp:modifydate"] ===
													undefined
												)
													donnees.push(null);
												else
													donnees.push(
														data.meta.metadata[key]["xmp:modifydate"].substring(
															0,
															10
														)
													);
												if (data.meta.metadata[key]["dc:creator"] === undefined)
													donnees.push(null);
												else
													donnees.push(data.meta.metadata[key]["dc:creator"]);
												donnees.push(null);
												donnees.push(testFolder + file);
												donnees.push(null);
												if (
													data.meta.metadata[key]["xmpmm:documentid"] ===
													undefined
												)
													donnees.push(null);
												else
													donnees.push(
														data.meta.metadata[key]["xmpmm:documentid"]
													);
												donnees.push(null);
												donnees.push(null);
												console.log("OK");
												/*conn.query(
													"INSERT IGNORE INTO DOCUMENT value (?,?,?,?,?,?,?,?,?,?,?,?)",
													[
														donnees[0],
														donnees[1],
														donnees[2],
														donnees[3],
														donnees[4],
														donnees[5],
														donnees[6],
														donnees[7],
														donnees[8],
														donnees[9],
														donnees[10],
														donnees[11],
													]
												);*/
											}
										);
									}
									else {
										console.log("Pas de métadonnées");
										/*conn.query(
											"INSERT IGNORE INTO DOCUMENT value (?,?,?,?,?,?,?,?,?,?,?,?)",
											[
												file,
												file,
												null,
												null,
												null,
												null,
												0,
												testFolder + file,
												null,
												null,
												null,
												null,
											]
										);*/
									}
								});
							});
						}
					});
				})
				.then((res) => {
					console.log(res);
					conn.end();
				})
				.catch((err) => {
					//handle error
					console.error(err);
					conn.end();
				});
		})
		.catch((err) => {
			//not connected
			console.error("Error: Not connected - ", err);
		});
});

app.listen(port, function () {
	console.log("Sample mariaDB app listening on port " + port);
});
