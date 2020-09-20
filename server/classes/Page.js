class Page {
  constructor(author) {
    this.written = false;
    this.author = author;

    this.type = null;
    this.content = null;
    this.guesser = null;
  }

  setGuesser(guesser) {
    this.guesser = guesser;
  }

  setContent(type, content) {
    this.written = true;
    this.type = type;
    this.content = content;
  }
}

module.exports = Page;
