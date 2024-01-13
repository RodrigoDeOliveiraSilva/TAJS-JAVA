import Task from "./task.js";
const oneSecond = 1000
const runInASec = new Date(Date.now() + oneSecond)
const ruiInTwoSecs = new Date(Date.now() + (2 * oneSecond))
const ruiInThreeSecs = new Date(Date.now() + (3 * oneSecond))

const task = new Task()

task.save({
    name: "task1",
    dueAt: runInASec,
    fn: () => console.log("task1")
})

task.save({
    name: "task2",
    dueAt: ruiInTwoSecs,
    fn: () => console.log("task2")
})


task.save({
    name: "task3",
    dueAt: ruiInThreeSecs,
    fn: () => console.log("task3")
})

task.run(oneSecond)