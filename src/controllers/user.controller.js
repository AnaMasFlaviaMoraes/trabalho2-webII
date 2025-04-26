const { UserDao } = require("../models/user-dao")
const { User } = require("../models/user-model")

const session = require('express-session');

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

module.exports = {
  // GET /login
  showLoginPage: (req, res) => {
    res.render('login', {failed: false, error: null});
  },

  // POST /login
  login: async (req, res) => {
    const { cpf, senha } = req.body;
    console.log({cpf, senha});
    
    if(cpf === '123.456.789-00' && senha === 'senha123') {
        req.session.user = user; 
        return res.redirect('/users');
    }else{
        return res.render('login', { failed: true, error: 'Usuário ou senha inválidos' });
    }
  },

  // GET /logout
  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) return res.redirect('/');
      res.redirect('/login');
    });
  },

  showAddUserPage: (req, res) => {
    const currentUser = req.session.user;
    // Verificar permissões e renderizar página de adicionar usuário
    res.render('criar-usuario', { user: currentUser });
  },

  // POST /addUser
  addUser: async (req, res) => {
    const { nome, username, cpf, senha, telefones, emails } = req.body;
     // inicio
     const user = User.instanceRow(req.body)
     const userDao = new UserDao()
     let firstUser = false
 
     //Verifica se é o primeiro
     let lastUser = await userDao.getLast()
     if(!lastUser) firstUser = true
 
     //Verifica se já existe
     let userExists = await userDao.getByCpf(user.cpf)
     if(userExists) return res.render('criar-usuario', { error: 'Usuário já existe!' })
 
     //Cadastra usuario como admin caso não exista
     if(firstUser) {
         user.role = true
         userDao.insert(user)
     } else userDao.insert(user)
 
     res.redirect("/users");
  },

  // GET /users?page=&filter=
  listUsers: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const filter = req.query.filter || '';
    const { searchNome } = req.query;
    console.log("Nome a ser pesquisado: ", searchNome);
    // Buscar usuários com paginação e filtro

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

    const loggedUser = req.session.user;

    res.render('listar-usuarios', { users: users, page, filter, loggedUser });
  },

  // GET /user/:id
  getUserDetails: async (req, res) => {
    const userId = req.params.id;
    // Buscar detalhes do usuário

    res.render('detalhar-usuario', { user });
  },

  showUpdateUserPage: async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.session.user;
    // Verificar permissões e renderizar página de atualizar usuário
    res.render('editar-usuario', { user });
  },
  // POST /updateUser/:id
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.session.user;
    // Verificar permissões e atualizar usuário
  },

  // POST /deleteUser/:id
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.session.user;
    const { id } = req.params;

    console.log("Apagando usuário com ID:", id);
    res.redirect('/users');
  }
};
