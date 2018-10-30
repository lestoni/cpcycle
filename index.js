/**
 * Load Module Dependencies
 */
const crypto = require("crypto");
const fs     = require('fs');

const moment = require("moment");
const notifier = require('node-notifier');

// CPCYCLE Class Definition
class CPCYCLE {
  
  // Set Random Name if not supplied
  constructor(name = `#CP${crypto.randomBytes(3).toString("hex")}`) {
    this.name = name;
    this.payload = [];
    this.begin = null;
  }

  trace(method) {
    return (...args) => {
      let child = method(...args);

      if(initialize.defaults.trace) {
        // start trace
        this._start_trace(child)
      }

      return child;
    }
  }

  _start_trace(process) {

    // Bind Handlers To Child Processes LifeCycle Events
    process.on("close", this._onClose.bind(this));
    process.on("message", this._onMessage.bind(this));
    process.on("exit", this._onExit.bind(this));
    process.on("disconnect", this._onDisconnect.bind(this));
    process.stdout.on("data", this._onStdout.bind(this));
    process.stderr.on("data", this._onStderr.bind(this));

  }

  _write(message, event) {
    
    // Notifier based on preferences
    if (initialize.defaults.events.includes(event)) {
      let now = moment()

      notifier.notify({
        title: `${this.name} [${event}]   ${this.begin.from(now, true)}`,
        message: message,
        icon: `${__dirname}/assets/icon.png`
      })
    }

  }

  _onClose() {
    this._write("Process Closed", "Close")
    
  }

  _onMessage(data) {
    this._write(data.toString(), "Message");

  }

  _onStdout(data) {
    this._write(data.toString(), "Stdout");
  }

  _onStderr(data) {
    this._write(data.toString(), "Stderr");
  }

  _onExit() {
    this._write("Process Exited", "Exit")
  }

  _onDisconnect() {
    this._write("Process Disconnected", "Disconnect");
  }

}

function initialize(opts = {}) {

  initialize.defaults = Object.assign({}, initialize.defaults, opts)

  return (method, name) => {
    const cpcyle = new CPCYCLE(name);

    cpcyle.begin = moment();

    return cpcyle.trace(method)
  }
}

// Default Configurations
initialize.defaults = {
  trace: true,
  events: ["Close", "Stdout"]
}

module.exports = initialize;