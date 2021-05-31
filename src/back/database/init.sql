CREATE DATABASE IF NOT EXISTS GED;

DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS CONCERN;
DROP TABLE IF EXISTS DOCUMENT;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS RULE;
DROP TABLE IF EXISTS ACTION;

CREATE TABLE ACTION (
	id_action INT PRIMARY KEY AUTO_INCREMENT,
	can_delete BOOLEAN NOT NULL,
	can_update BOOLEAN NOT NULL
);

CREATE TABLE CATEGORY (
	id_category VARCHAR(100) PRIMARY KEY,
	name VARCHAR(200) NOT NULL
);

CREATE TABLE RULE (
	id_rule INT PRIMARY KEY,
	archive_time INT NOT NULL,
	delete_time INT NOT NULL,
	archive_rule BOOLEAN NOT NULL,
	delete_rule BOOLEAN NOT NULL,
	details VARCHAR(100) NOT NULL
);

CREATE TABLE USER (
	id_user INT PRIMARY KEY AUTO_INCREMENT,
	login VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	is_active BOOLEAN NOT NULL,
    id_action INT NULL,
	FOREIGN KEY (id_action) REFERENCES ACTION (id_action)
);

CREATE TABLE DOCUMENT (
	id_document VARCHAR(100) NOT NULL PRIMARY KEY,
	filename VARCHAR(250) NOT NULL,
	title VARCHAR(250) NULL,
	creation_date DATETIME NULL,
	modification_date DATETIME NULL,
	author VARCHAR(100) NULL,
	size FLOAT NULL,
	link VARCHAR(250) NULL,
	keywords varchar(500) NULL,
	signature VARCHAR(200) NULL,
	id_rule INT NULL,
	id_category VARCHAR(100) NULL,
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

INSERT INTO ACTION(can_delete, can_update) VALUE (0, 0);
INSERT INTO ACTION(can_delete, can_update) VALUE (0, 1);
INSERT INTO ACTION(can_delete, can_update) VALUE (1, 1);

INSERT INTO USER(login, password, is_active, id_action) VALUE ('root', 'root', 1, 3);
INSERT INTO USER(login, password, is_active, id_action) VALUE ('student', 'student', 1, 2);
INSERT INTO USER(login, password, is_active) VALUE ('student_not_active', 'student', 0);

INSERT INTO RULE VALUE (10, 5, 5, true, true, "Archiver pendant 5 mois et supprimer apres 5 mois");
INSERT INTO RULE VALUE (8, 4, 4, true, true, "Archiver pendant 4 mois et supprimer apres 4 mois");
INSERT INTO RULE VALUE (6, 3, 3, true, true, "Archiver pendant 3 mois et supprimer apres 3 mois");
INSERT INTO RULE VALUE (4, 2, 2, true, true, "Archiver pendant 2 mois et supprimer apres 2 mois");
INSERT INTO RULE VALUE (2, 1, 1, true, true, "Archiver pendant 1 mois et supprimer apres 1 mois");
INSERT INTO RULE VALUE (100, 3, 0, true, false, "Archiver pendant 3 mois puis supprimer" );
INSERT INTO RULE VALUE (101, 0, 3, false , true, "Supprimer apres 3 mois" );
