const { inspect } = require("util")
const { UserDao } = require("../dao/user-dao")
const { User } = require("../models/user-model")

const { Phone } = require("../models/phone-model");
const { Email } = require("../models/email-model");
const { PhoneDao } = require("../dao/phone-dao");
const { EmailDao } = require("../dao/email-dao");
const { paginate } = require("../utils/paginate");
const { use } = require("../routes/user-routes");

const userDao = new UserDao();
const phoneDao = new PhoneDao();
const emailDao = new EmailDao();

// GET /users
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

// GET /login
async function showLoginPage (req, res) {
    res.render('login', {failed: false, error: null})
}
// POST /login
async function login(req, res) {
    const { cpf, senha } = req.body;

    let logado = await userDao.login(cpf, senha);
    const findOne = await userDao.existAnyUser();
    if(!findOne) {
        console.log('Nenhum usuario cadastrado');
        return res.render('criar-usuario', { failed: true,
             data: { 
                error: 'Nenhum usuário cadastrado! Cadastre-se',
                firstUser: true
             }
            });
    }
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

// GET /user/:id
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
    const loggedUser = req.session.user;
    res.render('detalhar-usuario', { user, loggedUser, userId });
}

// GET /addUser
 async function showAddUserPage(req, res){
    res.render('criar-usuario', { failed: false,
        data: { 
           error: null,
           firstUser: false
        }
       });
  }

// POST /addUser
async function addUser(req, res) {
    const user = User.instanceRow(req.body);

    let phones = Phone.instanceList(req.body.telefones, req.body.telefonePrincipal, user.id)
    let emails = Email.instanceList(req.body.emails, req.body.emailPrincipal, user.id)
    user.phones = phones
    user.emails = emails

    let verifyPhone = user.verifyIfMainPhoneExists();
    if (!verifyPhone.exists) return res.render("criar-usuario", { failed: true, data: { error: verifyPhone.message } })

    let verifyMail = user.verifyIfMainEmailExists()
    if (!verifyMail.exists) return res.render("criar-usuario", { failed: true, data: { error: verifyMail.message } })

    let userExists = await userDao.getByCpf(user.cpf)
    if(userExists) return res.render('criar-usuario', { failed: true, data: { error: 'Usuário com esse CPF já existe!' } })
    
    for(let phone of phones){
        let phoneExists = await phoneDao.getByNumber(phone.number)
        if(phoneExists) return res.render('criar-usuario', { failed: true, data: { error: 'Telefone já existe!' } })
    }

    for(let email of emails){
        let emailExists = await emailDao.getByEmail(email.email)
        if(emailExists) return res.render('criar-usuario', { failed: true, data: { error: 'Email já existe!' } })
    }
    
    const newUserId = await userDao.insert(user);
    Phone.insertList(user.phones, newUserId);
    Email.insertList(user.emails, newUserId);
   
    res.redirect("/users");
}

// GET /user/:id/edit
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

    res.render('editar-usuario', {data: { user, loggedUser, userId, successAction, message: successMessage }});
}

