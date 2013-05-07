-- Table: activity

-- DROP TABLE activity;

CREATE TABLE activity
(
  id bigserial NOT NULL PRIMARY KEY,
  name character varying(400) NOT NULL,
  introduction text,
  url text NOT NULL,
  image_url text,
  time_begin timestamp with time zone NOT NULL,
  time_end timestamp without time zone,
  location text,
  host text NOT NULL,
  category text NOT NULL,
  serial text,
  signature text NOT NULL,
  "timestamp" timestamp with time zone NOT NULL
);

-- Index: category

-- DROP INDEX category;

CREATE INDEX category
  ON activity
  USING btree
  (category COLLATE pg_catalog."default");

-- Index: host

-- DROP INDEX host;

CREATE INDEX host
  ON activity
  USING btree
  (host COLLATE pg_catalog."default");

-- Index: serial

-- DROP INDEX serial;

CREATE INDEX serial
  ON activity
  USING btree
  (serial COLLATE pg_catalog."default");

-- Index: time_begin

-- DROP INDEX time_begin;

CREATE INDEX time_begin
  ON activity
  USING btree
  (time_begin);

-- Index: time_end

-- DROP INDEX time_end;

CREATE INDEX time_end
  ON activity
  USING btree
  (time_end);


