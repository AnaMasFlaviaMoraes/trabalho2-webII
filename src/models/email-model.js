const { EmailDao } = require("./email-dao")
const { inspect } = require('util')

class Email {
    constructor(email, isPrincipal, cpf) {
        this.email = email
        this.isPrincipal = isPrincipal
        this.cpf = cpf
    }

    static instanceList(emails, principal, cpf){
        let emailObjects = []
        console.log('instanceList emails ' + inspect(emails))
        console.log('instanceList principal ' + inspect(principal))
        console.log('instanceList teste ' + inspect(emails[principal]))
        console.log('instanceList 0 ' + inspect(emails[0]))
        console.log('instanceList 0 ' + inspect(emails[1]))
        if(Array.isArray(emails)){
            for(let i = 0; i < emails.length; i++){
                console.log('email i ' + i)
                console.log('email principal ' + principal)
                console.log('email i == principal ' + i == principal)
                if(i == principal) emailObjects.push(new Email(emails[i], 'true', cpf))
                else emailObjects.push(new Email(emails[i], 'false', cpf))
            }
        }
        return emailObjects
    }

    static insertList(emails, cpf) {
        let emailDAO = new EmailDao()
        for (let email of emails) {
            const emailObject = new Email(email.email, email.isPrincipal, cpf)
            emailDAO.insert(emailObject)
        }
    }
}

module.exports = {
    Email
}