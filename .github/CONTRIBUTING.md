## Installing

1. clone repository
2. Run `npm install`

We need frontend and backend server to be started for this application.

Frontend server compiles assets, while backend server communicates with CodeceptJS and processes HTTP and WebSocket requests. HTTP is used to send commands from client to CodeceptJS, and websockets are used to send notifications from CodeceptJS to application.

Both servers must be executed for development:

### Launch application in Electron mode:

```
npm run electron:serve
npm run app
```

### Launch application in WebServer mode:

```
npm run frontend
npm run backend
```

Open application at **http://127.0.0.1:8080**.

> Pay attention that the port is **8080** and not 3333 in this case.

## Making Pull Requests

1. Create your own branch (fork project)
2. Create a branch for the feature you work on
3. Create a pull request
4. Wait for it to be approved...
