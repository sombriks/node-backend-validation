--
-- test data so we have a known state in database to run tests
--
insert into addresses("description", complement)
values ('Road 01 residence', 'Flower block'),
  ('Dead end street', ''),
  ('Horses alley, no number ', 'Burrow #2'),
  ('Tomato avenue 110', ''),
  ('Old boulevard 45', 'uphill cabin');
insert into people("name")
values ('Alice'),
  ('Bob'),
  ('Caesar'),
  ('David'),
  ('Edward');
insert into addresses_people (addresses_id, people_id)
values (1, 1),
  (1, 2),
  (2, 3),
  (3, 4),
  (4, 5);
insert into phones(people_id, "number")
values (1, '1234'),
  (2, '5678'),
  (5, '9101112');