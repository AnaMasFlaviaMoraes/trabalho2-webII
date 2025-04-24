class User {
    constructor(name, cpf, password, role) {
        this.name = name
        this.cpf = cpf
        this.password = password
        this.role = role
    }

    static instanceRow(user){
        return new User(user.name, user.cpf, user.password, user.role)
    }
}

module.exports = { User }