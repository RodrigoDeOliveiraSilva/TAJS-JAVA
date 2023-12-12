class Person{

    static validate(person){
        if(!person.name) throw new Error("Name is required")
        if(!person.cpf) throw new Error("CPF is required")
    }

    static process(person){
        this.validate(person);
        console.log('Processing person...')
        return 'ok'
    }

}

/*Person.process({
    //name:'Xuxa da silva', 
    cpf: '44.555.66-25'
})*/

export default Person;