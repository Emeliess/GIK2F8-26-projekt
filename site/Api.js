// API som pratar med servern
class Api {
  url = '';
// Konstruktor tar emot url till servern
  constructor(url) {
    this.url = url;
  }
// Create skickar ett post-request till servern med data för ett nytt recept, tar emot det nya receptet
  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);

    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    return (
      fetch(request)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err))
    );
  }
// Hämtar alla recepten ifrån servern med get-request
  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }
// Skickar ett delete-request med ID på recept
  remove(id) {
    console.log(`Removing recipe with id ${id}`);

    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }
}
