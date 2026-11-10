import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Image, StyleSheet, Alert, SafeAreaView, StatusBar, ImageBackground
} from 'react-native';

// ===================== CORES (iguais ao site) =====================
const AZUL = '#0047b6';
const LARANJA = '#ff7300';

const usuariosIniciais = [
  { usuario: 'adm', senha: '123', tipo: 'adm' },
  { usuario: 'aluno', senha: '123', tipo: 'usuario' },
];

const produtosIniciais = [
  {
    id: 1, nome: 'Alicate Universal', qtde: 15, estoque_minimo: 5,
    descricao: 'Alicate isolado para bancada', preco: 45.00,
    foto: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=80',
    categoria: 'Ferramentas'
  },
  {
    id: 2, nome: 'Multímetro Digital', qtde: 8, estoque_minimo: 3,
    descricao: 'Aparelho de teste de tensão', preco: 90.00,
    foto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=80',
    categoria: 'Equipamentos'
  },
];

const movimentacoesIniciais = [
  { id: 1, produto: 'Alicate Universal', tipo: 'Estoque inicial', data: '09/11/2026 21:00' },
  { id: 2, produto: 'Multímetro Digital', tipo: 'Estoque inicial', data: '09/11/2026 21:00' },
];

// ===================== APP =====================
export default function App() {
  const [tela, setTela] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [movimentacoes, setMovimentacoes] = useState(movimentacoesIniciais);

  if (tela === 'login') {
    return (
      <TelaLogin
        usuarios={usuarios}
        onLogin={(u) => { setUsuarioLogado(u); setTela('home'); }}
        onCadastro={() => setTela('cadastrousuario')}
      />
    );
  }

  // Cadastro de USUÁRIO — acessado pelo link no login
  if (tela === 'cadastrousuario') {
    return (
      <TelaCadastroUsuario
        onCadastrar={(novoUsuario) => {
          setUsuarios([...usuarios, novoUsuario]);
          Alert.alert('Sucesso', 'Usuário cadastrado! Faça login.');
          setTela('login');
        }}
        onVoltar={() => setTela('login')}
      />
    );
  }

  // Cadastro de PRODUTO — acessado pelo ADM via bottom nav
  if (tela === 'cadastroproduto') {
    return (
      <TelaCadastroProduto
        onCadastrar={(novoProduto) => {
          setProdutos([...produtos, { ...novoProduto, id: Date.now() }]);
          setMovimentacoes([...movimentacoes, {
            id: Date.now(),
            produto: novoProduto.nome,
            tipo: 'Cadastro inicial',
            data: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
          }]);
          Alert.alert('Sucesso', 'Produto cadastrado!');
          setTela('home');
        }}
        onVoltar={() => setTela('home')}
        usuario={usuarioLogado}
        onNavegar={setTela}
        onSair={() => { setUsuarioLogado(null); setTela('login'); }}
      />
    );
  }

  if (tela === 'home') {
    return (
      <TelaHome
        usuario={usuarioLogado}
        produtos={produtos}
        setProdutos={setProdutos}
        movimentacoes={movimentacoes}
        setMovimentacoes={setMovimentacoes}
        onNavegar={setTela}
        onSair={() => { setUsuarioLogado(null); setTela('login'); }}
      />
    );
  }

  if (tela === 'movimentacao') {
    return (
      <TelaMovimentacao
        usuario={usuarioLogado}
        movimentacoes={movimentacoes}
        onNavegar={setTela}
        onSair={() => { setUsuarioLogado(null); setTela('login'); }}
      />
    );
  }

  return null;
}

