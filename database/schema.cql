DROP KEYSPACE if exists sunchamps_dev;

CREATE KEYSPACE sunchamps_dev
WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor': 1};

USE sunchamps_dev;

CREATE TABLE items (
	item_id int,
	name text,
	price decimal,
	stock int,
	onList boolean,
	rating int,
	numOfRatings int,
	category_id int, 
	imgUrl text,
	PRIMARY KEY (item_id)
);


CREATE TABLE cartItems (
	item_id int,
	quantity int,
	PRIMARY KEY (item_id)
);

CREATE TABLE category (
	category_id int,
	category text,
	PRIMARY KEY (category_id)
);

INSERT INTO category (category_id, category) VALUES (1, 'electronics');
INSERT INTO category (category_id, category) VALUES (2, 'beauty');
INSERT INTO category (category_id, category) VALUES (3, 'books');
INSERT INTO category (category_id, category) VALUES (4, 'music');
INSERT INTO category (category_id, category) VALUES (5, 'arts');


COPY items (item_id, name, price, stock, onList, rating, numOfRatings, category_id, imgUrl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunkCat5M.csv' WITH HEADER = true and NUMPROCESSES = 4	;

/*

*/