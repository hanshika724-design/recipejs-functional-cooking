// === Recipe Data ===
const recipes = [
  { title: "Spaghetti", difficulty: "easy", time: 25 },
  { title: "Chicken Curry", difficulty: "medium", time: 45 },
  { title: "Beef Wellington", difficulty: "hard", time: 120 },
  { title: "Salad", difficulty: "easy", time: 10 },
  { title: "Grilled Fish", difficulty: "medium", time: 30 },
  { title: "Chocolate Cake", difficulty: "hard", time: 90 },
  { title: "Pancakes", difficulty: "easy", time: 20 },
  { title: "Lasagna", difficulty: "medium", time: 60 },
];

// === State ===
let currentFilter = 'all';
let currentSort = 'none';

// === DOM References ===
const recipeContainer = document.getElementById('recipe-container');
const filterButtons = document.querySelectorAll('.filter-buttons button');
const sortButtons = document.querySelectorAll('.sort-buttons button');

// === Pure Filter Functions ===
const filterByDifficulty = (arr, level) => arr.filter(r => r.difficulty === level);
const filterByTime = (arr, maxTime) => arr.filter(r => r.time <= maxTime);

const applyFilter = (arr, filterType) => {
  switch(filterType) {
    case 'easy': return filterByDifficulty(arr, 'easy');
    case 'medium': return filterByDifficulty(arr, 'medium');
    case 'hard': return filterByDifficulty(arr, 'hard');
    case 'quick': return filterByTime(arr, 30);
    default: return arr;
  }
};

// === Pure Sort Functions ===
const sortByName = arr => [...arr].sort((a, b) => a.title.localeCompare(b.title));
const sortByTime = arr => [...arr].sort((a, b) => a.time - b.time);

const applySort = (arr, sortType) => {
  switch(sortType) {
    case 'name': return sortByName(arr);
    case 'time': return sortByTime(arr);
    default: return arr;
  }
};

// === Render Functions ===
const createRecipeCard = recipe => {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.innerHTML = `
    <h3>${recipe.title}</h3>
    <p>Difficulty: ${recipe.difficulty}</p>
    <p>Time: ${recipe.time} min</p>
  `;
  return card;
};

const renderRecipes = arr => {
  recipeContainer.innerHTML = '';
  arr.forEach(recipe => recipeContainer.appendChild(createRecipeCard(recipe)));
};

// === Update UI ===
const updateActiveButtons = () => {
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
  sortButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSort));
};

const updateDisplay = () => {
  let updated = applyFilter(recipes, currentFilter);
  updated = applySort(updated, currentSort);
  renderRecipes(updated);
  updateActiveButtons();
  console.log(`Displaying ${updated.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
};

// === Event Handlers ===
const handleFilterClick = e => {
  currentFilter = e.target.dataset.filter;
  updateDisplay();
};

const handleSortClick = e => {
  currentSort = e.target.dataset.sort;
  updateDisplay();
};

// === Setup Event Listeners ===
const setupEventListeners = () => {
  filterButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));
  sortButtons.forEach(btn => btn.addEventListener('click', handleSortClick));
};

// === Initialize App ===
updateDisplay();
setupEventListeners();