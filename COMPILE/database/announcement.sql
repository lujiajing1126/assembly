-- Table: announcement

-- DROP TABLE announcement;

CREATE TABLE announcement
(
  id bigserial NOT NULL,
  name character varying(400) NOT NULL,
  abstract text,
  url text NOT NULL,
  "time" timestamp with time zone NOT NULL,
  host text NOT NULL,
  category text NOT NULL,
  series text,
  hidden boolean,
  signature text NOT NULL,
  "timestamp" timestamp with time zone NOT NULL,
  CONSTRAINT announcement_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE announcement
  OWNER TO webdebugger;

-- Index: announcement_category

-- DROP INDEX announcement_category;

CREATE INDEX announcement_category
  ON announcement
  USING btree
  (category COLLATE pg_catalog."default");

-- Index: announcement_host

-- DROP INDEX announcement_host;

CREATE INDEX announcement_host
  ON announcement
  USING btree
  (host COLLATE pg_catalog."default");

-- Index: announcement_series

-- DROP INDEX announcement_series;

CREATE INDEX announcement_series
  ON announcement
  USING btree
  (series COLLATE pg_catalog."default");

-- Index: announcement_time

-- DROP INDEX announcement_time;

CREATE INDEX announcement_time
  ON announcement
  USING btree
  ("time");

