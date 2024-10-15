document.addEventListener("DOMContentLoaded", () => {
    const filmList = document.getElementById("films");
    const posterImage = document.getElementById("poster");
    const titleElement = document.getElementById("title");
    const runtimeElement = document.getElementById("runtime");
    const filmInfoElement = document.getElementById("film-info");
    const showtimeElement = document.getElementById("showtime");
    const ticketNumElement = document.getElementById("ticket-num");
    const buyTicketButton = document.getElementById("buy-ticket");
  
    // fetch event
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((films) => {
        films.forEach(film => {
          const li = document.createElement("li");
          li.className = "film item";
          li.innerText = film.title;
          li.dataset.id = film.id;
  //add delete button
  const deleteBtn = document.createElement("button");
          deleteBtn.textContent="delete";
          deleteBtn.addEventListener('click',(x)=>{
            e.stoppropagation();
            deleteFilm(film.id,li);
          });
          // display event
          li.addEventListener("click", () => displayFilmDetails(film));
          filmList.appendChild(li);
        });
      });
  
    // Function to display film details
    function displayFilmDetails(film) {
      const availableTickets = film.capacity - film.tickets_sold;
      posterImage.src = film.poster;
      titleElement.innerText = film.title;
      runtimeElement.innerText = `${film.runtime} minutes`;
      filmInfoElement.innerText = film.description;
      showtimeElement.innerText = film.showtime;
      ticketNumElement.innerText = availableTickets;
  
      // Enable/disable the buy ticket button 
      buyTicketButton.innerText = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
      buyTicketButton.disabled = availableTickets === 0;
  
      // Handle ticket purchase
      buyTicketButton.onclick = () => {
        if (availableTickets > 0) {
          buyTicket(film);
        }
      };
    }
  
    // Function to buy a ticket
    function buyTicket(film) {
      const newTicketsSold = film.tickets_sold + 1;
  
      // Update tickets sold on the server
      fetch(`http://localhost:3000/films/${film.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: newTicketsSold }),
      })
        .then(response => response.json())
        .then(updatedFilm => {
          // Update the display with the new film details
          displayFilmDetails(updatedFilm);
          (buyTicket)
  
          // POST new ticket to the tickets endpoint
          fetch("http://localhost:3000/tickets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              film_id: film.id,
              number_of_tickets: 1,
            }),
          });
        });
    }
  
    // Function to delete a film
    function deleteFilm(filmId) {
      fetch(`http://localhost:3000/films/${filmId}`, {
        method: "DELETE",
      })
        .then(() => {
          // Remove the film from the list 
          const filmItem = document.querySelector(`[data-id='${filmId}']`);
          if (filmItem) {
            filmList.removeChild(filmItem);
          }
        });
    }
    filmList.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-button")) {
        const filmId = event.target.parentElement.dataset.id;
        deleteFilm(filmId);
      }
    });
  });