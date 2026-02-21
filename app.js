const RecipeApp = (() => {
  const recipes = [
    {
      id: 1,
      title: "Spaghetti",
      difficulty: "easy",
      time: 20,
      ingredients: ["pasta", "tomato sauce", "cheese"],
      steps: ["Boil water", "Cook pasta", "Drain", "Add sauce"],
    },
    {
      id: 2,
      title: "Chicken Curry",
      difficulty: "medium",
      time: 45,
      ingredients: ["chicken", "onion", "spices"],
      steps: [
        "Cut chicken",
        { text: "Prepare masala", substeps: ["Chop onions", "Fry onions", "Add spices"] },
        "Cook chicken with masala",
      ],
    },
  ];

  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-buttons button");
  const sortButtons = document.querySelectorAll(".sort-buttons button");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCounter = document.querySelector("#recipe-counter");

  const filterByDifficulty = (arr, filter) => {
    switch (filter) {
      case "easy": case "medium": case "hard":
        return arr.filter((r) => r.difficulty === filter);
      case "quick": return arr.filter((r) => r.time <= 30);
      case "favorites": return arr.filter((r) => favorites.includes(r.id));
      default: return arr;
    }
  };

  const filterBySearch = (arr, query) => {
    if (!query) return arr;
    const q = query.toLowerCase().trim();
    return arr.filter((r) => r.title.toLowerCase().includes(q) || r.ingredients.some(i => i.toLowerCase().includes(q)));
  };

  const sortRecipes = (arr, sortType) => {
    if (sortType === "name") return [...arr].sort((a,b)=>a.title.localeCompare(b.title));
    if (sortType === "time") return [...arr].sort((a,b)=>a.time-b.time);
    return arr;
  };

  const renderSteps = (steps) => {
    let html = "<ol>";
    steps.forEach(step => {
      if (typeof step === "string") html += `<li>${step}</li>`;
      else html += `<li>${step.text}${renderSteps(step.substeps)}</li>`;
    });
    html += "</ol>";
    return html;
  };

  const createRecipeCard = (r) => `
    <div class="recipe-card">
      <h3>${r.title}</h3>
      <p>Difficulty: ${r.difficulty} | Time: ${r.time} min</p>
      <button class="toggle-btn" data-recipe-id="${r.id}" data-toggle="steps">Show Steps</button>
      <div class="steps-container" id="steps-${r.id}">${renderSteps(r.steps)}</div>
      <button class="toggle-btn" data-recipe-id="${r.id}" data-toggle="ingredients">Show Ingredients</button>
      <ul class="ingredients-container" id="ingredients-${r.id}">${r.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
      <button class="favorite-btn" data-recipe-id="${r.id}">${favorites.includes(r.id)?"❤️":"🤍"}</button>
    </div>
  `;

  const renderRecipes = (arr) => {
    recipeContainer.innerHTML = arr.map(createRecipeCard).join("");
    recipeCounter.textContent = `Showing ${arr.length} of ${recipes.length} recipes`;
  };

  const updateDisplay = () => {
    let result = recipes;
    result = filterBySearch(result, searchQuery);
    result = filterByDifficulty(result, currentFilter);
    result = sortRecipes(result, currentSort);
    renderRecipes(result);
  };

  const toggleFavorite = (id) => {
    favorites.includes(id) ? favorites = favorites.filter(f=>f!==id) : favorites.push(id);
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
    updateDisplay();
  };

  const handleToggleClick = (e) => {
    const btn = e.target;
    if (btn.classList.contains("toggle-btn")) {
      const type = btn.dataset.toggle;
      const container = document.getElementById(`${type}-${btn.dataset.recipeId}`);
      container.classList.toggle("visible");
      btn.textContent = btn.textContent.startsWith("Show") ? `Hide ${type}` : `Show ${type}`;
    } else if (btn.classList.contains("favorite-btn")) {
      toggleFavorite(parseInt(btn.dataset.recipeId));
    }
  };

  const handleSearchInput = (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? "inline-block" : "none";
    updateDisplay();
  };

  const handleClearSearch = () => {
    searchQuery = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  };

  const setupEventListeners = () => {
    recipeContainer.addEventListener("click", handleToggleClick);
    filterButtons.forEach(btn => btn.addEventListener("click",()=>{currentFilter=btn.dataset.filter; updateDisplay();}));
    sortButtons.forEach(btn => btn.addEventListener("click",()=>{currentSort=btn.dataset.sort; updateDisplay();}));
    searchInput.addEventListener("input", handleSearchInput);
    clearSearchBtn.addEventListener("click", handleClearSearch);
  };

  const init = () => { console.log("RecipeApp initializing..."); updateDisplay(); setupEventListeners(); console.log("RecipeApp ready!"); };

  return { init };
})();

document.addEventListener("DOMContentLoaded", RecipeApp.init);