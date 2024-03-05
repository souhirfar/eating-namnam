create table user (
  id int auto_increment NOT NULL primary key,
  username varchar(255) NOT NULL,
  firstname varchar(255) ,
  lastname varchar(255) ,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  admin boolean NOT NULL
 
);
