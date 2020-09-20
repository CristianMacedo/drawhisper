const Book = require("./Book");

class Game {
  initialState = {
    event: "idle",
    timestamp: 0,
    pages: [],
  };

  fps = 1;
  interval = 10;

  // events = {
  //   idle: () => {},
  //   play: () => {},
  //   presenting: () => {}
  // }

  events = ["idle", "play", "interval", "presentation"];

  constructor(io, room) {
    console.log(`[drawhisper] [${room}] game created`);

    this.state = Object.assign({}, this.initialState);

    this.timeout = false;
    this.duration = 30;

    this.gameLoopInterval = null;
    this.timerInterval = null;
    this.players = [];
    this.books = [];

    this.room = room;
    this.io = io;

    this.handleNewBook = this.handleNewBook.bind(this);
    // this.handleNewPage = this.handleNewPage.bind(this);
  }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
  }

  // TODO: Create different file for hanbdling users
  // TODO: Add user to players array
  // TODO: Add event handlers for the given socket
  // TODO: Emit players list to socket
  // TODO: Emit new player list to room
  // TODO: Handle disconnection
  setPlayer(socket, username, type) {
    console.log(`[drawhisper] [${this.room}] new player added - ${username}`);

    this.players.push({ id: socket.id, username, type });

    socket.join(this.room);

    socket.emit("gameState", this.state);

    socket.on("newBook", (payload) => this.handleNewBook(socket, payload));
    socket.on("newPage", (payload) => this.handleNewPage(socket, payload));
  }

  getPlayersId() {
    return this.players.map((player) => player.id);
  }

  updatePlayer(id, content) {
    return (this.players = this.players.map((player) => {
      if (player.id == id) {
        return {
          ...player,
          ...content,
        };
      }
    }));
  }

  getPlayer(id) {
    return this.players.find((player) => player.id === id);
  }

  deletePlayer(id) {
    return this.players.splice(
      this.players.findIndex((player) => player.id === id),
      1
    )[0];
  }

  createTimer(duration) {
    this.setState({ timestamp: duration });
    this.timeout = false;
    this.timerInterval = setInterval(() => {
      if (this.state.timestamp <= 0) {
        this.timeout = true;
        clearInterval(this.timerInterval);
      }
      this.setState({
        timestamp: this.state.timestamp - 1,
      });
    }, 1000);
  }

  newRound() {
    this.setState({ event: "play" });
    this.createTimer(this.duration);
  }

  newPresentation() {
    this.setState({ event: "presentation" });
  }

  newInterval() {
    this.setState({ event: "interval" });
    this.createTimer(this.interval);
  }

  updatePages() {
    const nextPages = this.books[this.books.length - 1].nextPage();
    this.setState({ pages: nextPages });
  }

  startGameLoop() {
    this.updatePages();
    this.newRound();

    clearInterval(this.gameLoopInterval);

    this.gameLoopInterval = setInterval(() => {
      if (this.timeout) {
        switch (this.state.event) {
          case "interval":
            this.updatePages();
            this.state.pages ? this.newRound() : this.newPresentation();
            break;
          case "play":
            this.newInterval();
            break;
          case "presentation":
            break;
          default:
            break;
        }
      }

      this.io.to(this.room).emit("gameState", this.state);
    }, 1000 / this.fps);
  }

  // TODO: Update state event type according
  // TODO: Create round timer and verify if time has ended
  // TODO: Verify if player is admin
  handleNewBook(socket, { duration, firstAction }) {
    this.duration = duration;
    this.books.push(new Book(this.getPlayersId(), socket.id));
    this.startGameLoop();
  }

  // TODO: Verify amount of pages remaining for the round
  // TODO: Creating page sorting algorithm
  // handleNewPage(socket, { type, content }) {
  //   console.log(`[drawhisper] [${this.id}] new page received`);

  //   this.books[this.books.length - 1].newPage({ id: socket.id, type, content });
  // }
}

module.exports = Game;
