CREATE TABLE IF NOT EXISTS users
(
    id serial NOT NULL,
    username character varying NOT NULL UNIQUE,
    password character varying NOT NULL,
    email character varying NOT NULL UNIQUE,
    display_name character varying,
    points integer NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);