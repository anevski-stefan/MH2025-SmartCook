export const en = {
    common: {
      welcome: "Welcome to Smart Cook",
      search: "Search",
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      signIn: "Sign In",
      signOut: "Sign Out",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      noResults: "No results found",
      typeMessage: "Type your message...",
      send: "Send",
    },
    navigation: {
      home: "Home",
      recipes: "Recipes",
      favorites: "Favorites",
      settings: "Settings",
      scan: "Scan Ingredients",
      shoppingList: "Shopping List",
      savedRecipes: "Saved Recipes",
      myMeals: "My Meals",
      profile: "Profile",
      education: "Learn to Cook",
      chat: "Chat Assistant",
      basicIngredients: "Basic Ingredients"
    },
    recipe: {
      ingredients: "Ingredients",
      instructions: "Instructions",
      servings: "Servings",
      prepTime: "Preparation Time",
      cookTime: "Cooking Time",
      difficulty: "Difficulty",
      categories: "Categories",
      noMoreRecipes: "No more recipes to load",
      noRecipesFound: "No recipes found. Try different filters.",
      findRecipes: "Find Recipes",
      create: "Create Recipe",
      createPrompt: "Start by creating your first recipe",
    },
    cooking: {
      start: "Start Cooking",
      pause: "Pause",
      resume: "Resume",
      finish: "Finish",
      timer: "Timer",
      nextStep: "Next Step",
      previousStep: "Previous Step",
    },
    home: {
      subtitle: "Your AI-powered cooking companion that helps you discover recipes, manage ingredients, and cook with confidence.",
      features: {
        search: {
          title: "Smart Recipe Search",
          description: "Find recipes that match your preferences, dietary restrictions, and available ingredients.",
          button: "Find Recipes"
        },
        scanner: {
          title: "Ingredient Scanner",
          description: "Use your camera to scan ingredients and get instant recipe suggestions.",
          button: "Scan Now"
        },
        management: {
          title: "Ingredient Management",
          description: "Keep track of your pantry and get notified when items are running low.",
          button: "Manage Ingredients"
        },
        shopping: {
          title: "Shopping List",
          description: "Automatically generate shopping lists from recipes and manage your grocery needs.",
          button: "View List"
        },
        collection: {
          title: "Recipe Collection",
          description: "Save your favorite recipes and organize them for quick access.",
          button: "My Recipes"
        },
        assistant: {
          title: "Cooking Assistant",
          description: "Get step-by-step guidance and smart timers while cooking your meals.",
          button: "Start Cooking"
        }
      }
    },
    auth: {
      signInPrompt: "Sign in to Access Cooking Assistant",
      signInDescription: "Please sign in to use the cooking assistant and camera features.",
      signingIn: "Signing in...",
      signInButton: "Sign In",
      signUpLink: "Sign up",
      resetPassword: "Reset password",
      routes: {
        login: "/auth/login",
        register: "/auth/register",
        resetPassword: "/auth/reset-password",
        verifyEmail: "/auth/verify-email"
      },
      register: {
        title: "Create Account",
        creatingAccount: "Creating Account...",
        createButton: "Create Account",
        alreadyHaveAccount: "Already have an account?",
        passwordHelperText: "Password must be at least 6 characters long",
        errors: {
          passwordMismatch: "Passwords do not match",
          passwordTooShort: "Password must be at least 6 characters long",
          emailRegistered: "This email is already registered. Please try logging in instead.",
          invalidEmail: "Please enter a valid email address.",
          invalidPassword: "Password must be at least 6 characters long and contain both letters and numbers.",
          generic: "Failed to create an account. Please try again."
        }
      },
      verifyEmail: {
        title: "Check Your Email",
        description: "We've sent you an email with a verification link. Please check your inbox and click the link to verify your email address.",
        spamNote: "If you don't see the email, please check your spam folder.",
        verifying: "Verifying your email...",
        success: "Email Verified Successfully!",
        redirecting: "Redirecting you to the home page...",
        status: "Verification Status",
        errors: {
          expired: "Verification link has expired. Please request a new one.",
          generic: "Please try logging in with your email and password"
        },
        goToLogin: "Go to Login"
      }
    },
    scan: {
      title: "Scan Ingredients",
      takePhotoPrompt: "Click below to take a photo",
      takePhoto: "Take Photo",
      scannedIngredients: "Scanned Ingredients",
      clearAll: "Clear All",
      noIngredients: "No ingredients scanned",
      useCamera: "Use the camera to scan ingredients",
      saveIngredient: "Save Ingredient",
      ingredientAdded: "has been added to your ingredients!",
      saveError: "Failed to save ingredient",
      processingError: "Failed to process image",
      imageSizeError: "Image size is too large. Please use an image under 5MB.",
      noIngredientsDetected: "No ingredients detected",
    },
    search: {
      searchRecipes: "Search Recipes",
      cuisine: "Cuisine",
      diet: "Diet",
      filters: "Filters",
      filterRecipes: "Filter Recipes",
      cookingTime: "Cooking Time (minutes)",
      complexity: "Complexity",
      mealType: "Meal Type",
      dietaryPreferences: "Dietary Preferences",
      noMoreRecipes: "No more recipes to load",
      noRecipesFound: "No recipes found. Try different search terms or filters.",
      enterSearchTerm: "Enter a search term to find recipes",
      minutes: "min",
      hours: {
        one: "h",
        plus: "h+"
      },
      mealTypes: {
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner",
        dessert: "Dessert",
        snack: "Snack",
        appetizer: "Appetizer"
      },
      dietaryOptions: {
        vegetarian: "Vegetarian",
        vegan: "Vegan",
        glutenFree: "Gluten-Free",
        dairyFree: "Dairy-Free",
        lowCarb: "Low-Carb",
        keto: "Keto"
      },
      complexityLevels: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        Easy: "Easy",
        Medium: "Medium",
        Hard: "Hard"
      }
    },
    profile: {
      settings: "Profile Settings",
      fullName: "Full Name",
      avatarUrl: "Avatar URL",
      avatarHelp: "Enter a URL for your profile picture",
      email: "Email",
      updating: "Updating...",
      updateProfile: "Update Profile",
      updateSuccess: "Profile updated successfully!",
      updateError: "Failed to update profile. Please try again."
    },
    shoppingList: {
      addItem: "Add Item",
      addItemTitle: "Add Item to Shopping List",
      clearChecked: "Clear Checked",
      empty: "Your shopping list is empty",
      itemName: "Item Name",
      amount: "Amount",
      unit: "Unit",
      addToList: "Add to List",
      addSuccess: "Item added to shopping list!",
      addError: "Failed to add item to shopping list",
      deleteSuccess: "Item removed from shopping list",
      deleteError: "Failed to remove item from shopping list",
      updateSuccess: "Shopping list updated",
      updateError: "Failed to update shopping list"
    },
    ingredients: {
      title: "My Ingredients",
      subtitle: "Manage your pantry ingredients and track what you have on hand",
      addIngredients: "Add Ingredients",
      scanIngredients: "Scan Ingredients",
      emptyTitle: "Your pantry is empty",
      emptyDescription: "Start by scanning ingredients to add them to your list",
      loadError: "Failed to load ingredients",
      deleteError: "Failed to delete ingredient",
      units: {
        piece: "piece",
        pieces: "pieces",
        gram: "gram",
        grams: "grams",
        kilogram: "kilogram",
        kilograms: "kilograms",
        milliliter: "milliliter",
        milliliters: "milliliters",
        liter: "liter",
        liters: "liters",
        tablespoon: "tablespoon",
        tablespoons: "tablespoons",
        teaspoon: "teaspoon",
        teaspoons: "teaspoons",
        cup: "cup",
        cups: "cups",
        pound: "pound",
        pounds: "pounds",
        ounce: "ounce",
        ounces: "ounces",
      },
    },
    notifications: {
      mealSaved: "Meal saved successfully!",
      errorSavingMeal: "Failed to save meal"
    },
    footer: {
      copyright: "© 2024 Smart Cook. All rights reserved.",
      links: {
        about: "About",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact Us"
      },
      description: "Smart Cook is your AI-powered cooking companion that helps you discover recipes, manage ingredients, and cook with confidence."
    },
    education: {
      title: "Culinary Education Center",
      tabs: {
        tutorials: "Cooking Tutorials",
        ingredients: "Ingredient Guide",
        equipment: "Kitchen Equipment",
        dictionary: "Culinary Dictionary",
        safety: "Safety Guide"
      },
      faq: {
        title: "Frequently Asked Questions",
        knife: {
          question: "How do I sharpen my kitchen knives properly?",
          answer: "To sharpen kitchen knives, use a sharpening stone or honing steel. Start by holding the knife at a 20-degree angle and draw it across the stone or steel in a sweeping motion. Repeat on both sides. For maintenance, hone your knives before each use."
        },
        bakingSoda: {
          question: "What's the difference between baking soda and baking powder?",
          answer: "Baking soda is pure sodium bicarbonate and requires an acid to activate. Baking powder contains baking soda plus cream of tartar (an acid) and sometimes cornstarch. Baking powder is typically used when there are no acidic ingredients in a recipe."
        },
        contamination: {
          question: "How do I prevent cross-contamination in my kitchen?",
          answer: "Use separate cutting boards for raw meat and other ingredients, wash hands frequently, clean surfaces thoroughly, use different utensils for raw and cooked foods, and store raw meat on the bottom shelf of your refrigerator."
        },
        herbs: {
          question: "What's the best way to store fresh herbs?",
          answer: "Treat herbs like flowers: trim the stems and place them in a glass of water. Cover with a plastic bag and refrigerate. For basil, keep it at room temperature. Alternatively, wrap herbs in damp paper towels and store in a plastic bag in the refrigerator."
        },
        oil: {
          question: "How do I know when my oil is hot enough for frying?",
          answer: "Use a kitchen thermometer (ideal temperature is usually 350-375°F/175-190°C). Alternatively, drop a small piece of bread in the oil - if it turns golden brown in about 60 seconds, the oil is ready. Never fill the pot more than halfway with oil."
        },
        flour: {
          question: "What's the proper way to measure flour?",
          answer: "For accurate measurements, spoon flour into the measuring cup and level it off with a straight edge. Don't scoop directly with the measuring cup as this compacts the flour and can lead to using too much."
        },
        cuttingBoard: {
          question: "How do I prevent my cutting board from slipping?",
          answer: "Place a damp paper towel or kitchen towel underneath your cutting board. You can also use non-slip mats or boards with rubber feet. This creates friction and keeps the board stable while chopping."
        }
      }
    },
    weeklyGoals: {
      title: "Weekly Goals",
      addGoal: "Add Goal",
      category: "Category",
      description: "Description",
      selectDays: "Select Days",
      editGoal: "Edit Goal",
      markAchieved: "Mark Achieved",
      achieved: "Achieved",
      selectDatesPrompt: "Click on multiple dates to select them. Click again to deselect.",
      selectedDates: "Selected Dates",
      saveChanges: "Save Changes",
      saveDates: "Save Dates",
      saveToGoogleCalendar: "Save to Google Calendar",
      categories: {
        weeklyCalories: "Weekly Calories",
        numberOfMeals: "Number of Meals",
        tryNewRecipes: "Try New Recipes",
        cookBalancedMeal: "Cook a Balanced Meal",
        tryInternationalDish: "Try an International Dish",
        reduceFoodWaste: "Reduce Food Waste"
      },
      messages: {
        fillAllFields: "Please fill in all fields before adding a goal.",
        goalSavedLocally: "Goal saved locally!",
        goalSavedDatabase: "Goal saved to database!",
        goalUpdated: "Goal updated successfully!",
        goalDeleted: "Goal deleted successfully!",
        datesSelected: "{count} date(s) saved successfully!",
        selectDate: "Please select at least one date.",
        futureDatesError: "This goal cannot be marked as achieved because it contains future dates.",
        goalAchieved: "Goal marked as achieved! Congratulations!",
        goalUnachieved: "Goal marked as not achieved."
      }
    }
  } as const; 