import * as me from 'melonjs'
import { gameState } from '../game-state';
import { Player } from '../entities/player';

export class StartScreen extends me.Stage {

  onResetEvent() {
    gameState.level = 1

    // Charger le niveau
    me.level.load('start', {
      onLoaded: () => {
        // Une fois le niveau chargé, créer le joueur
        // Position par défaut : centre de l'écran ou position de spawn du niveau
        const spawnX = 100; // Position X de départ visible
        const spawnY = 100; // Position Y de départ (ajustez selon votre niveau)

        const player = new Player(spawnX, spawnY, 32, 32);
        me.game.world.addChild(player, 1);

        // Centrer la vue sur le joueur au démarrage
        // Le suivi automatique prendra le relais après
        if (player.pos.x !== undefined && player.pos.y !== undefined) {
          me.game.viewport.moveTo(player.pos.x, player.pos.y);
        }

        // S'assurer que la caméra suit bien le joueur
        // (déjà configuré dans le constructeur du Player, mais on peut forcer ici si nécessaire)
      }
    });

    me.game.viewport.fadeOut('#000', 150);
    //TODO attacher le HUD
    // TODO attacher les pnj
  }
}