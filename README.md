# cpcycle

Small Utility To Observe NodeJS Child Processes life cycle events using notifications.

![Notification Screenshot](https://raw.githubusercontent.com/lestoni/cpcyle/master/assets/notification.png)

## Usage

```
  npm i cpcycle
```

```
  const childProcess = require("child_process");
  const cpcycle = require("cpcycle")(/*Options*/);

  let shell = cpcycle(childProcess.spawn, /*Optional Name*/);

  shell("echo", ["it works"])
    .stdout.on("data", (data)=> {
      console.log(data.toString())
    })
```

## API

### CPCYCLE(/*Options = {}*/)

Initialize Cycple

Options

- `trace`: true/false - Turn on/off tracing
- `events`: ["Close", "Stdout"] - Events to track

### cpcycle(ChildProcess.Method, /*Optional name*/)

Wrap a child process method and pass an optional name to identify it via notification


## License

MIT
