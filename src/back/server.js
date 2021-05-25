const mariadb = require("mariadb/callback");
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

app.get("/nouveauDocument", async function (req, res) {
	const pool = mariadb.createPool(connectionOptions);
	pool.getConnection((err, conn) => {
			conn
				.query("SELECT 1 as val",(err, result) => {
					/* Récupération des chemins fichier */
					fs.readdir(testFolder, (err, files) => {
						if (files !== undefined) {
							files.forEach((file) => {
								pdfExtract.extract(testFolder + file, options, (err, data) => {
									if (err) return console.log(err);
									if (data.meta.metadata !== null && data.meta.info !== null) {
										console.log("META + INFO")
										/*console.log(file)
										console.log(data.meta.metadata)
										console.log(data.meta.info)*/
										Object.entries(data.meta.metadata).forEach(
											([key, value]) => {
												var donnees = [];
												// ID
												donnees.push(file);
												// filename
												donnees.push(file);
												// Title
												if (data.meta.metadata[key]["dc:title"] !== undefined && data.meta.info.Title === undefined)
													donnees.push(data.meta.metadata[key]["dc:title"]);
												else if (data.meta.metadata[key]["dc:title"] === undefined && data.meta.info.Title !== undefined)
													donnees.push(data.meta.info.Title);
												else
													donnees.push(null);
												// Date Creation
												console.log(file)
												if((data.meta.metadata[key]["xmp:createdate"] !== undefined && data.meta.info.CreationDate === undefined) || (data.meta.metadata[key]["xmp:createdate"] !== undefined && data.meta.info.CreationDate !== undefined)){
													// console.log("date meta " + data.meta.metadata[key]["xmp:createdate"])
													donnees.push(data.meta.metadata[key]["xmp:createdate"].substring(0, 10))}
												else if (data.meta.metadata[key]["xmp:createdate"] === undefined && data.meta.info.CreationDate !== undefined){
													// console.log("date info " +data.meta.info.CreationDate)
													donnees.push(data.meta.info.CreationDate.substring(2,6)+'-'+data.meta.info.CreationDate.substring(6,8)+'-'+data.meta.info.CreationDate.substring(8,10))}
												else{
													donnees.push(null)}
												// Date modification
												if ((data.meta.metadata[key]["xmp:modifydate"] !== undefined && data.meta.info.ModDate === undefined) || (data.meta.metadata[key]["xmp:modifydate"] !== undefined && data.meta.info.ModDate !== undefined))
													donnees.push(data.meta.metadata[key]["xmp:modifydate"].substring(0, 10));
												else if (data.meta.metadata[key]["xmp:modifydate"] === undefined && data.meta.info.ModDate !== undefined)
													donnees.push(data.meta.info.ModDate.substring(2,6)+'-'+data.meta.info.ModDate.substring(6,8)+'-'+data.meta.info.ModDate.substring(8,10));
												else
													donnees.push(null)
												// Author
												if (data.meta.metadata[key]["dc:creator"] !== undefined && data.meta.info.Author === undefined)
													donnees.push(data.meta.metadata[key]["dc:creator"]);
												else if (data.meta.metadata[key]["dc:creator"] === undefined && data.meta.info.Author !== undefined)
													donnees.push(data.meta.info.Author)
												else
													donnees.push(null)
												// Size
												donnees.push(null);
												// Link
												donnees.push(testFolder+file);
												//Keywords
												donnees.push(null);
												// Signature
												if(data.pdfInfo === undefined)
													donnees.push(null)
												else if (data.pdfInfo.fingerprint === undefined )
													donnees.push(null)
												else
													donnees.push(data.pdfInfo.fingerprint);
												//id_rule
												donnees.push(null);
												//id_subcategory
												donnees.push(null);

												console.log(donnees)

												conn.query(
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
												);
											}
										);
									}
									else if (data.meta.metadata !== null && data.meta.info === null) {
										console.log("META sans INFO")
										/*console.log(file)
										console.log(data.meta.metadata)
										console.log(data.pdfInfo)*/
										Object.entries(data.meta.metadata).forEach(
											([key, value]) => {
												var meta = [];
												// ID
												meta.push(file);
												//Filename
												meta.push(file);
												// Title
												if (data.meta.metadata[key]["dc:title"] === undefined)
													meta.push(null);
												else meta.push(data.meta.metadata[key]["dc:title"]);
												// Date Creation
												console.log(file)
												// console.log("Date Meta " + data.meta.metadata[key]["xmp:createdate"])
												if (data.meta.metadata[key]["xmp:createdate"] === undefined)
													meta.push(null);
												else
													meta.push(data.meta.metadata[key]["xmp:createdate"].substring(0, 10));
												// Modify Date
												if (data.meta.metadata[key]["xmp:modifydate"] === undefined)
													meta.push(null);
												else
													meta.push(data.meta.metadata[key]["xmp:modifydate"].substring(0, 10));
												// Creator
												if (data.meta.metadata[key]["dc:creator"] === undefined)
													meta.push(null);
												else
													meta.push(data.meta.metadata[key]["dc:creator"]);
												// Size
												meta.push(0);
												// Link
												meta.push(testFolder + file);
												// Keywords
												meta.push(null);
												// Signature
												if(data.pdfInfo === undefined)
													meta.push(null)
												else if (data.pdfInfo.fingerprint === undefined )
													meta.push(null)
												else
													meta.push(data.pdfInfo.fingerprint);
												// ID-Rule
												meta.push(null);
												// ID Sub
												meta.push(null);

												console.log(meta)
												conn.query(
													"INSERT IGNORE INTO DOCUMENT value (?,?,?,?,?,?,?,?,?,?,?,?)",
													[
														meta[0],
														meta[1],
														meta[2],
														meta[3],
														meta[4],
														meta[5],
														meta[6],
														meta[7],
														meta[8],
														meta[9],
														meta[10],
														meta[11],
													]
												);
											}
										);
									}
									else if (data.meta.metadata === null && data.meta.info !== null){
										console.log("INFO sans META")
										/*console.log(file)
										console.log(data.meta.metadata)
										console.log(data.pdfInfo)*/
										var infos = []
										// ID
										infos.push(file);
										// Filename
										infos.push(file);
										// Title
										if (data.meta.info.Title === undefined)
											infos.push(null)
										else
											infos.push(data.meta.info.Title);
										// Date Creation
										console.log(file)
										// console.log("Date Info" +data.meta.info.CreationDate)
										if (data.meta.info.CreationDate === undefined)
											infos.push(null)
										else
											infos.push(data.meta.info.CreationDate.substring(2,6)+'-'+data.meta.info.CreationDate.substring(6,8)+'-'+data.meta.info.CreationDate.substring(8,10));
										// Date Modif
										if(data.meta.info.ModDate === undefined)
											infos.push(null)
										else
											infos.push(data.meta.info.ModDate.substring(2,6)+'-'+data.meta.info.ModDate.substring(6,8)+'-'+data.meta.info.ModDate.substring(8,10));
										// Author
										if (data.meta.info.Author === undefined)
											infos.push(null)
										else
											infos.push(data.meta.info.Author);
										// Size
										infos.push(0);
										// Link
										infos.push(testFolder + file);
										//keyword
										infos.push(null);
										// Signature
										if(data.pdfInfo === undefined)
											infos.push(null)
										else if (data.pdfInfo.fingerprint === undefined )
											infos.push(null)
										else
											infos.push(data.pdfInfo.fingerprint);
										// Rule
										infos.push(null);
										// Sub
										infos.push(null)

										console.log(infos)
										conn.query(
											"INSERT IGNORE INTO DOCUMENT value (?,?,?,?,?,?,?,?,?,?,?,?)",
											[
												infos[0],
												infos[1],
												infos[2],
												infos[3],
												infos[4],
												infos[5],
												infos[6],
												infos[7],
												infos[8],
												infos[9],
												infos[10],
												infos[11],
											]
										);
									}
									else{
										console.log("RIEN")
										/*console.log(file)
										console.log(data.meta.metadata)
										console.log(data.pdfInfo)*/
										var pasInfos = [];
										//id_document VARCHAR(100) NOT NULL PRIMARY KEY,
										pasInfos.push(file)
										//	filename VARCHAR(250) NOT NULL,
										pasInfos.push(file)
										//	title VARCHAR(250) NULL,
										pasInfos.push(null)
										//	creation_date TIMESTAMP NULL,
										pasInfos.push(null)
										//	modification_date TIMESTAMP NULL,
										pasInfos.push(null)
										//	author VARCHAR(100) NULL,
										pasInfos.push(null)
										//	size FLOAT NULL,
										pasInfos.push(0)
										//	link VARCHAR(250) NULL,
										pasInfos.push(testFolder+file)
										//	keywords JSON NULL,
										pasInfos.push(null)
										//	signature VARCHAR(200) NULL,
										if(data.pdfInfo === undefined)
											pasInfos.push(null)
										else if (data.pdfInfo.fingerprint === undefined )
											pasInfos.push(null)
										else
											pasInfos.push(data.pdfInfo.fingerprint);
										//	id_rule INT NULL,
										pasInfos.push(null)
										//	id_subcategory INT NULL,*/
										pasInfos.push(null)

										console.log(pasInfos)
										conn.query(
											"INSERT IGNORE INTO DOCUMENT value (?,?,?,?,?,?,?,?,?,?,?,?)",
											[
												pasInfos[0],
												pasInfos[1],
												pasInfos[2],
												pasInfos[3],
												pasInfos[4],
												pasInfos[5],
												pasInfos[6],
												pasInfos[7],
												pasInfos[8],
												pasInfos[9],
												pasInfos[10],
												pasInfos[11],
											]
										)
									}
								});
							});
						}
					});
				})
				/*.then((res) => {
					console.log(res);
					conn.end();
				})
				.catch((err) => {
					//handle error
					console.error(err);
					conn.end();
				});*/
		})
		/*.catch((err) => {
			//not connected
			console.error("Error: Not connected - ", err);
		});*/
});

app.get("/home", async function (req, res) {
	console.log("MARIADB Connection config:");
	console.log(connectionOptions);
	const pool = mariadb.createPool(connectionOptions);
	let connection;
	try {
		pool.getConnection((err, conn) => {
			if (err) {
				console.log("not connected due to error: " + err);
			} else {
				console.log("connected ! connection id is " + conn.threadId);
				conn.end(); //release to pool
			}
			conn.query("SELECT * FROM DOCUMENT", (err, rows, meta) => {
				console.log("*********");
				if (err) throw err;
				console.log("$$$$$$$$$$");
				console.log(rows); //[ { 'now()': 2018-07-02T17:06:38.000Z } ]
			});
		});
	} catch (err) {
		throw err;
	} finally {
		if (connection) return connection.release();
	}
});

app.listen(port, function () {
	console.log("Sample mariaDB app listening on port " + port);
});
