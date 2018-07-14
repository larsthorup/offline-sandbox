drop table if exists dream;

create table dream (
  id bigserial primary key,
  title varchar(255)
);

insert into dream (title) values ('Feed on love');
insert into dream (title) values ('Eat a varied diet');
insert into dream (title) values ('Visit places');