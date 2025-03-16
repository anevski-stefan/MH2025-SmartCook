export const de = {
    common: {
      welcome: "Willkommen bei Smart Cook",
      search: "Suchen",
      loading: "Laden...",
      error: "Ein Fehler ist aufgetreten",
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      signIn: "Anmelden",
      signOut: "Abmelden",
      signUp: "Registrieren",
      email: "E-Mail",
      password: "Passwort",
      forgotPassword: "Passwort vergessen?",
      noAccount: "Noch kein Konto?",
      noResults: "Keine Ergebnisse gefunden",
      typeMessage: "Nachricht eingeben...",
      send: "Senden",
    },
    navigation: {
      home: "Startseite",
      recipes: "Rezepte",
      favorites: "Favoriten",
      settings: "Einstellungen",
      scan: "Scannen",
      shoppingList: "Einkaufsliste",
      savedRecipes: "Gespeicherte Rezepte",
      myMeals: "Meine Mahlzeiten",
      profile: "Profil",
      education: "Bildung",
      chat: "Chat-Assistent",
      basicIngredients: "Grundzutaten"
    },
    recipe: {
      ingredients: "Zutaten",
      instructions: "Anleitung",
      servings: "Portionen",
      prepTime: "Vorbereitungszeit",
      cookTime: "Kochzeit",
      difficulty: "Schwierigkeitsgrad",
      categories: "Kategorien",
      noMoreRecipes: "Keine weiteren Rezepte zum Laden",
      noRecipesFound: "Keine Rezepte gefunden. Versuchen Sie andere Filter.",
      findRecipes: "Rezepte finden",
      create: "Rezept Erstellen",
      createPrompt: "Erstellen Sie Ihr erstes Rezept",
    },
    cooking: {
      start: "Kochen Starten",
      pause: "Pause",
      resume: "Fortsetzen",
      finish: "Beenden",
      timer: "Timer",
      nextStep: "Nächster Schritt",
      previousStep: "Vorheriger Schritt",
    },
    home: {
      subtitle: "Ihr KI-gesteuerter Kochassistent, der Ihnen hilft, Rezepte zu entdecken, Zutaten zu verwalten und mit Selbstvertrauen zu kochen.",
      features: {
        search: {
          title: "Intelligente Rezeptsuche",
          description: "Finden Sie Rezepte, die zu Ihren Vorlieben, Ernährungseinschränkungen und verfügbaren Zutaten passen.",
          button: "Rezepte finden"
        },
        scanner: {
          title: "Zutaten-Scanner",
          description: "Nutzen Sie Ihre Kamera, um Zutaten zu scannen und sofortige Rezeptvorschläge zu erhalten.",
          button: "Jetzt Scannen"
        },
        management: {
          title: "Zutatenverwaltung",
          description: "Behalten Sie Ihre Vorräte im Blick und erhalten Sie Benachrichtigungen, wenn Artikel zur Neige gehen.",
          button: "Zutaten verwalten"
        },
        shopping: {
          title: "Einkaufsliste",
          description: "Erstellen Sie automatisch Einkaufslisten aus Rezepten und verwalten Sie Ihren Einkaufsbedarf.",
          button: "Liste anzeigen"
        },
        collection: {
          title: "Rezeptsammlung",
          description: "Speichern Sie Ihre Lieblingsrezepte und organisieren Sie sie für schnellen Zugriff.",
          button: "Meine Rezepte"
        },
        assistant: {
          title: "Kochassistent",
          description: "Erhalten Sie Schritt-für-Schritt-Anleitungen und intelligente Timer während des Kochens.",
          button: "Kochen starten"
        }
      }
    },
    auth: {
      signInPrompt: "Anmelden für Zugriff auf den Kochassistenten",
      signInDescription: "Bitte melden Sie sich an, um den Kochassistenten und die Kamerafunktionen zu nutzen.",
      signingIn: "Anmeldung läuft...",
      signInButton: "Anmelden",
      signUpLink: "Registrieren",
      resetPassword: "Passwort zurücksetzen",
      routes: {
        login: "/auth/login",
        register: "/auth/register",
        resetPassword: "/auth/reset-password",
        verifyEmail: "/auth/verify-email"
      },
      register: {
        title: "Konto Erstellen",
        creatingAccount: "Konto wird erstellt...",
        createButton: "Konto Erstellen",
        alreadyHaveAccount: "Haben Sie bereits ein Konto?",
        passwordHelperText: "Das Passwort muss mindestens 6 Zeichen lang sein",
        errors: {
          passwordMismatch: "Die Passwörter stimmen nicht überein",
          passwordTooShort: "Das Passwort muss mindestens 6 Zeichen lang sein",
          emailRegistered: "Diese E-Mail-Adresse ist bereits registriert. Bitte versuchen Sie sich anzumelden.",
          invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          invalidPassword: "Das Passwort muss mindestens 6 Zeichen lang sein und Buchstaben sowie Zahlen enthalten.",
          generic: "Fehler beim Erstellen des Kontos. Bitte versuchen Sie es erneut."
        }
      },
      verifyEmail: {
        title: "Überprüfen Sie Ihre E-Mail",
        description: "Wir haben Ihnen eine E-Mail mit einem Bestätigungslink gesendet. Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Link, um Ihre E-Mail-Adresse zu bestätigen.",
        spamNote: "Wenn Sie die E-Mail nicht sehen können, überprüfen Sie bitte Ihren Spam-Ordner.",
        verifying: "E-Mail wird überprüft...",
        success: "E-Mail erfolgreich bestätigt!",
        redirecting: "Weiterleitung zur Startseite...",
        status: "Bestätigungsstatus",
        errors: {
          expired: "Der Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an.",
          generic: "Bitte versuchen Sie sich mit Ihrer E-Mail und Ihrem Passwort anzumelden"
        },
        goToLogin: "Zur Anmeldung"
      }
    },
    scan: {
      title: "Zutaten Scannen",
      takePhotoPrompt: "Klicken Sie unten, um ein Foto aufzunehmen",
      takePhoto: "Foto aufnehmen",
      scannedIngredients: "Gescannte Zutaten",
      clearAll: "Alles Löschen",
      noIngredients: "Keine gescannten Zutaten",
      useCamera: "Verwenden Sie die Kamera zum Scannen von Zutaten",
      saveIngredient: "Zutat Speichern",
      ingredientAdded: "wurde zu Ihren Zutaten hinzugefügt!",
      saveError: "Fehler beim Speichern der Zutat",
      processingError: "Fehler bei der Bildverarbeitung",
      imageSizeError: "Die Bildgröße ist zu groß. Bitte verwenden Sie ein Bild unter 5MB.",
      noIngredientsDetected: "Keine Zutaten erkannt",
    },
    search: {
      searchRecipes: "Rezepte suchen",
      cuisine: "Küche",
      diet: "Ernährung",
      filters: "Filter",
      filterRecipes: "Rezepte filtern",
      cookingTime: "Kochzeit (Minuten)",
      complexity: "Schwierigkeitsgrad",
      mealType: "Mahlzeitenart",
      dietaryPreferences: "Ernährungsvorlieben",
      noMoreRecipes: "Keine weiteren Rezepte zum Laden",
      noRecipesFound: "Keine Rezepte gefunden. Versuchen Sie andere Suchbegriffe oder Filter.",
      enterSearchTerm: "Geben Sie einen Suchbegriff ein, um Rezepte zu finden",
      minutes: "min",
      hours: {
        one: "h",
        plus: "h+"
      },
      mealTypes: {
        breakfast: "Frühstück",
        lunch: "Mittagessen",
        dinner: "Abendessen",
        dessert: "Dessert",
        snack: "Snack",
        appetizer: "Vorspeise"
      },
      dietaryOptions: {
        vegetarian: "Vegetarisch",
        vegan: "Vegan",
        glutenFree: "Glutenfrei",
        dairyFree: "Laktosefrei",
        lowCarb: "Low-Carb",
        keto: "Keto"
      },
      complexityLevels: {
        easy: "Einfach",
        medium: "Mittel",
        hard: "Schwer",
        Easy: "Einfach",
        Medium: "Mittel",
        Hard: "Schwer"
      }
    },
    profile: {
      settings: "Profileinstellungen",
      fullName: "Vollständiger Name",
      avatarUrl: "Avatar-URL",
      avatarHelp: "Geben Sie eine URL für Ihr Profilbild ein",
      email: "E-Mail",
      updating: "Aktualisierung...",
      updateProfile: "Profil Aktualisieren",
      updateSuccess: "Profil erfolgreich aktualisiert!",
      updateError: "Fehler beim Aktualisieren des Profils. Bitte versuchen Sie es erneut."
    },
    shoppingList: {
      title: 'Einkaufsliste',
      addItemTitle: 'Neuen Artikel hinzufügen',
      itemName: 'Artikelname',
      amount: 'Menge',
      unit: 'Einheit',
      addToList: 'Zur Liste hinzufügen',
      addItem: 'Artikel hinzufügen',
      clearChecked: 'Markierte Artikel löschen',
      empty: 'Ihre Einkaufsliste ist leer',
      updateSuccess: 'Artikel erfolgreich aktualisiert',
      updateError: 'Fehler beim Aktualisieren des Artikels',
      deleteSuccess: 'Artikel erfolgreich gelöscht',
      deleteError: 'Fehler beim Löschen des Artikels',
      addSuccess: 'Artikel erfolgreich hinzugefügt',
      addError: 'Fehler beim Hinzufügen des Artikels',
    },
    ingredients: {
      title: "Meine Zutaten",
      subtitle: "Verwalten Sie Ihre Vorratskammer und behalten Sie den Überblick über Ihre Zutaten",
      addIngredients: "Zutaten Hinzufügen",
      scanIngredients: "Zutaten Scannen",
      emptyTitle: "Ihre Vorratskammer ist leer",
      emptyDescription: "Beginnen Sie damit, Zutaten zu scannen, um sie Ihrer Liste hinzuzufügen",
      loadError: "Fehler beim Laden der Zutaten",
      deleteError: "Fehler beim Löschen der Zutat",
      units: {
        piece: "Stück",
        pieces: "Stück",
        gram: "Gramm",
        grams: "Gramm",
        kilogram: "Kilogramm",
        kilograms: "Kilogramm",
        milliliter: "Milliliter",
        milliliters: "Milliliter",
        liter: "Liter",
        liters: "Liter",
        tablespoon: "Esslöffel",
        tablespoons: "Esslöffel",
        teaspoon: "Teelöffel",
        teaspoons: "Teelöffel",
        cup: "Tasse",
        cups: "Tassen",
        pound: "Pfund",
        pounds: "Pfund",
        ounce: "Unze",
        ounces: "Unzen",
      },
    },
    footer: {
      copyright: "© 2024 Smart Cook. Alle Rechte vorbehalten.",
      links: {
        about: "Über uns",
        privacy: "Datenschutzerklärung",
        terms: "Nutzungsbedingungen",
        contact: "Kontakt"
      },
      description: "Smart Cook ist Ihr KI-gestützter Kochassistent, der Ihnen hilft, Rezepte zu entdecken, Zutaten zu verwalten und mit Selbstvertrauen zu kochen."
    },
    weeklyGoals: {
      title: "Wöchentliche Ziele",
      addGoal: "Ziel Hinzufügen",
      category: "Kategorie",
      description: "Beschreibung",
      selectDays: "Tage Auswählen",
      editGoal: "Ziel Bearbeiten",
      markAchieved: "Als Erreicht Markieren",
      achieved: "Erreicht",
      selectDatesPrompt: "Klicken Sie auf mehrere Daten, um sie auszuwählen. Klicken Sie erneut, um die Auswahl aufzuheben.",
      selectedDates: "Ausgewählte Daten",
      saveChanges: "Änderungen Speichern",
      saveDates: "Daten Speichern",
      saveToGoogleCalendar: "In Google Kalender Speichern",
      categories: {
        weeklyCalories: "Wöchentliche Kalorien",
        numberOfMeals: "Anzahl der Mahlzeiten",
        tryNewRecipes: "Neue Rezepte Ausprobieren",
        cookBalancedMeal: "Ausgewogene Mahlzeit Kochen",
        tryInternationalDish: "Internationales Gericht Ausprobieren",
        reduceFoodWaste: "Lebensmittelverschwendung Reduzieren"
      },
      messages: {
        fillAllFields: "Bitte füllen Sie alle Felder aus, bevor Sie ein Ziel hinzufügen.",
        goalSavedLocally: "Ziel lokal gespeichert!",
        goalSavedDatabase: "Ziel in der Datenbank gespeichert!",
        goalUpdated: "Ziel erfolgreich aktualisiert!",
        goalDeleted: "Ziel erfolgreich gelöscht!",
        datesSelected: "{count} Datum/Daten erfolgreich gespeichert!",
        selectDate: "Bitte wählen Sie mindestens ein Datum aus.",
        futureDatesError: "Dieses Ziel kann nicht als erreicht markiert werden, da es zukünftige Termine enthält.",
        goalAchieved: "Ziel als erreicht markiert! Herzlichen Glückwunsch!",
        goalUnachieved: "Ziel als nicht erreicht markiert."
      }
    },
  } as const; 