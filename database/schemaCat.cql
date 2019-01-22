DROP KEYSPACE if exists sunchamps_dev;

CREATE KEYSPACE sunchamps_dev
WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor': 1};

USE sunchamps_dev;

CREATE TABLE electronics (
	item_id int,
	name text,
	price decimal,
	stock int,
	onlist boolean,
	rating int,
	numofratings int,
	imgurl text,
	PRIMARY KEY (item_id)
);

CREATE TABLE beauty (
	item_id int,
	name text,
	price decimal,
	stock int,
	onlist boolean,
	rating int,
	numofratings int,
	imgurl text,
	PRIMARY KEY (item_id)
);

CREATE TABLE books (
	item_id int,
	name text,
	price decimal,
	stock int,
	onlist boolean,
	rating int,
	numofratings int,
	imgurl text,
	PRIMARY KEY (item_id)
);


CREATE TABLE music (
	item_id int,
	name text,
	price decimal,
	stock int,
	onlist boolean,
	rating int,
	numofratings int,
	imgurl text,
	PRIMARY KEY (item_id)
);

CREATE TABLE arts (
	item_id int,
	name text,
	price decimal,
	stock int,
	onlist boolean,
	rating int,
	numofratings int,
	imgurl text,
	PRIMARY KEY (item_id)
);

CREATE TABLE cartItems (
	item_id int,
	quantity int,
	name text,
	price decimal,
	stock int,
	onlist boolean,
	rating int,
	numofratings int,
	imgurl text,
	PRIMARY KEY (item_id)
);


-- CREATE TABLE category (
-- 	category_id int,
-- 	category text,
-- 	PRIMARY KEY (category_id)
-- );

-- INSERT INTO category (category_id, category) VALUES (1, 'electronics');
-- INSERT INTO category (category_id, category) VALUES (2, 'beauty');
-- INSERT INTO category (category_id, category) VALUES (3, 'books');
-- INSERT INTO category (category_id, category) VALUES (4, 'music');
-- INSERT INTO category (category_id, category) VALUES (5, 'arts');


COPY electronics (item_id, name, price, stock, onlist, rating, numofratings, imgurl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunkElectronics2M.csv';

COPY beauty (item_id, name, price, stock, onlist, rating, numofratings, imgurl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunkBeauty2M.csv';

COPY books (item_id, name, price, stock, onlist, rating, numofratings, imgurl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunkBooks2M.csv';

COPY music (item_id, name, price, stock, onlist, rating, numofratings, imgurl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunkMusic2M.csv';

COPY arts (item_id, name, price, stock, onlist, rating, numofratings, imgurl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunkArts2M.csv';
