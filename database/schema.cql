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
	relatedItems list<text>, 
	imgUrl text,
	PRIMARY KEY (item_id)
);


CREATE TABLE cartItems (
	item_id int,
	quantity int,
	PRIMARY KEY (item_id)
);



COPY items (item_id, name, price, stock, onList, rating, numOfRatings, relatedItems, imgUrl) FROM '/Users/achou/HRsf108/SDC/related_products_checkout/database/seedChunk.csv' WITH HEADER = true and NUMPROCESSES = 4	;

/*

*/