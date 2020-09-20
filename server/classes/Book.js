const Page = require("./Page");
const e = require("express");

// TODO: Add more identfiers (ID, creation date...)

class Book {
  constructor(authors, owner) {
    console.log(
      `[drawhisper] new book created by ${owner} with ${authors.length} authors`
    );

    this.authors = authors;
    this.owner = owner;

    this.currentPage = -1;

    this.pages = Array.from({ length: authors.length }, (chapter, i) =>
      Array.from({ length: authors.length }, (page, j) => {
        const type = j === 0 ? "bootstrap" : j % 2 == 0 ? "guess" : "draw";
        return new Page(this.authors[i], type);
      })
    );

    this.sortActors();
  }

  nextPage() {
    this.currentPage += 1;
    if (this.currentPage + 1 < this.pages.length) {
      return this.pages.map((page) => page[this.currentPage]);
    }
    return false;
  }

  sortActors() {
    for (let i = 0; i < this.pages.length; i++) {
      for (let j = 0; j < this.pages[i].length; j++) {
        this.pages[i][j].setActor(
          j === 0
            ? this.pages[i][j].author
            : this.authors[(i + j) % this.authors.length]
        );
      }
    }

    console.log(`[drawhisper] new guessing sequence created:`, this.pages);
  }
}

module.exports = Book;
