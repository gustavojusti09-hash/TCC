from flask import Flask, render_template

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

@app.route('/cadastroconcluido.html')
def cadastroconcluido():
    return render_template('cadastroconcluido.html')

@app.route('/teste.html')
def teste():
    return render_template('teste.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)