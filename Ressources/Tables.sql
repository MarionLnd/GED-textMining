CREATE DATABASE IF NOT EXISTS GED;

DROP TABLE IF EXISTS EXECUTE;
DROP TABLE IF EXISTS CONCERN;
DROP TABLE IF EXISTS DOCUMENT;
DROP TABLE IF EXISTS SUB_CATEGORY;
DROP TABLE IF EXISTS RULE;
DROP TABLE IF EXISTS ACTION;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS USER;

CREATE TABLE USER (
	id_user INT PRIMARY KEY AUTO_INCREMENT,
	login VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	is_active BOOLEAN NOT NULL
);

CREATE TABLE CATEGORY (
	id_category INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(200) NOT NULL
);

CREATE TABLE ACTION (
	id_action INT PRIMARY KEY AUTO_INCREMENT,
	can_delete BOOLEAN NOT NULL,
	can_update BOOLEAN NOT NULL
);

CREATE TABLE RULE (
	id_rule INT PRIMARY KEY AUTO_INCREMENT,
	archive_time TIMESTAMP NOT NULL,
	delete_time TIMESTAMP NOT NULL,
	archive_rule BOOLEAN NOT NULL,
	delete_rule BOOLEAN NOT NULL
);

INSERT INTO RULE VALUE (10, 5, 5, true, true);
INSERT INTO RULE VALUE (8, 4, 4, true, true);
INSERT INTO RULE VALUE (6, 3, 3, true, true);
INSERT INTO RULE VALUE (4, 2, 2, true, true);
INSERT INTO RULE VALUE (2, 1, 1, true, true);
INSERT INTO RULE VALUE (100, 0, 0, true, false );
INSERT INTO RULE VALUE (101, 0, 0, false , true );

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
	id_category INT NULL,
	FOREIGN KEY (id_rule) REFERENCES RULE (id_rule)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	FOREIGN KEY (id_category) REFERENCES CATEGORY (id_category)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE TABLE CONCERN (
	id_action INT,
	id_category INT,
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