const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '@Eumesmo01',
    database: 'ControleFacil'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para servir arquivos estáticos da pasta /pedidos
app.use('/pedidosfeitos', express.static(__dirname + '/pedidosfeitos'));

// Middleware para servir arquivos estáticos da pasta /adicionarpedidos
app.use('/adicionarpedidos', express.static(__dirname + '/adicionarpedidos'));

app.get('/pedidos', (req, res) => {
    const sql = 'SELECT * FROM pedidos';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Dados dos pedidos:', result); // Adicione esta linha para ver os dados dos pedidos no console
        res.json(result);
    });
});


// Rota para a página de feed (GET)
app.get('/adicionarpedidos', (req, res) => {
    res.sendFile(__dirname + '/adicionarpedidos.html');
});

app.get('/', (req, res) => {
    res.send("NÃO É PAGINA INICIAL!")
});

// Rota para adicionar um novo pedido
app.post('/adicionarpedidos', express.json(), (req, res) => {
    const pedido = req.body;
    const sql = 'INSERT INTO pedidos (nome, dataEntrega, quantidadeItens, valor, porcentagemPaga, numeroTelefone, informacoes, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [pedido.nome, pedido.dataEntrega, pedido.quantidadeItens, pedido.valor, pedido.porcentagemPaga, pedido.numeroTelefone, pedido.informacoes, pedido.imagem];
    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
