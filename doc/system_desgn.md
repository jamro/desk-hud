# System Design

Desk-HUD utilizes a client-server architecture where both the client and server components run on the same machine, leveraging the Raspberry Pi hardware platform. The server is implemented in JavaScript using Node.js with Express.js and Socket.IO, and it runs locally at localhost:3000. The client is implemented in JavaScript and utilizes Pixi.js for rendering graphics.

On the client side, multiple widgets runs, each corresponding to a specific backend service. These widgets communicate with their respective backend services to retrieve and display relevant data. This modular design allows for flexibility and scalability in adding or modifying widgets based on individual preferences and requirements.

![System Design Diagram](img/systemDesign.png)

## Communication

Communication between the client and server is established through web sockets, allowing real-time data exchange. Additionally, an HTTP connection is used to serve static content to the client. This architecture enables seamless and efficient communication between the two components.

The server component of Desk-HUD encompasses multiple services, each responsible for the logic of a specific widget. These services handle data retrieval, processing, and communication with external APIs such as Google API, Open Weather Maps, or Home Assistant. The server also controls peripherals connected to the Raspberry Pi, including a distance sensor and the power of the HDMI monitor.

### Incoming messages

There are several web socket events emitted by the server:

- `config` - configuration details sent after client connected
- `widget` - update of widget data. The message is specific to each eidget
- `distance` - updates from distance sensor
- `system` - updates from system monitor
- `log` - stream of server side logs to show them in browser's dev tool console

### Outgoing messages

There is one web socket event emitted by the client:

- `service` - command for the service (e.g. turn the air conditioning off)

## Persistance

To store essential data, the server employs simple JSON files on the local disk, utilizing the `node-persist` library. This approach ensures persistence and accessibility of necessary information for the widgets and services.
