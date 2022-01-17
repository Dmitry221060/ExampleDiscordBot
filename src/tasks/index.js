const SayHiTask = require("./sayHi");

const taskList = [
  new SayHiTask()
]

function register(client) {
  const pendingTaskRegistrations = taskList.map(task => task.register(client));
  return Promise.all(pendingTaskRegistrations);
}

function execute() {
  const pendingTaskExecutions = taskList.map(task => task.execute());
  return Promise.all(pendingTaskExecutions);
}

module.exports = {
  list: taskList,
  register,
  execute
}
