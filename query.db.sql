CREATE DATABASE IF NOT EXISTS senai;

USE senai;

CREATE TABLE estoque (
	id INT PRIMARY KEY auto_increment,
    nome VARCHAR(255),
    qtde INT,
    estoque_minimo INT,
    descricao VARCHAR(255),
    preco DECIMAL,
    foto VARCHAR(255),
    categoria VARCHAR(255)
    );

CREATE TABLE usuarios (
	id INT PRIMARY KEY auto_increment,
    usuario VARCHAR(255),
    senha VARCHAR(255)
    );
    
    CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM estoque;

SELECT * FROM usuarios;

SELECT * FROM movimentacoes;

TRUNCATE TABLE usuarios;