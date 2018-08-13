// add event listeners

function Goat() {
  this.filename = filename;
  this.votes = 0;
  
  // push instance into allGoats array
}

let img1 = new Goat();
let img2 = new Goat();
new Goat();
new Goat();
new Goat();

Goat.allGoats = [];
let displayGoats = [img1, img2];

// only display 2 goats at time
// add event listeners to temp variables img1 and img2

// choose two random goats by creating 2 random indeces to access allGoats array.
  // if the first index is the same as the second index, repick rand num.
// display the two new goats, nor should they duplicate with any images that were displayed immediately before.
// store the immediately before pics in an array to check current goats against them.
// choose rand indece(s) again depending on t/f

// after incrementing votes for each clicked goat, reset img1 and img2 to newly displayed goats on page




// attack event listeners
// displayGoats.forEach(goat => )

// Goat.allGoats.forEach(goat => {
//   let goatImg = document.getElementById(goat.regexFilename);

//   goatImg.addEventListener('click', callback)
// })