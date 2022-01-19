show tables;

insert into user (nome, sobrenome, email, senha) values ('Maria', 'Ramos', 'exemplo@yahoo.com', 'teste2');

select * from user;
SELECT * FROM user WHERE id_user = 3;

ALTER TABLE user ADD UNIQUE (email);
describe user;describe user;

ALTER TABLE user MODIFY email varchar(100) NOT NULL;