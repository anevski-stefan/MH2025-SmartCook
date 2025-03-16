export const es = {
    common: {
      welcome: "Bienvenido a Smart Cook",
      search: "Buscar",
      loading: "Cargando...",
      error: "Se produjo un error",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      signIn: "Iniciar Sesión",
      signOut: "Cerrar Sesión",
      signUp: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes una cuenta?",
      noResults: "No se encontraron resultados",
      typeMessage: "Escribe tu mensaje...",
      send: "Enviar",
    },
    navigation: {
      home: "Inicio",
      recipes: "Recetas",
      favorites: "Favoritos",
      settings: "Ajustes",
      scan: "Escanear",
      shoppingList: "Lista de Compras",
      savedRecipes: "Recetas Guardadas",
      myMeals: "Mis Comidas",
      profile: "Perfil",
      education: "Educación",
      chat: "Asistente de Chat",
      basicIngredients: "Ingredientes Básicos"
    },
    recipe: {
      ingredients: "Ingredientes",
      instructions: "Instrucciones",
      servings: "Porciones",
      prepTime: "Tiempo de Preparación",
      cookTime: "Tiempo de Cocción",
      difficulty: "Dificultad",
      categories: "Categorías",
      noMoreRecipes: "No hay más recetas para cargar",
      noRecipesFound: "No se encontraron recetas. Prueba con otros filtros.",
      findRecipes: "Buscar Recetas",
      create: "Crear Receta",
      createPrompt: "Comienza creando tu primera receta",
    },
    cooking: {
      start: "Empezar a Cocinar",
      pause: "Pausar",
      resume: "Continuar",
      finish: "Terminar",
      timer: "Temporizador",
      nextStep: "Siguiente Paso",
      previousStep: "Paso Anterior",
    },
    home: {
      subtitle: "Tu asistente de cocina con IA que te ayuda a descubrir recetas, gestionar ingredientes y cocinar con confianza.",
      features: {
        search: {
          title: "Búsqueda Inteligente de Recetas",
          description: "Encuentra recetas que coincidan con tus preferencias, restricciones dietéticas e ingredientes disponibles.",
          button: "Buscar Recetas"
        },
        scanner: {
          title: "Escáner de Ingredientes",
          description: "Usa tu cámara para escanear ingredientes y obtener sugerencias instantáneas de recetas.",
          button: "Escanear Ahora"
        },
        management: {
          title: "Gestión de Ingredientes",
          description: "Mantén un registro de tu despensa y recibe notificaciones cuando los productos se estén agotando.",
          button: "Gestionar Ingredientes"
        },
        shopping: {
          title: "Lista de Compras",
          description: "Genera automáticamente listas de compras a partir de recetas y gestiona tus necesidades de compra.",
          button: "Ver Lista"
        },
        collection: {
          title: "Colección de Recetas",
          description: "Guarda tus recetas favoritas y organízalas para un acceso rápido.",
          button: "Mis Recetas"
        },
        assistant: {
          title: "Asistente de Cocina",
          description: "Obtén guía paso a paso y temporizadores inteligentes mientras cocinas tus comidas.",
          button: "Empezar a Cocinar"
        }
      }
    },
    auth: {
      signInPrompt: "Inicia sesión para acceder al Asistente de Cocina",
      signInDescription: "Por favor, inicia sesión para usar el asistente de cocina y las funciones de la cámara.",
      signingIn: "Iniciando sesión...",
      signInButton: "Iniciar Sesión",
      signUpLink: "Registrarse",
      resetPassword: "Restablecer contraseña",
      routes: {
        login: "/auth/login",
        register: "/auth/register",
        resetPassword: "/auth/reset-password",
        verifyEmail: "/auth/verify-email"
      },
      register: {
        title: "Crear Cuenta",
        creatingAccount: "Creando Cuenta...",
        createButton: "Crear Cuenta",
        alreadyHaveAccount: "¿Ya tienes una cuenta?",
        passwordHelperText: "La contraseña debe tener al menos 6 caracteres",
        errors: {
          passwordMismatch: "Las contraseñas no coinciden",
          passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
          emailRegistered: "Este correo electrónico ya está registrado. Por favor, intenta iniciar sesión.",
          invalidEmail: "Por favor, ingresa una dirección de correo electrónico válida.",
          invalidPassword: "La contraseña debe tener al menos 6 caracteres y contener letras y números.",
          generic: "Error al crear la cuenta. Por favor, inténtalo de nuevo."
        }
      },
      verifyEmail: {
        title: "Revisa tu Correo Electrónico",
        description: "Te hemos enviado un correo electrónico con un enlace de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu dirección de correo electrónico.",
        spamNote: "Si no ves el correo, por favor revisa tu carpeta de spam.",
        verifying: "Verificando tu correo electrónico...",
        success: "¡Correo Electrónico Verificado Exitosamente!",
        redirecting: "Redirigiendo a la página principal...",
        status: "Estado de Verificación",
        errors: {
          expired: "El enlace de verificación ha expirado. Por favor, solicita uno nuevo.",
          generic: "Por favor, intenta iniciar sesión con tu correo electrónico y contraseña"
        },
        goToLogin: "Ir a Iniciar Sesión"
      }
    },
    scan: {
      title: "Escanear Ingredientes",
      takePhotoPrompt: "Haz clic abajo para tomar una foto",
      takePhoto: "Tomar Foto",
      scannedIngredients: "Ingredientes Escaneados",
      clearAll: "Borrar Todo",
      noIngredients: "No hay ingredientes escaneados",
      useCamera: "Usa la cámara para escanear ingredientes",
      saveIngredient: "Guardar Ingrediente",
      ingredientAdded: "ha sido añadido a tus ingredientes!",
      saveError: "Error al guardar el ingrediente",
      processingError: "Error al procesar la imagen",
      imageSizeError: "El tamaño de la imagen es demasiado grande. Por favor, usa una imagen menor a 5MB.",
      noIngredientsDetected: "No se detectaron ingredientes",
    },
    search: {
      searchRecipes: "Buscar Recetas",
      cuisine: "Cocina",
      diet: "Dieta",
      filters: "Filtros",
      filterRecipes: "Filtrar Recetas",
      cookingTime: "Tiempo de Cocción (minutos)",
      complexity: "Dificultad",
      mealType: "Tipo de Comida",
      dietaryPreferences: "Preferencias Dietéticas",
      noMoreRecipes: "No hay más recetas para cargar",
      noRecipesFound: "No se encontraron recetas. Prueba con otros términos de búsqueda o filtros.",
      enterSearchTerm: "Ingresa un término de búsqueda para encontrar recetas",
      minutes: "min",
      hours: {
        one: "h",
        plus: "h+"
      },
      mealTypes: {
        breakfast: "Desayuno",
        lunch: "Almuerzo",
        dinner: "Cena",
        dessert: "Postre",
        snack: "Merienda",
        appetizer: "Aperitivo"
      },
      dietaryOptions: {
        vegetarian: "Vegetariano",
        vegan: "Vegano",
        glutenFree: "Sin Gluten",
        dairyFree: "Sin Lácteos",
        lowCarb: "Bajo en Carbohidratos",
        keto: "Keto"
      },
      complexityLevels: {
        easy: "Fácil",
        medium: "Medio",
        hard: "Difícil",
        Easy: "Fácil",
        Medium: "Medio",
        Hard: "Difícil"
      }
    },
    profile: {
      settings: "Ajustes de Perfil",
      fullName: "Nombre Completo",
      avatarUrl: "URL del Avatar",
      avatarHelp: "Ingresa una URL para tu foto de perfil",
      email: "Correo electrónico",
      updating: "Actualizando...",
      updateProfile: "Actualizar Perfil",
      updateSuccess: "¡Perfil actualizado exitosamente!",
      updateError: "Error al actualizar el perfil. Por favor, inténtalo de nuevo."
    },
    shoppingList: {
      title: 'Lista de Compras',
      addItemTitle: 'Agregar Nuevo Artículo',
      itemName: 'Nombre del Artículo',
      amount: 'Cantidad',
      unit: 'Unidad',
      addToList: 'Agregar a la Lista',
      addItem: 'Agregar Artículo',
      clearChecked: 'Eliminar Artículos Marcados',
      empty: 'Tu lista de compras está vacía',
      updateSuccess: 'Artículo actualizado con éxito',
      updateError: 'Error al actualizar el artículo',
      deleteSuccess: 'Artículo eliminado con éxito',
      deleteError: 'Error al eliminar el artículo',
      addSuccess: 'Artículo agregado con éxito',
      addError: 'Error al agregar el artículo',
    },
    ingredients: {
      title: "Mis Ingredientes",
      subtitle: "Gestiona los ingredientes de tu despensa y controla lo que tienes a mano",
      addIngredients: "Agregar Ingredientes",
      scanIngredients: "Escanear Ingredientes",
      emptyTitle: "Tu despensa está vacía",
      emptyDescription: "Comienza escaneando ingredientes para agregarlos a tu lista",
      loadError: "Error al cargar los ingredientes",
      deleteError: "Error al eliminar el ingrediente",
      units: {
        piece: "unidad",
        pieces: "unidades",
        gram: "gramo",
        grams: "gramos",
        kilogram: "kilogramo",
        kilograms: "kilogramos",
        milliliter: "mililitro",
        milliliters: "mililitros",
        liter: "litro",
        liters: "litros",
        tablespoon: "cucharada",
        tablespoons: "cucharadas",
        teaspoon: "cucharadita",
        teaspoons: "cucharaditas",
        cup: "taza",
        cups: "tazas",
        pound: "libra",
        pounds: "libras",
        ounce: "onza",
        ounces: "onzas",
      },
    },
    footer: {
      copyright: "© 2024 Smart Cook. Todos los derechos reservados.",
      links: {
        about: "Acerca de",
        privacy: "Política de Privacidad",
        terms: "Términos de Servicio",
        contact: "Contáctenos"
      },
      description: "Smart Cook es tu compañero de cocina impulsado por IA que te ayuda a descubrir recetas, gestionar ingredientes y cocinar con confianza."
    },
    education: {
      title: "Centro de Educación Culinaria",
      tabs: {
        tutorials: "Tutoriales de Cocina",
        ingredients: "Guía de Ingredientes",
        equipment: "Equipo de Cocina",
        dictionary: "Diccionario Culinario",
        safety: "Guía de Seguridad"
      },
      faq: {
        title: "Preguntas Frecuentes",
        knife: {
          question: "¿Cómo afilo correctamente mis cuchillos de cocina?",
          answer: "Para afilar los cuchillos de cocina, usa una piedra de afilar o una chaira. Comienza sosteniendo el cuchillo en un ángulo de 20 grados y pásalo por la piedra o chaira con un movimiento de barrido. Repite en ambos lados. Para mantenimiento, afila tus cuchillos antes de cada uso."
        },
        bakingSoda: {
          question: "¿Cuál es la diferencia entre bicarbonato de sodio y polvo de hornear?",
          answer: "El bicarbonato de sodio es bicarbonato puro y requiere un ácido para activarse. El polvo de hornear contiene bicarbonato más cremor tártaro (un ácido) y a veces almidón de maíz. El polvo de hornear se usa típicamente cuando no hay ingredientes ácidos en una receta."
        },
        contamination: {
          question: "¿Cómo prevengo la contaminación cruzada en mi cocina?",
          answer: "Usa tablas de cortar separadas para carne cruda y otros ingredientes, lávate las manos frecuentemente, limpia las superficies a fondo, usa diferentes utensilios para alimentos crudos y cocinados, y almacena la carne cruda en el estante inferior de tu refrigerador."
        },
        herbs: {
          question: "¿Cuál es la mejor manera de almacenar hierbas frescas?",
          answer: "Trata las hierbas como flores: recorta los tallos y colócalas en un vaso con agua. Cúbrelas con una bolsa de plástico y refrigera. Para la albahaca, mantenla a temperatura ambiente. Alternativamente, envuelve las hierbas en toallas de papel húmedas y guárdalas en una bolsa de plástico en el refrigerador."
        },
        oil: {
          question: "¿Cómo sé cuándo el aceite está lo suficientemente caliente para freír?",
          answer: "Usa un termómetro de cocina (la temperatura ideal es usualmente 350-375°F/175-190°C). Alternativamente, deja caer un pequeño trozo de pan en el aceite - si se dora en aproximadamente 60 segundos, el aceite está listo. Nunca llenes la olla más de la mitad con aceite."
        },
        flour: {
          question: "¿Cuál es la forma correcta de medir la harina?",
          answer: "Para mediciones precisas, vierte la harina en la taza medidora con una cuchara y nivélala con un borde recto. No saques directamente con la taza medidora ya que esto compacta la harina y puede llevar a usar demasiada."
        },
        cuttingBoard: {
          question: "¿Cómo evito que mi tabla de cortar se deslice?",
          answer: "Coloca una toalla de papel o paño de cocina húmedo debajo de tu tabla de cortar. También puedes usar alfombrillas antideslizantes o tablas con pies de goma. Esto crea fricción y mantiene la tabla estable mientras cortas."
        }
      }
    },
    weeklyGoals: {
      title: "Objetivos Semanales",
      addGoal: "Agregar Objetivo",
      category: "Categoría",
      description: "Descripción",
      selectDays: "Seleccionar Días",
      editGoal: "Editar Objetivo",
      markAchieved: "Marcar como Logrado",
      achieved: "Logrado",
      selectDatesPrompt: "Haga clic en varias fechas para seleccionarlas. Haga clic nuevamente para deseleccionar.",
      selectedDates: "Fechas Seleccionadas",
      saveChanges: "Guardar Cambios",
      saveDates: "Guardar Fechas",
      saveToGoogleCalendar: "Guardar en Google Calendar",
      categories: {
        weeklyCalories: "Calorías Semanales",
        numberOfMeals: "Número de Comidas",
        tryNewRecipes: "Probar Nuevas Recetas",
        cookBalancedMeal: "Cocinar una Comida Equilibrada",
        tryInternationalDish: "Probar un Plato Internacional",
        reduceFoodWaste: "Reducir el Desperdicio de Alimentos"
      },
      messages: {
        fillAllFields: "Por favor complete todos los campos antes de agregar un objetivo.",
        goalSavedLocally: "¡Objetivo guardado localmente!",
        goalSavedDatabase: "¡Objetivo guardado en la base de datos!",
        goalUpdated: "¡Objetivo actualizado con éxito!",
        goalDeleted: "¡Objetivo eliminado con éxito!",
        datesSelected: "¡{count} fecha(s) guardada(s) con éxito!",
        selectDate: "Por favor seleccione al menos una fecha.",
        futureDatesError: "Este objetivo no puede marcarse como logrado porque contiene fechas futuras.",
        goalAchieved: "¡Objetivo marcado como logrado! ¡Felicitaciones!",
        goalUnachieved: "Objetivo marcado como no logrado."
      }
    }
  } as const; 