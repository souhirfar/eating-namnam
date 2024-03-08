
CREATE TABLE user (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(30) UNIQUE NOT NULL,
    firstname VARCHAR(20),
    lastname VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL 
);