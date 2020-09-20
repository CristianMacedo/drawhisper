const Page = require("./Page");

// TODO: Add more identfiers (ID, creation date...)

class Book {
  constructor(authors, owner) {
    console.log(
      `[drawhisper] new book created by ${owner} with ${authors.length} authors`
    );

    this.authors = authors;
    this.owner = owner;

    this.chapters = Array.from({ length: authors.length }, (chapter, index) =>
      Array.from(
        { length: authors.length - 1 },
        () => new Page(this.authors[index])
      )
    );

    this.sortGuessers();
  }

  sortGuessers() {
    for (let i = 0; i < this.chapters.length; i++) {
      for (let j = 0; j < this.chapters[i].length; j++) {
        this.chapters[i][j].setGuesser(
          this.authors[(i + j + 1) % this.authors.length]
        );
      }
    }

    console.log(`[drawhisper] new guessing sequence created:`, this.chapters);
  }
}

module.exports = Book;
