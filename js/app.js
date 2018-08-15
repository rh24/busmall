'use strict';
// import { ctx, myChart } from '/modules/chart.js';

// make an object of randomly generated colors with different opacities for background and border
function pickRandomColor(min, max) {
  let colorSet = [];
  for (let i = 0; i < 3; i++) {
    colorSet.push(Math.floor(Math.random() * max - min + 1) + min);
  }

  return ({
    backgroundColor: `rgba(${colorSet[0]}, ${colorSet[1]}, ${colorSet[2]}, .5)`,
    borderColor: `rgba(${colorSet[0]}, ${colorSet[1]}, ${colorSet[2]}, 1)`
  });
}

// collect n number of random color objects
function makeArrayOfRandomColors(n) {
  let randomColors = [];

  for (let i = 0; i < n; i++) {
    randomColors.push(pickRandomColor(0, 255));
  }

  return randomColors;
}

function makeCharts() {
  // remove divs with child images on page
  document.querySelectorAll('.display-pics div').forEach(img => img.remove());

  // REFACTORED SOLUTION: loop through an existing array one time
  let productNames = [], numberOfVotes = [], backgroundColors = [], borderColors = [], numberOfViews = [];
  let locallyStored = JSON.parse(localStorage.getItem('items'));'';

  locallyStored.forEach((item) => {
    productNames.push(item.displayName);
    numberOfVotes.push(item.votes);
    numberOfViews.push(item.views);
  });

  let randomColors = makeArrayOfRandomColors(20);

  randomColors.forEach(color => {
    backgroundColors.push(color.backgroundColor);
    borderColors.push(color.borderColor);
  });

  const displayVotesChart = (() => {
    let ctx = document.getElementById('votes-chart').getContext('2d');
    new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: productNames,
        datasets: [{
          label: '# of Votes',
          data: numberOfVotes,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          // radius: 2 // use for polarArea and radar
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Most popular items'
        }
      }
    });
  })();

  const displayViewsChart = (() => {
    let ctx = document.getElementById('views-chart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: productNames,
        datasets: [{
          label: '# of Votes',
          data: numberOfViews,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          // radius: 2 // use for polarArea and radar
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Most viewed items'
        }
      }
    });
  })();

  // previously, invoking both functions at the bottom didn't trigger the second chart function
  // however, for some reason, using IIFE's worked.
}

function Item(filepath, displayName, id, votes = 0, views = 0) {
  this.filepath = `./assets/${filepath}`;
  this.displayName = displayName;
  this.id = id;
  this.votes = votes;
  this.views = views;

  Item.allItems.push(this);
}

Item.allItems = [];

// doesn't mutate the original array
function sortByVotes(arr) {
  // concat returns a new array
  return arr.concat().sort((a, b) => b.votes - a.votes);
  // slice returns a shallow copy of the array
  // return Array.prototype.slice.call(allItems).sort((a, b) => b.votes - a.votes);
}

let currentSet; // stores current set of random indeces
let previousSet = []; // temporarily stores current set of random indeces to check against values displayed immediately before
let randIdx; // random index
let totalVotes = 0; // how do I wrap this in a closure?
let listDisplayCount = 0; // prevent double appending results list
let h1 = document.querySelectorAll('.display-votes h1')[0]; // displays votes and messages to user

// choose n random numbers
// but n has to be less than half of Item.allItems.length! Otherwise, code will get stuck in infinite loop!
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

// append images to display-pics html section
function appendImages(n) {
  let divAndImg;
  let displaySection = document.getElementsByClassName('display-pics')[0];

  chooseRandom(n);

  // if image elements don't already exist on the page
  if (!document.querySelectorAll('img').length) {
    for (let i = 0; i < currentSet.length; i++) {
      // locate item object to append
      let item = Item.allItems[currentSet[i]];
      item.views++;
      // create div and image
      divAndImg = createImg(item.filepath, item.id);
      // append div and image to display-pics section
      displaySection.appendChild(divAndImg);
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
  totalVotes++;
  if (totalVotes < 25) {
    // display total vote count
    // find which item is being upvoted
    let foundItem = Item.allItems.find(item => item.id === img.id);
    // increcment votes on the item object
    foundItem.votes++;
    // increment total votes
    // append three new images if not reached max votes
    appendImages(n);
  } else if (listDisplayCount < 1) {
    stopAtTwentyFive();
  }

  // dynamically display number of votes in h1
  displayVotes();
};

// attach event listeners to DOM elements
function attachEventListeners() {
  // add event listeners for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => handleClick(img));
  });
  // add event listener for restart button
  document.querySelector('.restart button').addEventListener('click', () => restart());
}

// executes after 25 votes
function stopAtTwentyFive() {
  // remove event listeners
  document.querySelectorAll('img').forEach(img => {
    img.removeEventListener('click', handleClick, true);
    img.style.display = 'none';
  });
  // save results to local storage
  localStorage.setItem('items', JSON.stringify(Item.allItems));
  //grab newly updated storage items
  let updatedItems = JSON.parse(localStorage.getItem('items'));
  // list to append li's
  let list = document.querySelectorAll('.results ol')[0];
  let resultsSection = document.querySelectorAll('.results')[0];
  // change display none to display block for results section
  sortByVotes(updatedItems).forEach(item => {
    resultsSection.style.display = 'block';
    let li = createLineItem('li', item.displayName, item.id, item.votes, item.filepath);
    list.appendChild(li);
  });

  listDisplayCount++;
  makeCharts(updatedItems);
}

function persistChart() {
  let displaySection = document.getElementsByClassName('display-pics')[0];
  // debugger;
  displaySection.style.display = 'none';
  let persistedItems = JSON.parse(localStorage.getItem('items'));
  if (persistedItems) {
    makeCharts(persistedItems);
  }
}

function createLineItem(type, displayName, id, votes) { // add src parameter if wanting to return appended image
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

function createImg(filepath, id) {
  let div = document.createElement('div');
  let img = document.createElement('img');
  img.src = filepath;
  img.id = id;
  div.appendChild(img);

  return div;
}

// displays user votes out of 25
function displayVotes() {
  h1.textContent = `${totalVotes} / 25 Votes`;
}

// refresh page if restart button is pressed
function restart() {
  // localStorage.removeItem('items');
  window.location.reload();
  runnerCode();
}

const n = 3;

function runnerCode() {
  let locallyStored = JSON.parse(localStorage.getItem('items'));
  if (locallyStored) {
    h1.textContent = 'your results';
    for (let item in locallyStored) {
      new Item(item.filepath, item.displayName, item.id, item.votes, item.views);
    }
    persistChart();
  } else {
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
  }
  appendImages(n);
  attachEventListeners();
}

runnerCode();