// ===================== BARRA SUPERIOR (só nome do usuário + sair) =====================
function TopBar({ usuario, onSair }) {
  const isAdm = usuario?.tipo === 'adm';
  return (
    <View style={s.topBar}>
      <Text style={s.topBarTexto}>
        Olá, <Text style={{ fontWeight: 'bold' }}>{usuario?.usuario}</Text>
        {'  '}({isAdm ? 'ADM' : 'Usuário'})
      </Text>
      <TouchableOpacity onPress={onSair} style={s.btnSair}>
        <Text style={s.btnSairTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// ===================== BARRA INFERIOR DE NAVEGAÇÃO (padrão mobile) =====================
function BottomNav({ telaAtual, onNavegar, isAdm }) {
  const abas = [
    { key: 'home', label: 'Home' },
    { key: 'movimentacao', label: 'Movimentação' },
    ...(isAdm ? [{ key: 'cadastroproduto', label: 'Cadastro' }] : []),
  ];

  return (
    <View style={s.bottomNav}>
      {abas.map(aba => (
        <TouchableOpacity
          key={aba.key}
          style={s.abaBtn}
          onPress={() => onNavegar(aba.key)}
        >
          <Text style={[s.abaTexto, telaAtual === aba.key && s.abaTextoAtivo]}>
            {aba.label}
          </Text>
          {/* Linha embaixo da aba ativa */}
          {telaAtual === aba.key && <View style={s.abaLinha} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ===================== TELA LOGIN =====================
function TelaLogin({ usuarios, onLogin, onCadastro }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  function entrar() {
    const encontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (encontrado) {
      onLogin(encontrado);
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: AZUL }}>
      <StatusBar backgroundColor={AZUL} barStyle="light-content" />

      {/* Imagem de fundo com transparência */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1581092334651-ddf19c0f4a9e?w=600' }}
        style={s.bgImagem}
        resizeMode="cover"
      />

      {/* Camada azul por cima da imagem */}
      <View style={s.bgOverlay} />

      {/* Conteúdo — alinhado ao topo com padding */}
      <ScrollView contentContainerStyle={s.loginContainer}>

        {/* Logo SENAI centralizada no topo */}
        <Image
          source={require('./assets/senailogo.png')}
          style={s.logoSenai}
          resizeMode="contain"
        />

        {/* Formulário */}
        <View style={s.loginBox}>
          <Text style={s.labelBranco}>Usuário</Text>
          <TextInput
            style={s.inputLogin}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Digite seu usuário"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
          />

          <Text style={s.labelBranco}>Senha</Text>
          <TextInput
            style={s.inputLogin}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry
          />

          <TouchableOpacity style={s.btnEntrar} onPress={entrar}>
            <Text style={s.btnTexto}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCadastro} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={s.linkTexto}>Não tem conta? Cadastre-se aqui</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ===================== TELA CADASTRO DE USUÁRIO (via link no login) =====================
function TelaCadastroUsuario({ onCadastrar, onVoltar }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('usuario');
  const [senhaMestra, setSenhaMestra] = useState('');

  function cadastrar() {
    if (!usuario || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (tipo === 'adm' && senhaMestra !== 'tcc') {
      Alert.alert('Erro', 'Senha mestra incorreta.');
      return;
    }
    onCadastrar({ usuario, senha, tipo });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AZUL }}>
      <StatusBar backgroundColor={AZUL} barStyle="light-content" />
      <ScrollView contentContainerStyle={s.paginaContainer}>

        <Text style={s.tituloPagina}>Cadastro de Usuário</Text>

        <Text style={s.labelBranco}>Nome de Usuário</Text>
        <TextInput
          style={s.inputPadrao}
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Digite um nome de usuário"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />

        <Text style={s.labelBranco}>Senha</Text>
        <TextInput
          style={s.inputPadrao}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite uma senha"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <Text style={s.labelBranco}>Tipo de Conta</Text>
        <View style={s.tipoContainer}>
          <TouchableOpacity
            style={[s.tipoBotao, tipo === 'usuario' && s.tipoSelecionado]}
            onPress={() => setTipo('usuario')}
          >
            <Text style={tipo === 'usuario' ? s.tipoTextoAtivo : s.tipoTexto}>
              Usuário Comum
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tipoBotao, tipo === 'adm' && s.tipoSelecionado]}
            onPress={() => setTipo('adm')}
          >
            <Text style={tipo === 'adm' ? s.tipoTextoAtivo : s.tipoTexto}>
              Administrador
            </Text>
          </TouchableOpacity>
        </View>

        {tipo === 'adm' && (
          <>
            <Text style={s.labelBranco}>Senha Mestra do ADM</Text>
            <TextInput
              style={s.inputPadrao}
              value={senhaMestra}
              onChangeText={setSenhaMestra}
              placeholder="Digite a senha mestra"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
          </>
        )}

        <TouchableOpacity style={s.btnLaranja} onPress={cadastrar}>
          <Text style={s.btnTexto}>CADASTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onVoltar} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={s.linkTexto}>Já tem conta? Voltar para o Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===================== TELA CADASTRO DE PRODUTO (ADM via bottom nav) =====================
function TelaCadastroProduto({ onCadastrar, usuario, onNavegar, onSair }) {
  const isAdm = usuario?.tipo === 'adm';
  const [nome, setNome] = useState('');
  const [qtde, setQtde] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [foto, setFoto] = useState('');

  function cadastrar() {
    if (!nome || !qtde || !preco) {
      Alert.alert('Erro', 'Preencha pelo menos Nome, Quantidade e Preço.');
      return;
    }
    onCadastrar({
      nome,
      qtde: parseInt(qtde) || 0,
      estoque_minimo: parseInt(estoqueMinimo) || 0,
      descricao,
      preco: parseFloat(preco) || 0,
      categoria,
      foto: foto || 'https://via.placeholder.com/80x60?text=Sem+Foto',
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AZUL }}>
      <StatusBar backgroundColor={AZUL} barStyle="light-content" />
      <TopBar usuario={usuario} onSair={onSair} />

      <ScrollView contentContainerStyle={s.paginaContainer}>
        <Text style={s.tituloPagina}>CADASTRE UM NOVO PRODUTO</Text>

        <Text style={s.labelBranco}>Nome do item *</Text>
        <TextInput style={s.inputPadrao} value={nome} onChangeText={setNome}
          placeholder="Ex: Alicate Universal" placeholderTextColor="#aaa" />

        <Text style={s.labelBranco}>Quantidade *</Text>
        <TextInput style={s.inputPadrao} value={qtde} onChangeText={setQtde}
          placeholder="Ex: 10" placeholderTextColor="#aaa" keyboardType="numeric" />

        <Text style={s.labelBranco}>Estoque mínimo</Text>
        <TextInput style={s.inputPadrao} value={estoqueMinimo} onChangeText={setEstoqueMinimo}
          placeholder="Ex: 3" placeholderTextColor="#aaa" keyboardType="numeric" />

        <Text style={s.labelBranco}>Descrição</Text>
        <TextInput style={s.inputPadrao} value={descricao} onChangeText={setDescricao}
          placeholder="Ex: Alicate isolado para bancada" placeholderTextColor="#aaa" />

        <Text style={s.labelBranco}>Preço *</Text>
        <TextInput style={s.inputPadrao} value={preco} onChangeText={setPreco}
          placeholder="Ex: 45.00" placeholderTextColor="#aaa" keyboardType="decimal-pad" />

        <Text style={s.labelBranco}>Categoria</Text>
        <TextInput style={s.inputPadrao} value={categoria} onChangeText={setCategoria}
          placeholder="Ex: Ferramentas" placeholderTextColor="#aaa" />

        <Text style={s.labelBranco}>Link da Foto (URL)</Text>
        <TextInput style={s.inputPadrao} value={foto} onChangeText={setFoto}
          placeholder="https://..." placeholderTextColor="#aaa" autoCapitalize="none" />

        <TouchableOpacity style={s.btnLaranja} onPress={cadastrar}>
          <Text style={s.btnTexto}>CADASTRAR</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav telaAtual="cadastroproduto" onNavegar={onNavegar} isAdm={isAdm} />
    </SafeAreaView>
  );
}

// ===================== TELA HOME =====================
function TelaHome({ usuario, produtos, setProdutos, movimentacoes, setMovimentacoes, onNavegar, onSair }) {
  const isAdm = usuario?.tipo === 'adm';

  function agora() {
    const d = new Date();
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  }

  function aumentar(id) {
    setProdutos(prev => prev.map(p => {
      if (p.id === id) {
        setMovimentacoes(m => [...m, { id: Date.now(), produto: p.nome, tipo: 'Entrada (+1)', data: agora() }]);
        return { ...p, qtde: p.qtde + 1 };
      }
      return p;
    }));
  }

  function diminuir(id) {
    setProdutos(prev => prev.map(p => {
      if (p.id === id && p.qtde > 0) {
        setMovimentacoes(m => [...m, { id: Date.now(), produto: p.nome, tipo: 'Saída (-1)', data: agora() }]);
        return { ...p, qtde: p.qtde - 1 };
      }
      return p;
    }));
  }

  function excluir(id) {
    const prod = produtos.find(p => p.id === id);
    Alert.alert('Excluir', `Excluir "${prod?.nome}"?`, [
      { text: 'Cancelar' },
      {
        text: 'Excluir', style: 'destructive', onPress: () => {
          setProdutos(prev => prev.filter(p => p.id !== id));
          setMovimentacoes(m => [...m, { id: Date.now(), produto: prod?.nome, tipo: 'Excluído', data: agora() }]);
        }
      }
    ]);
  }

  return (
    <SafeAreaView style={s.tela}>
      <StatusBar backgroundColor={AZUL} barStyle="light-content" />

      <TopBar usuario={usuario} onSair={onSair} />

      <ScrollView style={{ flex: 1 }}>
        <Text style={s.tituloPagina}>TABELA DO ESTOQUE</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            {/* Cabeçalho laranja */}
            <View style={s.trHead}>
              <Text style={[s.th, { width: 120 }]}>Nome</Text>
              <Text style={[s.th, { width: 55 }]}>Qtde</Text>
              <Text style={[s.th, { width: 55 }]}>Mín.</Text>
              <Text style={[s.th, { width: 150 }]}>Descrição</Text>
              <Text style={[s.th, { width: 65 }]}>Preço</Text>
              <Text style={[s.th, { width: 70 }]}>Foto</Text>
              <Text style={[s.th, { width: 100 }]}>Categoria</Text>
              {isAdm && <Text style={[s.th, { width: 160 }]}>ADM</Text>}
            </View>

            {produtos.map((p, i) => (
              <View key={p.id} style={[s.tr, i % 2 === 0 ? s.trPar : s.trImpar]}>
                <Text style={[s.td, { width: 120 }]}>{p.nome}</Text>
                <Text style={[s.td, { width: 55 }]}>{p.qtde}</Text>
                <Text style={[s.td, { width: 55 }]}>{p.estoque_minimo}</Text>
                <Text style={[s.td, { width: 150 }]}>{p.descricao}</Text>
                <Text style={[s.td, { width: 65 }]}>R$ {p.preco.toFixed(2)}</Text>
                <View style={[s.tdView, { width: 70 }]}>
                  <Image source={{ uri: p.foto }} style={s.fotoTabela} />
                </View>
                <Text style={[s.td, { width: 100 }]}>{p.categoria}</Text>
                {isAdm && (
                  <View style={[s.tdView, { width: 160, flexDirection: 'row', gap: 4 }]}>
                    <TouchableOpacity style={s.btnVerde} onPress={() => aumentar(p.id)}>
                      <Text style={s.btnTexto}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnAmarelo} onPress={() => diminuir(p.id)}>
                      <Text style={[s.btnTexto, { color: '#000' }]}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnVermelho} onPress={() => excluir(p.id)}>
                      <Text style={s.btnTexto}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <BottomNav telaAtual="home" onNavegar={onNavegar} isAdm={isAdm} />
    </SafeAreaView>
  );
}

// ===================== TELA MOVIMENTAÇÃO =====================
function TelaMovimentacao({ usuario, movimentacoes, onNavegar, onSair }) {
  const isAdm = usuario?.tipo === 'adm';
  return (
    <SafeAreaView style={s.tela}>
      <StatusBar backgroundColor={AZUL} barStyle="light-content" />
      <TopBar usuario={usuario} onSair={onSair} />

      <ScrollView style={{ flex: 1 }}>
        <Text style={s.tituloPagina}>HISTÓRICO DE MOVIMENTAÇÃO</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            <View style={s.trHead}>
              <Text style={[s.th, { width: 150 }]}>Produto</Text>
              <Text style={[s.th, { width: 160 }]}>Ação</Text>
              <Text style={[s.th, { width: 160 }]}>Data e Hora</Text>
            </View>
            {movimentacoes.map((m, i) => (
              <View key={m.id} style={[s.tr, i % 2 === 0 ? s.trPar : s.trImpar]}>
                <Text style={[s.td, { width: 150 }]}>{m.produto}</Text>
                <Text style={[s.td, { width: 160 }]}>{m.tipo}</Text>
                <Text style={[s.td, { width: 160 }]}>{m.data}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <BottomNav telaAtual="movimentacao" onNavegar={onNavegar} isAdm={isAdm} />
    </SafeAreaView>
  );
}

// ===================== ESTILOS =====================
const s = StyleSheet.create({

  tela: {
    flex: 1,
    backgroundColor: AZUL,
  },

  // --- Login ---
  bgImagem: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 71, 182, 0.80)', // azul com 80% de opacidade
  },
  loginContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,   // começa do topo, não do meio
  },
  logoSenai: {
    width: 200,
    height: 70,
    marginBottom: 28,
  },
  loginBox: {
    width: '100%',
    maxWidth: 360,
  },
  loginTitulo: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLogin: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  btnEntrar: {
    backgroundColor: '#0d6efd',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  linkTexto: {
    color: '#ccc',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // --- Top bar ---
  topBar: {
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  topBarTexto: {
    fontSize: 14,
    color: '#495057',
    flexShrink: 1,
    marginRight: 8,
  },
  btnSair: {
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnSairTexto: {
    color: '#dc3545',
    fontSize: 14,
  },

  // --- Bottom nav ---
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingBottom: 8,
    paddingTop: 4,
  },
  abaBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  abaTexto: {
    fontSize: 11,
    color: '#6c757d',
  },
  abaTextoAtivo: {
    color: LARANJA,
    fontWeight: 'bold',
  },
  abaLinha: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 3,
    backgroundColor: LARANJA,
    borderRadius: 2,
  },

  // --- Título das páginas ---
  tituloPagina: {
    backgroundColor: LARANJA,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 12,
    margin: 10,
    borderRadius: 4,
  },

  // --- Formulário ---
  paginaContainer: {
    padding: 24,
    paddingTop: 32,
  },
  labelBranco: {
    color: '#ddd',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 14,
  },
  inputPadrao: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  tipoBotao: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tipoSelecionado: {
    backgroundColor: LARANJA,
    borderColor: LARANJA,
  },
  tipoTexto: {
    color: '#ddd',
    fontSize: 14,
  },
  tipoTextoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnLaranja: {
    backgroundColor: LARANJA,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // --- Tabela ---
  trHead: {
    flexDirection: 'row',
    backgroundColor: LARANJA,
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  trPar: { backgroundColor: '#f2f2f2' },
  trImpar: { backgroundColor: '#e8e8e8' },
  th: {
    fontWeight: 'bold',
    fontSize: 13,
    padding: 8,
    color: '#fff',
    borderRightWidth: 1,
    borderColor: '#c65a00',
    textAlign: 'center',
  },
  td: {
    fontSize: 13,
    padding: 8,
    color: '#333',
    borderRightWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  tdView: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  fotoTabela: {
    width: 50,
    height: 40,
    borderRadius: 4,
  },

  // --- Botões da tabela ---
  btnVerde: {
    backgroundColor: '#198754',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  btnAmarelo: {
    backgroundColor: '#ffc107',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  btnVermelho: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