// POST /user/:id/edit
async function updateUser(req, res){
  const userId = req.params.id;
  const loggedUser   = req.session.user;

  const oldUser = await userDao.getById(userId);
  if (!oldUser) {
    return res.status(404).send('Usuário não encontrado');
  }

  const oldPhones = await phoneDao.getByUser(userId);
  const oldEmails = await emailDao.getByUser(userId);
  oldUser.phones = oldPhones;
  oldUser.emails = oldEmails;

  if (loggedUser.role !== 'ADMIN' && loggedUser.id !== userId) {
    return res.status(403).send('Acesso negado. Você não pode editar este usuário.');
  }

  const updated = User.instanceRow(req.body);
  updated.id   = userId;        
  updated.cpf  = oldUser.cpf;     
  updated.role = oldUser.role;    

  const phones = Phone.instanceList(
    req.body.telefones,
    req.body.telefonePrincipal,
    userId
  );
  const emails = Email.instanceList(
    req.body.emails,
    req.body.emailPrincipal,
    userId
  );
  updated.phones = phones;
  updated.emails = emails;

  const vp = updated.verifyIfMainPhoneExists();
  if (!vp.exists) {
    return res.render('editar-usuario', {
      data: { 
        user: oldUser, 
        successAction: true,
        userId,
        loggedUser,
        message: vp.message, 
      }
    });
  }
  const ve = updated.verifyIfMainEmailExists();
  if (!ve.exists) {
    return res.render('editar-usuario', {
      data: { 
        user: oldUser,
        successAction: true,
        userId,
        loggedUser,
        message: ve.message,
       }
    });
  }

  for (let p of phones) {
    const found = await phoneDao.getByNumber(p.number);
    
    if (found && Number(found.id_user) !== Number(userId)) {
      return res.render('editar-usuario', {
        data: { 
          user: oldUser,
          successAction: true,
          userId,
          loggedUser,
          message: "Telefone já existe!",
         }
      });
    }
  }
  for (let e of emails) {
    const found = await emailDao.getByEmail(e.email);
    if (found && Number(found.id_user) !== Number(userId)) {
      return res.render('editar-usuario', {
        data: { 
          user: oldUser,
          successAction: true,
          userId,
          loggedUser,
          message: "Email já existe!",
         }
      });
    }
  }

  await userDao.update(updated);

  await phoneDao.deleteByUser(userId);
  await Phone.insertList(phones, userId);

  await emailDao.deleteByUser(userId);
  await Email.insertList(emails, userId);

  const msg = encodeURIComponent('Usuário atualizado com sucesso!');
  return res.redirect(`/users?successMessage=${msg}`);

  }

// POST /user/:id/delete
  async function deleteUser(req, res) {
    const { id }      = req.params;
    const loggedUser  = req.session.user;
  
    const user = await userDao.getById(id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    if (loggedUser.role !== 'ADMIN') {
      return res.status(403).send('Acesso negado.');
    }

    await userDao.delete(id);
    console.log('Usuário excluído:', id);
  
    const msg = encodeURIComponent('Usuário excluído com sucesso!');

    if(Number(loggedUser.id) === Number(id)) {
        console.log("Entrou no if");
        logout(req, res);
    }

    res.redirect(`/users?successMessage=${encodeURIComponent('Usuário excluído!')}`)
    
  }

  async function buildUserListContext(req) {
    const page          = parseInt(req.query.page, 10) || 1;
    const searchNome    = req.query.searchNome || null;
    const errorMessage  = req.query.errorMessage || null;
    const loggedUser    = req.session.user;
  
    let usersRaw = searchNome
      ? await userDao.getByName(searchNome)
      : await userDao.getAll();
  
    const usersArr = Array.isArray(usersRaw) ? usersRaw : [usersRaw];
    const users    = [];
  
    for (let u of usersArr) {
      const mainPhone = await phoneDao.getPhonePrincipal(u.id);
      const mainEmail = await emailDao.getEmailPrincipal(u.id);
  
      u.mainPhone = mainPhone?.number || '-';
      u.mainEmail = mainEmail?.email  || '-';
      users.push(u);
    }
  
    const paged = paginate(users, page);
  
    return { paged, loggedUser, errorMessage, searchNome };
  }

  // POST /user/:idPhone/delete
  async function deletePhone(req, res) {
    const { idPhone } = req.params;
    const loggedUser  = req.session.user;
  
    const phone = await phoneDao.getById(idPhone);
    if (!phone) {
      return res.status(404).send('Telefone não encontrado');
    }
    if (loggedUser.role !== 'ADMIN') {
      return res.status(403).send('Acesso negado.');
    }

    await phoneDao.delete(idPhone);
    console.log('Telefone excluído:', idPhone);
  
    const msg = encodeURIComponent('Telefone excluído com sucesso!');
    res.redirect(`/user/${phone.id_user}/edit?successMessage=` + msg);
  }

  // POST /user/:idEmail/delete
  async function deleteEmail(req, res) {
    const { idEmail } = req.params;
    const loggedUser  = req.session.user;

    const email = await emailDao.getById(idEmail);
    if (!email) {
      return res.status(404).send('Email não encontrado');
    }
    if (loggedUser.role !== 'ADMIN') {
      return res.status(403).send('Acesso negado.');
    }

    await emailDao.delete(idEmail);
    console.log('Email excluído:', idEmail);
  
    const msg = encodeURIComponent('Email excluído com sucesso!');
    res.redirect(`/user/${email.id_user}/edit?successMessage=` + msg);
  }

module.exports = {
    listUsers,
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