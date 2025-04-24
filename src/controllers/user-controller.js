const { UserDao } = require("../models/user-dao")
const { User } = require("../models/user-model")

function list(req, res) {
}

function update(req, res) {

}

function login(req, res) {

}

async function register(req, res) {
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
}

function details(req, res) {

}

module.exports = {
    list,
    update,
    login,
    register,
    details

}