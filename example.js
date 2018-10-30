const childProcess = require("child_process");

const cpcycle = require("./")({
  trace: true,
  events: ["Close", "Stdout"]
})

// New instances of child processes to track
let echo = cpcycle(childProcess.spawn, "echo");
let ls = cpcycle(childProcess.spawn, "ls");

echo = echo("echo", ["it works"])

echo.stdout.on("data", (data)=> {
  console.log(data.toString())

  ls = ls("ls", [__dirname])

  ls.stdout.on("data", (data)=> {
    console.log(data.toString())
  })
})

