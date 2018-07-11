drop table if exists dream;

create table dream (
  id bigserial primary key,
  title varchar(255)
);

insert into dream (title) values ('Hear from you');
insert into dream (title) values ('Learn the secret of life');
insert into dream (title) values ('See the world');