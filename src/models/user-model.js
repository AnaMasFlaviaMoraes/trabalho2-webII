class User {
    constructor(id, nome, cpf, senha, role, telefones, emails) {
        this.id = id
        this.nome = nome
        this.cpf = cpf
        this.senha = senha
        this.role = role
        this.mainPhone
        this.mainEmail
        this.phones = telefones
        this.emails = emails
    }

    static instanceRow(user){
        return new User(
            user.id,
            user.nome,
            user.cpf,
            user.senha,
            user.role,
            user.telefones,
            user.telefonePrincipal,
            user.emails,
            user.emailPrincipal
        );
    }

    verifyIfMainPhoneExists() {
        let mainCount = 0
        for (let phone of this.phones) if (phone.isPrincipal == 'true') mainCount++
        if (mainCount > 1) return { message: 'Só é possível ter um Telefone principal', exists: false }
        else if (mainCount == 0 && this.phones.length > 0) return { message: 'É necessário ao menos um Telefone principal', exists: false }
        return { message: null, exists: true }
    }
    verifyIfMainEmailExists() {
        let mainCount = 0
        for (let email of this.emails) if (email.isPrincipal == 'true') mainCount++
        if (mainCount > 1) return { message: 'Só é possível ter um Email principal', exists: false }
        else if (mainCount == 0 && this.emails.length > 0) return { message: 'É necessário ao menos um Email principal', exists: false }
        return { message: null, exists: true }
    }
}

module.exports = { User }