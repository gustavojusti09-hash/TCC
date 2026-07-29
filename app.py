from flask import Flask, render_template, request, redirect, url_for
import mysql.connector

app = Flask(__name__)

# Função reutilizável para conexão com o banco
def conectar_banco():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="",
        database="senai"
    )

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    erro = None
    if request.method == 'POST':
        usuario_digitado = request.form['usuario']
        senha_digitada = request.form['senha']

        conexao = conectar_banco()
        cursor = conexao.cursor()
        comando = "SELECT * FROM usuarios WHERE usuario = %s AND senha = %s"
        cursor.execute(comando, (usuario_digitado, senha_digitada))

        usuario_encontrado = cursor.fetchone()

        cursor.close()
        conexao.close()

        if usuario_encontrado:
            return redirect(url_for('home'))
        else:
            erro = "Usuário ou senha incorretos! Tente novamente."

    return render_template('login.html', erro=erro)


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
    return render_template('movimentacao.html')


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

    return render_template('cadastroconcluido.html')


@app.route('/teste.html')
def teste():
    return render_template('teste.html')


@app.route('/cadastrousuario', methods=['GET', 'POST'])
def cadastrousuario():
    if request.method == 'POST':
        usuario_digitado = request.form['usuario']
        senha_digitada = request.form['senha']

        conexao = conectar_banco()
        cursor = conexao.cursor()

        comando = "INSERT INTO usuarios (usuario, senha) VALUES (%s, %s)"
        cursor.execute(comando, (usuario_digitado, senha_digitada))
        conexao.commit()
        
        cursor.close()
        conexao.close()
        
        return "Usuário cadastrado com sucesso!"

    return render_template('cadastrousuario.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)