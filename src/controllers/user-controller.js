const { inspect } = require("util")
const { UserDao } = require("../dao/user-dao")
const { User } = require("../models/user-model")

const session = require('express-session');
const { Phone } = require("../models/phone-model");
const { Email } = require("../models/email-model");
const { PhoneDao } = require("../dao/phone-dao");
const { EmailDao } = require("../dao/email-dao");
const { paginate } = require("../utils/paginate");

const userDao = new UserDao();
const phoneDao = new PhoneDao();
const emailDao = new EmailDao();

async function listUsers(req, res) {
    const context = await buildUserListContext(req);
    const successMessage = req.query.successMessage || null;
    const successAction  = Boolean(successMessage);
    return res.render('listar-usuarios', {
      successAction,
      message: successMessage,
      data: context
    });
  }

function update(req, res) {

}
// GET /login
async function showLoginPage (req, res) {
    res.render('login', {failed: false, error: null})
}
// POST /login
async function login(req, res) {
    const { cpf, senha } = req.body;
    console.log({cpf, senha});

    let logado = await userDao.login(cpf, senha);
    const findOne = await userDao.existAnyUser();
    if(!findOne) {
        console.log('nenhum usuario cadastrado');
        return res.render('criar-usuario', { failed: true,
             data: { 
                error: 'Nenhum usuário cadastrado! Cadastre-se',
                firstUser: true
             }
            });
    }
    console.log('logado ' + inspect(logado));
    if (!logado) {
        return res.render('login', { failed: true, error: 'Usuário ou senha inválidos' });
    }
    let user = {
        id: logado.id,
        cpf: logado.cpf,
        nome: logado.name,
        role: logado.role
    }
    
    req.session.user = user

    res.redirect('/users')
}

// GET /logout
async function logout(req, res){
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.redirect('/login');
    });
}

async function getUserDetails(req, res) {
    const userId = req.params.id;
    const user = await userDao.getById(userId);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const phones = await phoneDao.getByUser(userId);
    const emails = await emailDao.getByUser(userId);
    user.phones = phones;
    user.emails = emails;
    console.log("user encontrado", user);
    const loggedUser = req.session.user;
    console.log("Usuário logado: ", loggedUser);
    console.log("id:", userId);
    //user depois de pegar o userId e pegar um usuário no banco!!
    res.render('detalhar-usuario', { user, loggedUser, userId });
}

 async function showAddUserPage(req, res){
    console.log("Chamei página de criação")
    res.render('criar-usuario', { failed: false,
        data: { 
           error: null,
           firstUser: false
        }
       });
  }

// POST /addUser
async function addUser(req, res) {
    // inicio
    const user = User.instanceRow(req.body);
    console.log("REQ.BODY", req.body);
console.log('USER', user)
    let firstUser = false;

    //Verifica se email e telefone existe
    let phones = Phone.instanceList(req.body.telefones, req.body.telefonePrincipal, user.id)
    let emails = Email.instanceList(req.body.emails, req.body.emailPrincipal, user.id)
    user.phones = phones
    user.emails = emails

    let verifyPhone = user.verifyIfMainPhoneExists();
    /*
    { failed: true,
             data: { 
                error: 'Nenhum usuário cadastrado! Cadastre-se',
                firstUser: true
             }
            }
    
    */
    if (!verifyPhone.exists) return res.render("criar-usuario", { failed: true, data: { error: verifyPhone.message } })

    let verifyMail = user.verifyIfMainEmailExists()
    if (!verifyMail.exists) return res.render("criar-usuario", { failed: true, data: { error: verifyMail.message } })
    
    //Verifica se é o primeiro
    // let lastUser = await userDao.getLast()
    // if(!lastUser) firstUser = true

    //Verifica se já existe user
    let userExists = await userDao.getByCpf(user.cpf)
    if(userExists) return res.render('criar-usuario', { failed: true, data: { error: 'Usuário com esse CPF já existe!' } })
    
    //Verifica se já existe telefone
    for(let phone of phones){
        let phoneExists = await phoneDao.getByNumber(phone.number)
        if(phoneExists) return res.render('criar-usuario', { failed: true, data: { error: 'Telefone já existe!' } })
    }

    //Verifica se já existe telefone
    for(let email of emails){
        let emailExists = await emailDao.getByEmail(email.email)
        if(emailExists) return res.render('criar-usuario', { failed: true, data: { error: 'Email já existe!' } })
    }
    
    //Cadastra usuario como admin caso não exista
    // if(firstUser) {
        //user.role = 'ADMIN'
        const newUserId = await userDao.insert(user);
        console.log("ID CRIADO", newUserId);
        Phone.insertList(user.phones, newUserId);
        Email.insertList(user.emails, newUserId);
    // } else {
    //     user.role = 'CLIENTE'
    //     const newUserId = await userDao.insert(user);
    //     console.log("ID CRIADO", newUserId);
    //     Phone.insertList(user.phones, newUserId);
    //     Email.insertList(user.emails, newUserId);
    // }
    res.redirect("/users");
}

