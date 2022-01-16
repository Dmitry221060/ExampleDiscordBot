class Task {
  #timer = null;
  #client = null;

  constructor(runOnStartup = false) {
    this.runOnStartup = runOnStartup;
  }

  register() {
    throw new Error("Register method not implemented");
  }

  unRegister() {
    throw new Error("Unregister method not implemented");
  }

  execute() {
    throw new Error("Execute method not implemented");
  }
}

module.exports = Task;
