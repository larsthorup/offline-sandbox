drop table if exists dream;

create table dream (
  id bigserial primary key,
  title varchar(255)
);

insert into dream (title) values ('Feed on love');
insert into dream (title) values ('Eat a varied diet');
insert into dream (title) values ('Visit places');

create or replace function dream_insert_notify() returns trigger as $$
declare
begin
  perform pg_notify('dream:inserted', row_to_json(new)::text);
  return new;
end;
$$ language plpgsql;

create trigger dream_trigger after insert on dream
for each row execute procedure dream_insert_notify();