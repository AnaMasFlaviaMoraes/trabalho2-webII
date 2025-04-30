const { db } = require("../configs/database.js")

class EmailDao {

    async getByUser(id_user){
        const stmt = db.prepare('SELECT * FROM email WHERE id_user = ?')
        return stmt.all(id_user)
    }

    async getById(id){
        const stmt = db.prepare('SELECT * FROM email WHERE id = ?')
        return stmt.get(id);
    }

    async getEmailPrincipal(id_user){
        const stmt = db.prepare(`SELECT * FROM email WHERE id_user = ? and is_principal = 'true'`)
        return stmt.get(id_user)
    }

    async getByEmail(email){
        const stmt = db.prepare(`SELECT * FROM email WHERE email = ?`)
        return stmt.get(email)
    }

    async insert(email) {
        const stmt = db.prepare(`INSERT INTO 
        email (email, id_user, is_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(email.email, email.id_user, email.isPrincipal)
    }

    async update(email){
        const stmt = db.prepare(`UPDATE email SET email = ?, is_principal = ? WHERE email = ?`)
        return stmt.run(email.email, email.ehPrincipal, email.email)
    }

    async delete(id){
        const stmt = db.prepare(`DELETE FROM email WHERE id = ?`)
        return stmt.run(id)
    }

    async deleteByUser(id_user){
        const stmt = db.prepare(`DELETE FROM email WHERE id_user = ?`)
        return stmt.run(id_user)
    }
}

module.exports = { EmailDao }