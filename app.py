from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
import hashlib

app = Flask(__name__)

def conectar_banco():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="1234",
        database="senai"
    )

def registrar_historico(produto_nome, tipo_acao):
    banco = conectar_banco()
    cursor = banco.cursor()
    query = "INSERT INTO movimentacoes (produto, tipo, data_hora) VALUES (%s, %s, NOW())"
    cursor.execute(query, (produto_nome, tipo_acao))
    banco.commit()
    cursor.close()
    banco.close()

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario_digitado = request.form['usuario']
        senha_digitada = request.form['senha']

        senha_hash = hashlib.sha256(senha_digitada.encode('utf-8')).hexdigest()

        conexao = conectar_banco()
        cursor = conexao.cursor()

        sql = "SELECT * FROM usuarios WHERE usuario = %s AND senha = %s"
        cursor.execute(sql, (usuario_digitado, senha_hash))
        usuario_encontrado = cursor.fetchone()

        cursor.close()
        conexao.close()

        if usuario_encontrado:
            return redirect(url_for('home'))
        else:
            return render_template('login.html', erro="Usuário ou senha incorretos!")

    return render_template('login.html')


@app.route('/cadastrousuario', methods=['GET', 'POST'])
def cadastrousuario():
    if request.method == 'POST':
        usuario_digitado = request.form['usuario']
        senha_digitada = request.form['senha']

        senha_hash = hashlib.sha256(senha_digitada.encode('utf-8')).hexdigest()

        conexao = conectar_banco()
        cursor = conexao.cursor()

        comando = "INSERT INTO usuarios (usuario, senha) VALUES (%s, %s)"
        cursor.execute(comando, (usuario_digitado, senha_hash))
        conexao.commit()
        
        cursor.close()
        conexao.close()
        
        return redirect(url_for('login'))

    return render_template('cadastrousuario.html')


@app.route('/home.html')
def home():
    banco = conectar_banco()
    cursor = banco.cursor()
    query = "SELECT * FROM estoque"
    cursor.execute(query)

    resultado = cursor.fetchall()
    cursor.close()
    banco.close()

    return render_template('home.html', resultado=resultado)


@app.route('/cadastro.html')
def cadastro():
    return render_template('cadastro.html')


@app.route('/movimentacao.html')
def movimentacao():
    banco = conectar_banco()
    cursor = banco.cursor()
    query = """
        SELECT produto, tipo, DATE_FORMAT(data_hora, '%d/%m/%Y %H:%i:%s') 
        FROM movimentacoes 
        ORDER BY id DESC
    """
    cursor.execute(query)
    historico = cursor.fetchall()
    cursor.close()
    banco.close()

    return render_template('movimentacao.html', historico=historico)


@app.route('/cadastroconcluido.html', methods=['POST'])
def cadastroconcluido():
    nome = request.form.get('nome_item')
    qtde = request.form.get('qtde')
    estoque_minimo = request.form.get('estoque_minimo')
    descricao = request.form.get('descricao')
    preco = request.form.get('preco')
    foto = request.form.get('foto')
    categoria = request.form.get('categoria')

    banco = conectar_banco()
    cursor = banco.cursor()
    query = "INSERT INTO estoque (nome, qtde, estoque_minimo, descricao, preco, foto, categoria) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    valores = (nome, qtde, estoque_minimo, descricao, preco, foto, categoria)
    
    cursor.execute(query, valores)
    banco.commit()

    cursor.close()
    banco.close()

    registrar_historico(nome, "Cadastrou novo produto")

    return render_template('cadastroconcluido.html')


@app.route('/teste.html')
def teste():
    return render_template('teste.html')


@app.route('/alterar_quantidade', methods=['POST'])
def alterar_quantidade():
    id_produto = request.form.get('id_produto')
    acao = request.form.get('acao')
    qtd = int(request.form.get('quantidade', 1))

    banco = conectar_banco()
    cursor = banco.cursor()

    cursor.execute("SELECT nome FROM estoque WHERE id = %s", (id_produto,))
    prod = cursor.fetchone()
    nome_produto = prod[0] if prod else "Produto"

    if acao == 'adicionar':
        query = "UPDATE estoque SET qtde = qtde + %s WHERE id = %s"
        tipo_log = f"Entrada de +{qtd} itens"
    elif acao == 'remover':
        query = "UPDATE estoque SET qtde = GREATEST(0, qtde - %s) WHERE id = %s"
        tipo_log = f"Saída de -{qtd} itens"

    cursor.execute(query, (qtd, id_produto))
    banco.commit()

    cursor.close()
    banco.close()

    registrar_historico(nome_produto, tipo_log)

    return redirect(url_for('home'))


@app.route('/deletar_produto', methods=['POST'])
def deletar_produto():
    id_produto = request.form.get('id_produto')

    banco = conectar_banco()
    cursor = banco.cursor()

    cursor.execute("SELECT nome FROM estoque WHERE id = %s", (id_produto,))
    prod = cursor.fetchone()
    nome_produto = prod[0] if prod else "Produto"

    query = "DELETE FROM estoque WHERE id = %s"
    cursor.execute(query, (id_produto,))
    banco.commit()

    cursor.close()
    banco.close()

    registrar_historico(nome_produto, "Excluiu o produto")

    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)