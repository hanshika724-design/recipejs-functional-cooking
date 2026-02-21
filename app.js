const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  // === Recipe Data ===
  const recipes = [
    {
      id: 1,
      title: "Spaghetti",
      difficulty: "easy",
      time: 25,
      ingredients: ["Pasta", "Tomato sauce", "Cheese", "Olive oil"],
      steps: ["Boil water", "Add pasta", "Drain", "Add sauce", "Serve"]
    },
    {
      id: 2,
      title: "Chicken Curry",
      difficulty: "medium",
      time: 45,
      ingredients: ["Chicken", "Onion", "Tomato", "Spices", "Oil"],
      steps: [
        "Marinate chicken",
        {
          text: "Prepare sauce",
          substeps: ["Heat oil", "Add onions", "Add tomatoes", "Add spices"]
        },
        "Cook chicken in sauce",
        "Serve with rice"
      ]
    },
    {
      id: 3,
      title: "Beef Wellington",
      difficulty: "hard",
      time: 120,
      ingredients: ["Beef", "Mushroom", "Puff pastry", "Eggs", "Butter"],
      steps: [
        "Prepare beef",
        {
          text: "Make duxelles",
          substeps: ["Chop mushrooms", "Cook mushrooms", "Cool mixture"]
        },
        "Wrap beef in pastry",
        "Bake in oven",
        "Serve sliced"
      ]
    },
    {
      id: 4,
      title: "Salad",
      difficulty: "easy",
      time: 10,
      ingredients: ["Lettuce", "Tomato", "Cucumber", "Dressing"],
      steps: ["Chop vegetables", "Mix in bowl", "Add dressing", "Serve"]
    },
    {
      id: 5,
      title: "Grilled Fish",
      difficulty: "medium",
      time: 30,
      ingredients: ["Fish fillet", "Lemon", "Salt", "Pepper", "Oil"],
      steps: ["Season fish", "Preheat grill", "Grill fish 5-6 min each side", "Serve with lemon"]
    },
    {
      id: 6,
      title: "Chocolate Cake",
      difficulty: "hard",
      time: 90,
      ingredients: ["Flour", "Cocoa powder", "Sugar", "Eggs", "Butter"],
      steps: ["Mix dry ingredients", "Mix wet ingredients", "Combine", "Bake 40 min", "Cool and serve"]
    },
    {
      id: 7,
      title: "Pancakes",
      difficulty: "easy",
      time: 20,
      ingredients: ["Flour", "Milk", "Eggs", "Sugar", "Butter"],
      steps: ["Mix ingredients", "Heat pan", "Pour batter", "Flip pancakes", "Serve with syrup"]
    },
    {
      id: 8,
      title: "Lasagna",
      difficulty: "medium",
      time: 60,
      ingredients: ["Lasagna sheets", "Cheese", "Tomato sauce", "Minced meat", "Bechamel sauce"],
      steps: [
        "Cook meat sauce",
        "Layer lasagna sheets and sauces",
        "Bake 30 minutes",
        "Cool and serve"
      ]
    }
  ];

  // === State ===
  let currentFilter = "all";
  let currentSort = "none";

  // === DOM References ===
  const recipeContainer = document.getElementById("recipe-container");
  const filterButtons = document.querySelectorAll(".filter-buttons button");
  const sortButtons = document.querySelectorAll(".sort-buttons button");

  // === Pure Filter Functions ===
  const filterByDifficulty = (arr, level) => arr.filter(r => r.difficulty === level);
  const filterByTime = (arr, maxTime) => arr.filter(r => r.time <= maxTime);

  const applyFilter = (arr, filterType) => {
    switch(filterType) {
      case "easy": return filterByDifficulty(arr, "easy");
      case "medium": return filterByDifficulty(arr, "medium");
      case "hard": return filterByDifficulty(arr, "hard");
      case "quick": return filterByTime(arr, 30);
      default: return arr;
    }
  };

  // === Pure Sort Functions ===
  const sortByName = arr => [...arr].sort((a, b) => a.title.localeCompare(b.title));
  const sortByTime = arr => [...arr].sort((a, b) => a.time - b.time);

  const applySort = (arr, sortType) => {
    switch(sortType) {
      case "name": return sortByName(arr);
      case "time": return sortByTime(arr);
      default: return arr;
    }
  };

  // === Recursive Steps Rendering ===
  const renderSteps = (steps, level = 0) => {
    const ol = document.createElement("ol");
    steps.forEach(step => {
      const li = document.createElement("li");
      if(typeof step === "string") {
        li.textContent = step;
      } else if(step.text && step.substeps) {
        li.textContent = step.text;
        li.appendChild(renderSteps(step.substeps, level + 1));
      }
      ol.appendChild(li);
    });
    return ol;
  };

  // === Recipe Card ===
  const createRecipeCard = recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>Difficulty: ${recipe.difficulty}</p>
      <p>Time: ${recipe.time} min</p>
      <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">Show Steps</button>
      <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>
      <div class="steps-container" data-recipe-id="${recipe.id}"></div>
      <div class="ingredients-container" data-recipe-id="${recipe.id}"></div>
    `;
    return card;
  };

  // === Render Recipes ===
  const renderRecipes = arr => {
    recipeContainer.innerHTML = "";
    arr.forEach(recipe => {
      const card = createRecipeCard(recipe);
      recipeContainer.appendChild(card);

      // Render steps and ingredients hidden
      const stepsContainer = card.querySelector(".steps-container");
      const ingredientsContainer = card.querySelector(".ingredients-container");

      stepsContainer.appendChild(renderSteps(recipe.steps));
      ingredientsContainer.innerHTML = `<ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>`;
    });
  };

  // === Active Buttons ===
  const updateActiveButtons = () => {
    filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === currentFilter));
    sortButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.sort === currentSort));
  };

  // === Update Display ===
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

  // === Event Delegation for Toggle Buttons ===
  const handleToggleClick = e => {
    const btn = e.target;
    if(!btn.classList.contains("toggle-btn")) return;

    const recipeId = btn.dataset.recipeId;
    const toggleType = btn.dataset.toggle;
    const container = document.querySelector(`.${toggleType}-container[data-recipe-id="${recipeId}"]`);
    container.classList.toggle("visible");

    btn.textContent = container.classList.contains("visible")
      ? `Hide ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`
      : `Show ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
  };

  // === Setup Event Listeners ===
  const setupEventListeners = () => {
    filterButtons.forEach(btn => btn.addEventListener("click", handleFilterClick));
    sortButtons.forEach(btn => btn.addEventListener("click", handleSortClick));
    recipeContainer.addEventListener("click", handleToggleClick); // delegation
    console.log("Event listeners attached!");
  };

  // === Public API ===
  return {
    init: () => {
      updateDisplay();
      setupEventListeners();
      console.log("RecipeApp ready!");
    },
    updateDisplay // optional external access
  };
})();

// === Initialize App ===
RecipeApp.init();