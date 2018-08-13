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

let currentSet; // stores current set of random indeces
let previousSet = []; // temporarily stores current set of random indeces to check against values displayed immediately before
let randIdx; // random index
let totalVotes = 0; // how do I wrap this in a closure?
let listDisplayCount = 0; // prevent double appending results list

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

// choose n random numbers
function chooseRandom(n) {
  currentSet = [];

  while (currentSet.length < n) {
    randIdx = Math.floor(Math.random() * (20 - 0 + 0)) + 0;

    if (!currentSet.includes(randIdx) && !previousSet.includes(randIdx)) {
      // push unique values into current array
      currentSet.push(randIdx);
    } else {
      randIdx = Math.floor(Math.random() * (20 - 0 + 0)) + 0;
    }
  }

  // set temporary values to compare against next set of random numbers
  previousSet = currentSet;
}

// append images to display-pics html section that currently has display set to none
function appendImages(n) {
  let divAndImg;

  chooseRandom(n);

  if (!document.querySelectorAll('img').length) {
    for (let i = 0; i < currentSet.length; i++) {
      // locate item object
      let item = Item.allItems[currentSet[i]];
      // create div and image
      divAndImg = createImg(item.filepath, item.id);
      // append div and image to display-pics section
      document.getElementsByClassName('display-pics')[0].appendChild(divAndImg);
    }
  } else {
    let index = 0;
    // iterate over img elements and set .src property
    document.querySelectorAll('img').forEach(img => {
      let randItem;
      // select random item from all items
      randItem = Item.allItems[currentSet[index]];
      // increment number of times item has been viewed
      randItem.views++;
      img.id = randItem.id;
      img.src = randItem.filepath;
      index++;
    });
  }
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
    // appendThree();
    appendImages(n);
  } else if (listDisplayCount < 1) {
    stopAtTwentyFive();
  }
};

// add event listeners for images
function attachEventListeners() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => handleClick(img));
  });
}

// turn off event listeners, display total tallies
function stopAtTwentyFive() {
  document.querySelectorAll('img').forEach(img => img.removeEventListener('click', handleClick, true));

  let list = document.querySelectorAll('.results')[0];
  // change display none to display block for results section
  list.style.display = 'block';
  Item.allItems.forEach(item => {
    let li = createLineItem('li', item.displayName, item.id, item.votes, item.filepath);
    list.appendChild(li);
  });

  listDisplayCount++;
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

// use if wanting to display image instead of display name
function appendImage(li, src) {
  let img = document.createElement('img');
  img.src = src;
  li.appendChild(img);
  return li;
}

function createImg(filepath, id) {
  let div = document.createElement('div');
  let img = document.createElement('img');
  img.src = filepath;
  img.id = id;
  div.appendChild(img);

  return div;
}


const n = 6;
appendImages(n);
attachEventListeners();