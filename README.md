### Diagrammes  des échanges

#### 1. Connexion et démarrage d'une partie

```markdown
Client                                  Serveur
  |                                         |
  |--- Connexion WebSocket ---------------->|
  |                                         |
  |<-- Réponse de connexion (socket.id) ----|
  |                                         |
  |--- Requête de démarrage de partie ----->|
  |       (username, difficulty)            |
  |                                         |
  |                                         |
  |<-- Réponse de démarrage de partie ------|
  |   (gameData, playerId)                  |
  |                                         |
```

- Le client se connecte au serveur via une connexion WebSocket.
- Le serveur répond avec l'identifiant de la socket du client.
- Le client envoie une requête pour démarrer une nouvelle partie, fournissant le nom d'utilisateur du joueur et la difficulté choisie.
- Le serveur répond avec les données de jeu et l'identifiant du joueur dans la partie.

#### 2. Mise à jour du jeu

```markdown
Client                                  Serveur
  |                                         |
  |--- Requête WebSocket (keydown, keyup) -->|
  |        (direction)                       |
  |                                         |
  |--- Requête WebSocket (shoot, ulti) ---->|
  |        (type)                            |
  |                                         |
  |--- Requête WebSocket (character, difficulty) ->|
  |        (characterId, difficulty)          |
  |                                         |
  |--- Requête WebSocket (leave) ---------->|
  |                                         |
  |<-- Mise à jour de jeu (gameData) -------|
  |                                         |
```

- Le client envoie une requête WebSocket lorsqu'une touche est enfoncée ou relâchée, indiquant la direction du mouvement.
- Le client envoie une requête WebSocket lorsqu'un tir de projectile ou une attaque ultime est déclenché, spécifiant le type d'action (tir de base ou ultime).
- Le client envoie une requête WebSocket lorsqu'un changement de personnage ou de difficulté est effectué, fournissant l'identifiant du personnage choisi et la nouvelle difficulté.
- Le client envoie une requête WebSocket lorsqu'il quitte la partie.
- Le serveur répond en mettant à jour les données du jeu et en les renvoyant au client pour refléter les changements.

### Difficultés rencontrées et solutions apportées

- **Passer du jeu client only à client/serveur séparés :** 

Lors de la transition du jeu client uniquement à une architecture client/serveur séparée, la principale difficulté était de synchroniser les états du jeu entre le client et le serveur. Pour surmonter cela, nous avons créé un objet `Entity` côté serveur contenant les éléments de base tels que les coordonnées, la hauteur et la largeur des entités du jeu. Ensuite, nous avons instancié nos classes initiales côté client à partir des données de `Entity`, permettant ainsi une synchronisation efficace entre le client et le serveur.

- **Ajuster les sprites en fonction des actions des joueurs :** 

Une autre difficulté était de mettre à jour les sprites des joueurs en fonction de leurs actions telles que se déplacer, tirer, recharger, etc. Pour résoudre ce problème, nous avons ajouté une variable d'état supplémentaire à chaque joueur, indiquant son action actuelle (par exemple 'idle', 'right', 'up', 'reloading'). En fonction de cet état, nous avons ajusté les sprites pour refléter l'action en cours du joueur.

### Points d'amélioration

- **Rendre plus harmonieux les redimensionnements des personnages :** 

Une amélioration potentielle serait d'affiner les redimensionnements des personnages, en particulier lors de leurs transformations ou animations. Cela permettrait d'améliorer l'esthétique globale du jeu et de rendre les mouvements des personnages plus fluides et réalistes.

- **Rendre le jeu plus agréable sur mobile :** 

Une autre amélioration serait d'adapter le jeu pour une meilleure expérience utilisateur sur les appareils mobiles. Cela pourrait inclure des ajustements d'interface utilisateur, des contrôles tactiles optimisés et des optimisations de performance pour garantir un jeu fluide sur les appareils mobiles.

### Ce dont nous sommes le plus fiers

- **Les sprites divers et variés qui rendent le jeu agréable visuellement :** 

Nous avons investi du temps et des efforts dans la création de sprites variés pour les personnages, les ennemis, les projectiles, etc., ce qui contribue à rendre l'expérience de jeu visuellement attrayante et immersive. Il etait important de rendre hommage au legendaire Akira Toriyama.
  
- **Le style des pages web :** 

Nous sommes également fiers du design et du style des pages web associées au jeu, y compris les vues d'accueil, les scores, les crédits, etc. Nous avons veillé à ce que l'interface utilisateur soit intuitive, esthétique et engageante pour les joueurs, ce qui ajoute à l'expérience globale du jeu.

Ces aspects nous ont demandé beaucoup de travail et de créativité, et nous sommes ravis du résultat final qu'ils apportent à notre projet de jeu.