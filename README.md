# SENG Snake Server
## Connect to the server
You need a socket.io-client to connect to the server.
The version of the socket.io-client should match the current used version of socket.io in this project.

The socket should be initialized with the following parameter:

Url:

    http://niklaseckert.ddns.net
Options:

    withCredentials: false,
    transports: ['websocket']

## Events
### Emitting
> #### application_error
> Description: Will be sent, then an error in the server occurred.<br>
> Return: { code: String, message: String}
> 
> List of codes:
> * **30001**: Lobby is already full<br>
> * **30002**: Lobby is already running

> #### lobby:joined
> Description: Will be sent, then a player successfully joined a server.<br>
> Return: undefined

> #### server:lobbyCreated
> Description: Will be sent, then a client successfully created a lobby.<br>
> Return: lobbyCode: String
### Listening
> #### client:createLobby
> Description: Create a new lobby with a unique code. Will fire the ***server:lobbyCreated*** event.<br> 
> Parameter: 

> #### client:joinLobby
> Description: Join an existing lobby. Will fire the ***lobby:joined*** event on success.<br>
> Parameter: lobbyCode: String


