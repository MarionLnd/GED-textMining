CREATE DATABASE IF NOT EXISTS GED;

DROP TABLE IF EXISTS EXECUTE;
DROP TABLE IF EXISTS CONCERN;
DROP TABLE IF EXISTS DOCUMENT;
DROP TABLE IF EXISTS SUB_CATEGORY;
DROP TABLE IF EXISTS RULE;
DROP TABLE IF EXISTS ACTION;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS USER;
DROP EVENT IF EXISTS Supprimer;

CREATE TABLE USER (
	id_user INT PRIMARY KEY AUTO_INCREMENT,
	login VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	is_active BOOLEAN NOT NULL
);

CREATE TABLE CATEGORY (
	id_category VARCHAR(100) PRIMARY KEY,
	name VARCHAR(200) NOT NULL
);

CREATE TABLE ACTION (
	id_action INT PRIMARY KEY AUTO_INCREMENT,
	can_delete BOOLEAN NOT NULL,
	can_update BOOLEAN NOT NULL
);

CREATE TABLE RULE (
	id_rule INT PRIMARY KEY,
	archive_time INT NOT NULL,
	delete_time INT NOT NULL,
	archive_rule BOOLEAN NOT NULL,
	delete_rule BOOLEAN NOT NULL,
	details VARCHAR(100) NOT NULL
);

INSERT INTO RULE VALUE (10, 5, 5, true, true, "Archiver pendant 5 mois et Supprimer apres 5 mois");
INSERT INTO RULE VALUE (8, 4, 4, true, true, "Archiver pendant 4 mois et Supprimer apres 4 mois");
INSERT INTO RULE VALUE (6, 3, 3, true, true, "Archiver pendant 3 mois et Supprimer apres 3 mois");
INSERT INTO RULE VALUE (4, 2, 2, true, true, "Archiver pendant 2 mois et Supprimer apres 2 mois");
INSERT INTO RULE VALUE (2, 1, 1, true, true, "Archiver pendant 1 mois et Supprimer apres 1 mois");
INSERT INTO RULE VALUE (100, 3, 0, true, false, "Archiver pendant 3 mois puis Supprimer" );
INSERT INTO RULE VALUE (101, 0, 3, false , true, "Supprimer apres 3 mois" );

CREATE TABLE DOCUMENT (
	id_document VARCHAR(100) NOT NULL PRIMARY KEY,
	filename VARCHAR(250) NOT NULL,
	title VARCHAR(250) NULL,
	creation_date DATETIME NULL,
	modification_date DATETIME NULL,
	author VARCHAR(100) NULL,
	size FLOAT NULL,
	link VARCHAR(250) NULL,
	keywords JSON NULL,
	signature VARCHAR(200) NULL,
	id_rule INT NULL,
	id_category VARCHAR(100) NULL,
	isArchived BOOLEAN NULL,
	isDeleted BOOLEAN NULL,
	FOREIGN KEY (id_rule) REFERENCES RULE (id_rule)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	FOREIGN KEY (id_category) REFERENCES CATEGORY (id_category)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE CONCERN (
	id_action INT,
	id_category VARCHAR(100),
	PRIMARY KEY (id_action, id_category),
	FOREIGN KEY (id_action) REFERENCES ACTION (id_action),
	FOREIGN KEY (id_category) REFERENCES CATEGORY (id_category)
);

CREATE TABLE EXECUTE (
	id_action INT,
	id_user INT,
	PRIMARY KEY (id_action, id_user),
	FOREIGN KEY (id_action) REFERENCES ACTION (id_action),
	FOREIGN KEY (id_user) REFERENCES USER (id_user)
);