const { PhoneDao } = require("../dao/phone-dao");

class Phone {
    constructor(number, isPrincipal, id_user) {
        this.number = number      
        this.isPrincipal = isPrincipal
        this.id_user = id_user
    }

    static instanceList(phones, principal, id_user){
        console.log("ID USUÁRIO NO ISTANCE LIST", id_user);
        let phoneObjects = []
        if(Array.isArray(phones)){
            for(let i = 0; i < phones.length; i++){
                console.log('phone i ' + i)
                console.log('phone principal ' + principal)
                console.log('phone i == principal ' + i == principal)
                if(i == principal) phoneObjects.push(new Phone(phones[i], 'true', id_user))
                else phoneObjects.push(new Phone(phones[i], 'false', id_user))
            }
        }
        return phoneObjects
    }

    static insertList(phones, id_user) {
        console.log("AQUII", id_user);
        let phoneDAO = new PhoneDao();
        for (let phone of phones) {
            const phoneObject = new Phone(phone.number, phone.isPrincipal, id_user)
            console.log("PHONE OBJECT", phoneObject);
            phoneDAO.insert(phoneObject)
        }
    }

}


module.exports = {
    Phone
}