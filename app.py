from flask import Flask, render_template, request
import mysql.connector

app = Flask(__name__)

@app.route("/")
def login():
    return render_template('login.html')

@app.route('/home.html')
def home():
    return render_template('home.html')

@app.route('/cadastro.html')
def cadastro():
    return render_template('cadastro.html')

@app.route('/movimentacao.html')
def movimentacao():
    return render_template('movimentacao.html')

@app.route('/cadastroconcluido.html', methods=['GET', 'POST'])
def cadastroconcluido():
    nome = request.form.get('nome_item')
    qtde = request.form.get('qtde')
    estoque_minimo = request.form.get('estoque_minimo')
    descricao = request.form.get('descricao')
    preco = request.form.get('preco')
    foto = request.form.get('foto')
    categoria = request.form.get('categoria')

    banco = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='senai'
    )

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