async function showUpdateUserPage (req, res) {
    const userId = req.params.id;
    const loggedUser = req.session.user;
    const successMessage = req.query.successMessage || null;
    const successAction  = Boolean(successMessage);

    const user = await userDao.getById(userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado');
    }

    const phones = await phoneDao.getByUser(userId);
    const emails = await emailDao.getByUser(userId);
    user.phones = phones;
    user.emails = emails;
    console.log("user encontrado", user);

    res.render('editar-usuario', { user, loggedUser, userId, successAction, message: successMessage });
}

async function updateUser(req, res){
    const userId = req.params.id;
    const currentUser = req.session.user;
    // Verificar permissões e atualizar usuário
    //CRIAR MÉTODO
  }

  async function deleteUser(req, res) {
    const { id }      = req.params;
    const loggedUser  = req.session.user;
  
    // validações...
    const user = await userDao.getById(id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    if (loggedUser.role !== 'ADMIN') {
      return res.status(403).send('Acesso negado.');
    }
  
    // exclui
    await userDao.delete(id);
    console.log('Usuário excluído:', id);
  
    const msg = encodeURIComponent('Usuário excluído com sucesso!');
    console.log("loggedId", loggedUser.id)
    console.log("id", id) ;

    if(Number(loggedUser.id) === Number(id)) {
        console.log("Entrou no if");
        logout(req, res);
    }

    res.redirect(`/users?successMessage=${encodeURIComponent('Usuário excluído!')}`)
    
  }

  async function buildUserListContext(req) {
    const page          = parseInt(req.query.page, 10) || 1;
    const searchNome    = req.query.searchNome;
    const errorMessage  = req.query.errorMessage || null;
    const loggedUser    = req.session.user;
  
    // 1. busca raw
    let usersRaw = searchNome
      ? await userDao.getByName(searchNome)
      : await userDao.getAll();
  
    // 2. garante array
    const usersArr = Array.isArray(usersRaw) ? usersRaw : [usersRaw];
    const users    = [];
  
    // 3. enriquece com phone/email principal
    for (let u of usersArr) {
      const mainPhone = await phoneDao.getPhonePrincipal(u.id);
      const mainEmail = await emailDao.getEmailPrincipal(u.id);
  
      u.mainPhone = mainPhone?.number || '-';
      u.mainEmail = mainEmail?.email  || '-';
      users.push(u);
    }
  
    // 4. paginar
    const paged = paginate(users, page);
  
    return { paged, loggedUser, errorMessage };
  }

  async function deletePhone(req, res) {
    const { idPhone } = req.params;
    const loggedUser  = req.session.user;
    console.log("ID DO TELEFONE", idPhone);
  
    // validações...
    const phone = await phoneDao.getById(idPhone);
    if (!phone) {
      return res.status(404).send('Telefone não encontrado');
    }
    if (loggedUser.role !== 'ADMIN') {
      return res.status(403).send('Acesso negado.');
    }
  
    // exclui
    await phoneDao.delete(idPhone);
    console.log('Telefone excluído:', idPhone);
  
    const msg = encodeURIComponent('Telefone excluído com sucesso!');
    res.redirect(`/user/${phone.id_user}/edit?successMessage=` + msg);
  }

  async function deleteEmail(req, res) {
    const { idEmail } = req.params;
    const loggedUser  = req.session.user;
    console.log("ID DO EMAIL", idEmail);
  
    // validações...
    const email = await emailDao.getById(idEmail);
    if (!email) {
      return res.status(404).send('Email não encontrado');
    }
    if (loggedUser.role !== 'ADMIN') {
      return res.status(403).send('Acesso negado.');
    }
  
    // exclui
    await emailDao.delete(idEmail);
    console.log('Email excluído:', idEmail);
  
    const msg = encodeURIComponent('Email excluído com sucesso!');
    res.redirect(`/user/${email.id_user}/edit?successMessage=` + msg);
  }

module.exports = {
    listUsers,
    update,
    login,
    getUserDetails,
    addUser,
    showLoginPage,
    showAddUserPage,
    logout,
    showUpdateUserPage,
    updateUser,
    deleteUser,
    deletePhone,
    deleteEmail
}