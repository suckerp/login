drop database if exists Credentials;
create database Credentials character set utf8mb4 collate utf8mb4_unicode_ci;
use Credentials;


create table Users (
    ID int not null auto_increment,
    EMail varchar(255) not null,
    Salz varchar(255) not null,
    Passwort varchar(255),
    primary key (ID),
    unique KEY (EMail)
);

insert into Users (EMail, Salz, Passwort) values
("test1@test.de", "2017-10-18T03:00:00.000", SHA2(CONCAT("2017-10-18T03:00:00.000","test"),512)),
("test2@test.de", "2017-10-18T04:00:00.000", SHA2(CONCAT("2017-10-18T04:00:00.000","test"),512)),
("test3@test.de", "2017-10-18T05:00:00.000", SHA2(CONCAT("2017-10-18T05:00:00.000","test"),512));