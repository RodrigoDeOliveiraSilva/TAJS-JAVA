class Person{

    static validate(person){
        if(!person.name) throw new Error("Name is required")
        if(!person.cpf) throw new Error("CPF is required")
    }

    static format(person){
        const [name, ...lastName] = person.name.split(' ')
        return{
            cpf: person.cpf.replace(/\D/g,''),
            name,
            lastName: lastName.join(' ')
        }
    }

    static save(person){
        if(!['cpf', 'name', 'lastName'].every(prop => person[prop])){
            throw new Error(`cannot save invalid person: ${JSON.stringify(person)}`)
        }

        // ..API, Banco de dados, Kafka...

        console.log('registrado com sucesso!!', person)
    }

    static process(person){
        this.validate(person);
        const pesonFormatted = this.format(person)
        this.save(pesonFormatted)
        return 'ok'
    }

}

/*Person.process({
    //name:'Xuxa da silva', 
    cpf: '44.555.66-25'
})*/

export default Person;