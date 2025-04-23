const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    const users = [
        {
            id: 1,
            nome: "Ana Flávia",
            username: "anamasflavia",
            perfil: "admin",
            telefones: [{ numero: "(11) 99999-9999", principal: true }],
            emails: [{ endereco: "ana@email.com", principal: true }]
        },
        {
            id: 2,
            nome: "Carlos Silva",
            username: "carlossilva",
            perfil: "cliente",
            telefones: [{ numero: "(21) 98888-7777", principal: true }],
            emails: [{ endereco: "carlos@email.com", principal: true }]
        }
    ];
    res.render('listar-usuarios', { users });
});

app.get('/editar', (req, res) => {
    const user = {
        id: 1,
        nome: 'João Silva',
        username: 'joaosilva',
        cpf: '123.456.789-00',
        perfil: 'CLIENTE',
        telefones: [
            { numero: '(11) 91234-5678', principal: true },
            { numero: '(11) 97654-3210', principal: false }
        ],
        emails: [
            { endereco: 'joao@email.com', principal: true },
            { endereco: 'jsilva@outra.com', principal: false }
        ]
    };
    res.render('editar-usuario', { user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/cadastro', (req, res) => {
    res.render('criar-usuario');
});

app.get('/detalhes', (req, res) => {
    const user = {
        id: 1,
        nome: 'João Silva',
        username: 'joaosilva',
        cpf: '123.456.789-00',
        perfil: 'CLIENTE',
        telefones: [
            { numero: '(11) 91234-5678', principal: true },
            { numero: '(11) 97654-3210', principal: false }
        ],
        emails: [
            { endereco: 'joao@email.com', principal: true },
            { endereco: 'jsilva@outra.com', principal: false }
        ]
    };
    res.render('detalhar-usuario', { user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});