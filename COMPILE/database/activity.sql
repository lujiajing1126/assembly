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
  series text,
  signature text NOT NULL,
  "timestamp" timestamp with time zone NOT NULL
);

-- Index: activity_category

-- DROP INDEX activity_category;

CREATE INDEX activity_category
  ON activity
  USING btree
  (category COLLATE pg_catalog."default");

-- Index: activity_host

-- DROP INDEX activity_host;

CREATE INDEX activity_host
  ON activity
  USING btree
  (host COLLATE pg_catalog."default");

-- Index: activity_series

-- DROP INDEX activity_series;

CREATE INDEX activity_series
  ON activity
  USING btree
  (series COLLATE pg_catalog."default");

-- Index: activity_time_begin

-- DROP INDEX activity_time_begin;

CREATE INDEX activity_time_begin
  ON activity
  USING btree
  (time_begin);

-- Index: activity_time_end

-- DROP INDEX activity_time_end;

CREATE INDEX activity_time_end
  ON activity
  USING btree
  (time_end);


