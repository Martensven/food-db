# API Dokumentation
Base URL
http://localhost:4321

# Endpoints

## 1. GET /

### Beskrivning: Returnerar en "Hello World!"-hälsning för att verifiera att servern fungerar.

Respons:

json
"Hello World!"

## 2. GET /recipes

### Beskrivning: Hämtar alla recept i databasen.

Respons:

json\
[\
  {\
    "recipe_id": 1,\
    "recipe_name": "Spaghetti Bolognese",\
    "instructions": "Koka pastan...",\
    "cooking_time": 30,\
    "servings": 4\
  },\
  ...\
]

## 3. GET /ingredients

### Beskrivning: Hämtar alla ingredienser i databasen.

Respons:

json\
[\
  {\
    "ingredient_id": 1,\
    "ingredient_name": "Tomat",\
    "quantity_type": "gram"\
  },\
  ...\
]

## 4. GET /recipe/:recipeName

### Beskrivning: Hämtar detaljer för ett specifikt recept inklusive ingredienser.

Parametrar:

recipeName (String): Namnet på receptet.

Respons:

json\
{\
"recipe_name": "Spaghetti Bolognese",\
  "instructions": "Koka pastan...",\
  "cooking_time": 30,\
  "servings": 4,\
  "ingredients": [\
    {\
      "ingredient_name": "Tomat",\
      "quantity": 200\
    },\
    ...\
  ]
}

## 5. POST /recipes

### Beskrivning: Lägger till ett nytt recept i databasen.

Request Body:

json\
{\
  "recipe_name": "Spaghetti Bolognese",\
  "instructions": "Koka pastan...",\
  "cooking_time": 30,\
  "servings": 4\
}

Respons:

json\
{\
  "id": 1\
}

## 6. POST /ingredients

### Beskrivning: Lägger till nya ingredienser.

Request Body:

json\
{\
  "ingredients": [\
    {\
      "ingredient_name": "Tomat",\
      "quantity_type": "gram"\
    },\\
    ...\\
  ]\\
}

Respons:

json\
{\
  "message": "Ingredienser tillagda!"\
}

## 7. POST /recipe-ingredients

### Beskrivning: Kopplar ingredienser till ett recept.

Request Body:

json\
{\
  "recipe_id": 1,\
  "ingredients": [\
    {\
      "ingredient_id": 2,\
      "quantity": 100\
    },\
    ...\
  ]\
}

Respons:

json\
{\
  "message": "Ingredienser kopplade till receptet!"\
}
## 8. PUT /recipes/:id

### Beskrivning: Uppdaterar ett befintligt recept.

Parametrar:

id (Number): ID för receptet.

Request Body:

json\
{\
  "recipe_name": "Ny namn",\
  "instructions": "Ny instruktion",\
  "cooking_time": 45,\
  "servings": 6\
}

Respons:

json\
{\
  "message": "Receptet uppdaterades!"\
}
## 9. PUT /ingredients/:id

### Beskrivning: Uppdaterar en ingrediens.

Parametrar:

id (Number): ID för ingrediensen.

Request Body:

json\
{\
  "ingredient_name": "Ny namn",\
  "quantity_type": "Ny typ"\
}

Respons:

json\
{\
  "message": "Ingrediensen uppdaterades!"\
}

## 10. PUT /recipe-ingredients/:id

### Beskrivning: Uppdaterar en koppling mellan recept och ingredienser.

Parametrar:

id (Number): ID för kopplingen.

Request Body:

json\
{\
  "recipe_id": 1,\
  "ingredient_id": 2,\
  "quantity": 150\
}

Respons:

json\
{\
  "message": "Kopplingen uppdaterades!"\
}