const { PhoneDao } = require("./phone-dao")

class Phone {
    constructor(number, isPrincipal, cpf) {
        this.number = number      
        this.isPrincipal = isPrincipal
        this.cpf = cpf
    }

    static instanceList(phones, principal, cpf){
        let phoneObjects = []
        if(Array.isArray(phones)){
            for(let i = 0; i < phones.length; i++){
                console.log('phone i ' + i)
                console.log('phone principal ' + principal)
                console.log('phone i == principal ' + i == principal)
                if(i == principal) phoneObjects.push(new Phone(phones[i], 'true', cpf))
                else phoneObjects.push(new Phone(phones[i], 'false', cpf))
            }
        }
        return phoneObjects
    }

    static insertList(phones, cpf) {
        let phoneDAO = new PhoneDao()
        for (let phone of phones) {
            const phoneObject = new Phone(phone.number, phone.isPrincipal, cpf)
            phoneDAO.insert(phoneObject)
        }
    }

}


module.exports = {
    Phone
}