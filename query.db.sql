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
    senha VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'usuario'
);
    
CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (usuario, senha, tipo) VALUES 
('adm', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'adm'),
('aluno', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'usuario');

INSERT INTO estoque (nome, qtde, estoque_minimo, descricao, preco, foto, categoria) VALUES 
('Alicate Universal', 15, 5, 'Alicate isolado para bancada', 45.00, 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=150', 'Ferramentas'),
('Multimetro Digital', 8, 3, 'Aparelho de teste de tensao', 90.00, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150', 'Equipamentos');

SELECT * FROM estoque;
SELECT * FROM usuarios;
SELECT * FROM movimentacoes;
