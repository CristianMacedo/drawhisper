class Page {
  constructor(author, type) {
    this.written = false;
    this.author = author;
    this.type = type;

    this.content = null;
    this.actor = null;
  }

  setActor(actor) {
    this.actor = actor;
  }

  setContent(type, content) {
    this.written = true;
    this.type = type;
    this.content = content;
  }
}

module.exports = Page;
