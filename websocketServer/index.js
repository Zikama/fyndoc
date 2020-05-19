class SocketWorker {
    constructor(svr) {
        const Websocket = require("ws"),
            SocketServer = Websocket.Server;

        this.svr = svr;
        this.Websocket = Websocket;
        this.SocketServer = SocketServer;

    }
    Server(callback) {
        const Websocket = this.Websocket,
            wsServer = new this.SocketServer({ server: this.svr });

        wsServer.on("connection", function(ws, req) {

            let HISTORY = [],
                CLIENS = [],
                normSize = wsServer;
            CLIENS.push(normSize.clients.size);

            function clienSize() { return CLIENS[CLIENS.length - 1]; }
            // console.log('Clients connected:',clienSize());		
            if (callback)
                callback(ws, req, Websocket, normSize, HISTORY, CLIENS, clienSize);
        });
        wsServer.on("error", function(err) {
            console.error(err);
        });
    }
    newMessage(type, anotherType, callback) {
        if (type == anotherType)
            if (callback)
                callback();
    }
    getExData(data) {
        return data;
    }
    parsse(bck) {
        bck();
    }

}

function socketWorker(svr) {
    return new SocketWorker(svr);
}

module.exports = socketWorker;