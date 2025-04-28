const { db } = require("../configs/database.js")

class EmailDao {
    getByUser(cpf_user){
        const stmt = db.prepare('SELECT * FROM email WHERE cpf_user = ?')
        return stmt.all(cpf_user)
    }

    async getEmailPrincipal(cpf_user){
        const stmt = db.prepare(`SELECT * FROM email WHERE cpf_user = ? and is_principal = 'true'`)
        return stmt.get(cpf_user)
    }

    getByEmail(email){
        const stmt = db.prepare(`SELECT * FROM email WHERE email = ?`)
        return stmt.get(email)
    }

    insert(email) {
        const stmt = db.prepare(`INSERT INTO 
        email (email, cpf_user, is_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(email.email, email.cpf, email.isPrincipal)
    }

    update(email){
        const stmt = db.prepare(`UPDATE email SET email = ?, is_principal = ? WHERE email = ?`)
        return stmt.run(email.email, email.ehPrincipal, email.email)
    }

    delete(id){
        const stmt = db.prepare(`DELETE FROM email WHERE email = ?`)
        return stmt.run(id)
    }

    deleteByUser(cpf_user){
        const stmt = db.prepare(`DELETE FROM email WHERE cpf_user = ?`)
        return stmt.run(cpf_user)
    }
}

module.exports = { EmailDao }