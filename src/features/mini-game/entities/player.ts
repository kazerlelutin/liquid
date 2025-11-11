import * as me from 'melonjs'
import { gameState } from '../game-state';

export class Player extends me.Renderable {
  projectDialCount: number;
  facingRight: boolean;
  invincible: boolean;
  body: me.Body;
  alwaysUpdate: boolean;
  dying: boolean;
  renderable: me.Renderable | null;
  onGround: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);

    this.projectDialCount = 0
    this.facingRight = true

    // Ajuster la hitbox pour qu'elle soit centrée
    // L'anchorPoint est à (0.5, 0.5), donc la position du Renderable est au centre
    // Le Body utilise un Rect relatif au coin supérieur gauche du Renderable
    // Pour centrer une hitbox de 32x32 : on commence à (-16, -16) par rapport au centre
    // Vous pouvez ajuster ces valeurs pour une hitbox plus petite ou décalée
    const hitboxWidth = width; // Largeur de la hitbox (32 par défaut, peut être réduite)
    const hitboxHeight = height; // Hauteur de la hitbox (32 par défaut)

    // Calculer l'offset pour centrer la hitbox
    // Si anchorPoint est (0.5, 0.5), le coin supérieur gauche est à (-width/2, -height/2)
    const hitboxOffsetX = -hitboxWidth / 2;
    const hitboxOffsetY = -hitboxHeight / 2;

    // Créer le Body avec une hitbox centrée
    this.body = new me.Body(this, new me.Rect(
      hitboxOffsetX,
      hitboxOffsetY,
      hitboxWidth,
      hitboxHeight
    ))

    this.invincible = false
    this.body.collisionType = me.collision.types.PLAYER_OBJECT

    // Activer les collisions
    this.body.setStatic(false); // Le joueur n'est pas statique
    this.body.ignoreGravity = false; // Le joueur est affecté par la gravité

    this.alwaysUpdate = true
    this.body.setMaxVelocity(3, 15)
    this.body.setFriction(.9, 0)

    this.body.gravityScale = 1.2

    this.dying = false
    this.onGround = false

    // Configuration de la caméra pour suivre le joueur
    // Deadzone : zone où le joueur peut bouger sans que la caméra bouge
    me.game.viewport.setDeadzone(16, 100)

    // Suivre le joueur sur les deux axes avec un léger délai (0.7 = smooth)
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.7)

    // Créer le sprite si la texture est disponible
    if (gameState.texture) {
      this.renderable = gameState.texture.createAnimationFromName() as me.Renderable;
      if (this.renderable) {
        this.renderable.anchorPoint.set(0.5, 0.5);
      }
    } else {
      this.renderable = null;
      console.warn('Player texture not loaded yet');
    }

    this.anchorPoint.set(0.5, 0.5)
  }

  update(dt: number) {
    // Réinitialiser l'état au sol (sera mis à jour par les collisions)
    this.onGround = false;

    // Gestion des mouvements
    const maxVel = this.body.maxVel;
    if (maxVel && maxVel.x !== undefined && maxVel.y !== undefined) {
      if (me.input.isKeyPressed('left')) {
        this.body.force.x = -maxVel.x;
        this.facingRight = false;
      } else if (me.input.isKeyPressed('right')) {
        this.body.force.x = maxVel.x;
        this.facingRight = true;
      } else {
        this.body.force.x = 0;
      }

      // Saut uniquement si au sol
      const vel = this.body.vel;
      if (me.input.isKeyPressed('jump') && this.onGround && vel) {
        vel.y = -maxVel.y;
        this.onGround = false; // Ne plus être au sol après le saut
      }
    }

    // Le body met à jour automatiquement la position du Renderable
    // Pas besoin de copier manuellement

    return super.update(dt);
  }

  /**
   * Gestion des collisions
   * @param response - Réponse de collision de melonJS (contient overlapV, etc.)
   * @param other - L'autre objet en collision
   * @returns true si la collision doit être résolue, false sinon
   */
  onCollision(response: { overlapV?: { x?: number; y?: number } }, other: me.Renderable): boolean {
    // Collision avec le sol/plateformes
    if (other.body && other.body.collisionType === me.collision.types.WORLD_SHAPE) {
      // Si on tombe sur le dessus d'une plateforme
      if (response.overlapV && response.overlapV.y !== undefined && response.overlapV.y > 0 &&
        this.body.vel && this.body.vel.y !== undefined && this.body.vel.y > 0) {
        this.onGround = true;
        // Arrêter la chute
        if (this.body.vel) {
          this.body.vel.y = 0;
        }
        return true;
      }
      // Collision latérale ou par le dessous
      return true;
    }

    // Collision avec des objets collectables
    if (other.body && other.body.collisionType === me.collision.types.COLLECTABLE_OBJECT) {
      // Gérer la collecte d'objets ici si nécessaire
      return false; // Ne pas bloquer le mouvement
    }

    // Collision avec des ennemis
    if (other.body && other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      if (!this.invincible && !this.dying) {
        // Gérer les dégâts ici
        console.log('Collision avec ennemi');
        // Vous pouvez ajouter la logique de dégâts ici
      }
      return true;
    }

    // Par défaut, résoudre la collision
    return true;
  }

  draw(renderer: me.CanvasRenderer) {
    // Si le sprite est chargé, le dessiner
    if (this.renderable) {
      this.renderable.pos.copy(this.pos);
      this.renderable.flipX(!this.facingRight);
      this.renderable.draw(renderer);
    } else {
      // Fallback : dessiner un rectangle pour debug
      const x = this.pos.x ?? 0;
      const y = this.pos.y ?? 0;
      const w = this.width ?? 32;
      const h = this.height ?? 32;
      renderer.setColor('#ff2a83'); // Rose fuchsia de votre palette
      renderer.fillRect(x - w / 2, y - h / 2, w, h);
    }
    super.draw(renderer);
  }
}