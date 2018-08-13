function Item(filepath, displayName, id) {
  this.filepath = `./assets/${filepath}`;
  this.displayName = displayName;
  this.id = id;
  this.votes = 0;
  this.views = 0;

  Item.allItems.push(this);
}

Item.allItems = [];

new Item('bag.jpg', 'R2D2 Bag', 'bag');
new Item('banana.jpg', 'Banana', 'banana');
new Item('bathroom.jpg', 'Bathroom', 'bathroom');
new Item('boots.jpg', 'Boots', 'boots');
new Item('breakfast.jpg', 'Breakfast', 'breakfast');
new Item('bubblegum.jpg', 'Bubblegum', 'bubblegum');
new Item('chair.jpg', 'Chair', 'chair');
new Item('cthulhu.jpg', 'Cthulhu', 'cthulhu');
new Item('dog-duck.jpg', 'Duck mask for dogs', 'dog-duck');
new Item('dragon.jpg', 'Dragon', 'dragon');
new Item('pen.jpg', 'Pen', 'pen');
new Item('pet-sweep.jpg', 'Sweeping suit for animal feet', 'pet-sweep');
new Item('scissors.jpg', 'Scissors', 'scissors');
new Item('shark.jpg', 'Shark', 'shark');
new Item('sweep.png', 'Sweeping suit to make dusty babies', 'sweep');
new Item('tauntaun.jpg', 'Tauntaun', 'tauntaun');
new Item('unicorn.jpg', 'Unicorn', 'unicorn');
new Item('usb.gif', 'USB', 'usb');
new Item('water-can.jpg', 'Water can', 'water-can');
new Item('wine-glass.jpg', 'Wine glass', 'wine-glass');

let previousThree = []; // temporary variable to store past three randIdx
let randIdx; // random index
let currentThree; // stores current three randIdx
let totalVotes = 0; // how do I wrap this in a closure?

// chooses 3 random numbers between 0 and 19.
function chooseRandomThree() {
  currentThree = [];

  while (currentThree.length < 3 ) {
    randIdx = Math.floor(Math.random() * (20 - 0 + 0)) + 0;

    if (!currentThree.includes(randIdx) && !previousThree.includes(randIdx)) {
      currentThree.push(randIdx);
    } else {
      chooseRandomThree();
    }
  }
  previousThree = currentThree;
}

function appendThree() {
  // index of each randIdx in currentThree array starts at 0, ends at 2
  let index = 0;
  chooseRandomThree();

  // iterate over img elements and set .src property
  document.querySelectorAll('img').forEach(img => {
    let randItem;
    // select random item from all items
    randItem = Item.allItems[currentThree[index]];
    // increment number of times item has been viewed
    randItem.views++;
    // set img.src equal to randItem.filepath
    img.src = randItem.filepath;
    img.id = randItem.id;
    index++;
  });
}

// save event handler to variable in order to remove event listener later
const handleClick = (img) => {
  // find which item is being upvoted
  let foundItem = Item.allItems.find(item => item.id === img.id);
  // increcment votes on the item object
  foundItem.votes++;
  // increment total votes
  totalVotes++;
  // append three new images if not reached max votes
  if (totalVotes < 25) {
    appendThree();
  } else {
    stopAtTwentyFive();
  }
};

// add event listeners for images
function attachEventListeners() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => handleClick(img));
  });
}

appendThree();
attachEventListeners();

// turn off event listeners, display total tallies
function stopAtTwentyFive() {
  document.querySelectorAll('img').forEach(img => img.removeEventListener('click', handleClick, true));

  let list = document.querySelectorAll('.results')[0];
  list.style.display = 'block';
  // debugger;
  Item.allItems.forEach(item => {
    let li = createLineItem('li', item.displayName, item.id, item.votes, item.filepath);
    list.appendChild(li);
    // debugger;
  });
}

function createLineItem(type, displayName, id, votes, src) {
  let li = document.createElement(type);
  li.id = id;
  if (votes < 2 && votes !== 0) {
    li.textContent = `${votes} vote for the ${displayName}`;
  } else {
    li.textContent = `${votes} votes for the ${displayName}`;
  }

  // return appendImage(li, src);
  return li;
}

function appendImage(li, src) {
  let img = document.createElement('img');
  img.src = src;
  li.appendChild(img);
  return li;
}

// you'll want a constructor function that creates an object associated with each image, and has (at a minimum) properties for the name of the image (to be used for display purposes), its filepath, the number of times it has been shown, and the number of times it has been clicked. You'll probably find it useful to create a property that contains a text string you can use as an ID in HTML.

// After 25 selections have been made, turn off the event listeners on the images (to prevent additional voting) and also display a list of the products with votes received with each list item looking like "3 votes for the Banana Slicer".