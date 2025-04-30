const { EmailDao } = require("../dao/email-dao");
const { inspect } = require('util');

class Email {
    constructor(email, isPrincipal, id_user) {
        this.email = email
        this.isPrincipal = isPrincipal
        this.id_user = id_user
    }

    static instanceList(emails, principal, id_user){
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
                if(i == principal) emailObjects.push(new Email(emails[i], 'true', id_user))
                else emailObjects.push(new Email(emails[i], 'false', id_user))
            }
        }
        return emailObjects
    }

    static insertList(emails, id_user) {
        let emailDAO = new EmailDao()
        for (let email of emails) {
            const emailObject = new Email(email.email, email.isPrincipal, id_user)
            emailDAO.insert(emailObject)
        }
    }
}

module.exports = {
    Email
}