export default class Task{
    #tasks = new Set()
    save({name, dueAt, fn}){
        console.log(
            `task [${name}] saved and will be executed at [${dueAt.toISOString()}]`
        )
        this.#tasks.add({name, dueAt, fn})
    }
    run(everyMs){
        const interval = setInterval(() => {
            const now = Date.now()
            if(this.#tasks.size === 0){
                console.log("tasks finished")
                clearInterval(interval)
                return;
            }
            this.#tasks.forEach(task => {
                if (task.dueAt <= now){
                    task.fn()
                    this.#tasks.delete(task)
                }
            })
            if (this.#tasks.size === 0){
                clearInterval(interval)
            }
        }, everyMs)
    }
}