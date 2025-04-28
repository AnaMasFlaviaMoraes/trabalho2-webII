const { inspect } = require("util")
const { UserDao } = require("../models/user-dao")
const { User } = require("../models/user-model")

const session = require('express-session');
const { Phone } = require("../models/phone-model");
const { Email } = require("../models/email-model");
const { PhoneDao } = require("../models/phone-dao");
const { EmailDao } = require("../models/email-dao");
const { paginate } = require("../utils/paginate");

async function listUsers(req, res) {
    let errorMessage = req.query.errorMessage
    const userDao = new UserDao()
    const phoneDao = new PhoneDao()
    const emailDao = new EmailDao()
    let usersRaw
    const page = parseInt(req.query.page) || 1
    
    const { searchNome } = req.query
    console.log("Nome a ser pesquisado: ", searchNome)
    if(searchNome) usersRaw = await userDao.getByName(searchNome)
    else usersRaw = userDao.getAll()

    let users = []
    if(!Array.isArray(usersRaw)) usersRaw = [usersRaw]
    for(let user of usersRaw) {

        //adicionando teledone principal
        const phone = await phoneDao.getPhonePrincipal(user.cpf)
        if (phone) user.mainPhone = phone.number

        //adicionando email principal
        const email = await emailDao.getEmailPrincipal(user.cpf)
        if(email) user.mainEmail = email.email
        console.log('user ' + inspect(user))
        users.push(user)
    }

    let paged = paginate(users, page)
    const loggedUser = req.session.user
    const data = {
        paged,
        loggedUser,
        errorMessage
    }
    console.log('paged ' + inspect(paged))
    return res.render('listar-usuarios', { data })
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

    const userDao = new UserDao()
    let logado = await userDao.login(cpf, senha)
    console.log('logado ' + inspect(logado))
    if (!logado) {
        return res.render('login', { failed: true, error: 'Usuário ou senha inválidos' });
    }
    let user = {
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

// POST /addUser
async function addUser(req, res) {
    // inicio
    const user = User.instanceRow(req.body)
    const userDao = new UserDao()
    const phoneDao = new PhoneDao()
    const emailDao = new EmailDao()
    let firstUser = false

    //Verifica se email e telefone existe
    let phones = Phone.instanceList(req.body.telefones, req.body.telefonePrincipal, user.cpf)
    let emails = Email.instanceList(req.body.emails, req.body.emailPrincipal, user.cpf)
    user.phones = phones
    user.emails = emails

    let verifyPhone = user.verifyIfMainPhoneExists()
    if (!verifyPhone.exists) return res.render("criar-usuario", { data: { errorMessage: verifyPhone.message } })

    let verifyMail = user.verifyIfMainEmailExists()
    if (!verifyMail.exists) return res.render("criar-usuario", { data: { errorMessage: verifyMail.message } })
    
    //Verifica se é o primeiro
    let lastUser = await userDao.getLast()
    if(!lastUser) firstUser = true

    //Verifica se já existe user
    let userExists = await userDao.getByCpf(user.cpf)
    if(userExists) return res.render('criar-usuario', { data: { errorMessage: 'Usuário já existe!' } })
    
    //Verifica se já existe telefone
    for(let phone of phones){
        let phoneExists = await phoneDao.getByNumber(phone.number)
        if(phoneExists) return res.render('criar-usuario', { data: { errorMessage: 'Telefone já existe!' } })
    }

    //Verifica se já existe telefone
    for(let email of emails){
        let emailExists = await emailDao.getByEmail(email.email)
        if(emailExists) return res.render('criar-usuario', { data: { errorMessage: 'Email já existe!' } })
    }
    
    //Cadastra usuario como admin caso não exista
    if(firstUser) {
        user.role = 'ADMIN'
        userDao.insert(user)
        Phone.insertList(user.phones, user.cpf)
        Email.insertList(user.emails, user.cpf)
    } else {
        user.role = 'CLIENTE'
        userDao.insert(user)
        Phone.insertList(user.phones, user.cpf)
        Email.insertList(user.emails, user.cpf)
    }
    res.redirect("/users");
}

function details(req, res) {

}

module.exports = {
    listUsers,
    update,
    login,
    addUser,
    details,
    showLoginPage,
    logout,
}