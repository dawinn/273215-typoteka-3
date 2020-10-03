/* список всех категорий */
select c.id,
       c.name
  from categories c;

/* список категорий, с хотя бы одной публикацией */
select c.id,
       c.name
  from categories c
 where (select count(1)
          from articles_categories oc
          where oc.category_id = c.id) != 0;

/* список всех категорий с количеством публикаций */
select c.id,
       c.name,
       (select count(1)
        from articles_categories oc
        where oc.category_id = c.id) count_articles
  from categories c;

/* список публикаций, сначала свежие */
select a.id,
       a.title,
       a.announce,
       a.create_date,
       u.name,
       u.surname,
       u.email,
       (select count(1)
          from comments c
         where c.article_id = a.id) count_comments,
       (select string_agg(c2.name, ',')
          from articles_categories oc
               join categories c2 on oc.category_id = c2.id
         where oc.article_id = a.id) categories
  from articles a
       join users u on u.id = 1
 order by a.create_date desc;

/* полная информаци публикации по её id */
select a.id,
       a.title,
       a.announce,
       a.create_date,
       u.name,
       u.surname,
       u.email,
       (select count(1)
          from comments c
         where c.article_id = a.id) count_comments,
       (select string_agg(c2.name, ',')
          from articles_categories oc
               join categories c2 on oc.category_id = c2.id
         where oc.article_id = a.id) categories
  from articles a
       join users u on u.id = 1
 where a.id = :article_id;

/* первые 5 свежих комментариев */
select c.id,
       c.article_id,
       u.name,
       u.surname,
       c.text
  from comments c
       join users u on c.user_id = u.id
order by c.created desc
limit 5;

/* список комментариев для определенной публикации, сначала новые */
select c.id,
       c.article_id,
       u.name,
       u.surname,
       c.text
  from comments c
       join users u on c.user_id = u.id
 where c.article_id = :article_id
order by c.created desc;

/* обновление заголовка публикации на заданный */
update articles
   set title = 'Как я встретил Новый Год'
 where id = :article_id;
