--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 12.4 (Ubuntu 12.4-1.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS typoteka;
--
-- Name: typoteka; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE typoteka WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'ru_RU.UTF-8' LC_CTYPE = 'ru_RU.UTF-8';


\connect typoteka

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(24) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    text character varying(1000) NOT NULL,
    created date NOT NULL,
    user_id bigint NOT NULL,
    article_id bigint NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    id bigint NOT NULL,
    title character varying(200) NOT NULL,
    announce character varying(400) NOT NULL,
    full_text character varying(8000) NOT NULL,
    picture_id bigint,
    create_date date NOT NULL,
    updated date NOT NULL
);


--
-- Name: articles_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles_categories (
    id bigint NOT NULL,
    article_id bigint NOT NULL,
    category_id bigint NOT NULL
);


--
-- Name: articles_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.articles_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: articles_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.articles_categories_id_seq OWNED BY public.articles_categories.id;


--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: pictures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pictures (
    id bigint NOT NULL,
    image character varying(50) NOT NULL,
    image2x character varying(50),
    background character varying(3)
);


--
-- Name: pictures_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pictures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pictures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pictures_id_seq OWNED BY public.pictures.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(100) NOT NULL,
    password character varying NOT NULL,
    name character varying(100) NOT NULL,
    surname character varying(100),
    avatar character varying(50)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: articles_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles_categories ALTER COLUMN id SET DEFAULT nextval('public.articles_categories_id_seq'::regclass);


--
-- Name: pictures id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pictures ALTER COLUMN id SET DEFAULT nextval('public.pictures_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: articles_categories articles_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: pictures pictures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_pkey PRIMARY KEY (id);


--
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: qi_articles_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qi_articles_title ON public.articles USING btree (title);


--
-- Name: u_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_categories_id ON public.categories USING btree (id);


--
-- Name: u_comments_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_comments_id ON public.comments USING btree (id);


--
-- Name: u_articles_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_articles_categories_id ON public.articles_categories USING btree (id);


--
-- Name: u_articles_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_articles_id ON public.articles USING btree (id);


--
-- Name: u_pictures_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_pictures_id ON public.pictures USING btree (id);


--
-- Name: u_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_users_email ON public.users USING btree (email);


--
-- Name: u_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_users_id ON public.users USING btree (id);


--
-- Name: comments fk_comments_author; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_author FOREIGN KEY (user_id) REFERENCES public.users(id);

--
-- Name: comments fk_comments_article; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_article FOREIGN KEY (article_id) REFERENCES public.articles(id);


--
-- Name: articles_categories fk_articles_categories_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT fk_articles_categories_category FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: articles_categories fk_articles_categories_article; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT fk_articles_categories_article FOREIGN KEY (article_id) REFERENCES public.articles(id);


--
-- Name: articles fk_articles_picture_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT fk_articles_picture_id FOREIGN KEY (picture_id) REFERENCES public.pictures(id);


--
-- Name: DATABASE typoteka; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON DATABASE typoteka TO dawinn;
GRANT ALL ON DATABASE typoteka TO dev;


--
-- PostgreSQL database dump complete
--
