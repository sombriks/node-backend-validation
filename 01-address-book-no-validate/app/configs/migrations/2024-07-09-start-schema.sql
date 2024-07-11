--
-- base tables
-- 
-- addresses in the book
create table addresses(
  id serial primary key,
  "description" text not null,
  "complement" text not null,
  created timestamp not null default now(),
  updated timestamp not null default now()
);
-- people, a person with zero or more addresses
create table people(
  id serial primary key,
  "name" text not null,
  created timestamp not null default now(),
  updated timestamp not null default now()
);
-- N:N cardinality
create table addresses_people(
  addresses_id integer not null,
  people_id integer not null,
  foreign key (addresses_id) references addresses(id),
  foreign key (people_id) references people(id),
  primary key (addresses_id, people_id)
);
-- people might have more than one phone number, but any number belongs to someone
create table phones(
  id serial primary key,
  people_id integer not null,
  "number" text unique not null,
  -- no number belongs to two distinct people
  created timestamp not null default now(),
  updated timestamp not null default now(),
  foreign key (people_id) references people(id)
);