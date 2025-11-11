import type { VoidComponent } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import * as me from 'melonjs';
import { Player } from './entities/player';
import { gameState } from './game-state';
import { ressources } from './ressources';
import { StartScreen } from './screens/start';

export const MiniGame: VoidComponent = () => {
  let containerRef: HTMLDivElement | undefined;

  onMount(async () => {
    if (typeof window === 'undefined' || !containerRef) {
      return;
    }

    const initGame = () => {
      if (!containerRef) return;

      const containerWidth = containerRef.clientWidth || 800;
      const containerHeight = containerRef.clientHeight || 600;


      if (!me || !me.video) {
        console.error('melonJS not loaded');
        return;
      }

      me.device.onReady(() => {
        console.log('MelonJS device ready');

        const initialized = me.video.init(containerWidth, containerHeight, {
          parent: containerRef,
          scale: "auto",
          antiAlias: false,
          scaleMethod: "fit"
        });

        if (!initialized) {
          console.error("Failed to initialize melonJS canvas");
          return;
        }

        const canvas = containerRef?.querySelector('canvas') as HTMLCanvasElement | null;
        if (canvas) {
          canvas.style.maxWidth = '100%';
          canvas.style.maxHeight = '100%';
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto';
        }


        // === CONTROLS ===
        me.input.bindKey(me.input.KEY.LEFT, 'left')
        me.input.bindKey(me.input.KEY.RIGHT, 'right')
        me.input.bindKey(me.input.KEY.X, 'jump', true)
        me.input.bindKey(me.input.KEY.UP, 'jump', true)
        me.input.bindKey(me.input.KEY.SPACE, 'jump', true)
        me.input.bindKey(me.input.KEY.DOWN, 'down')

        me.input.bindKey(me.input.KEY.CTRL, 'interact', true)

        me.input.bindKey(me.input.KEY.Q, 'left')
        me.input.bindKey(me.input.KEY.D, 'right')
        me.input.bindKey(me.input.KEY.Z, 'jump', true)
        me.input.bindKey(me.input.KEY.S, 'down')

        // Initialiser l'audio
        me.audio.init("mp3,ogg");

        // Permettre cross-origin pour le chargement d'images/textures
        me.loader.setOptions({ crossOrigin: "anonymous" });

        me.loader.preload(ressources, () => {

          me.state.set(me.state.PLAY, new StartScreen())
          // register the entities
          me.pool.register('lulu', Player)

          /*
          gameState.hud = new me.TextureAtlas(
            me.loader.getJSON('tileset'),
            me.loader.getImage('tileset')
          )
          */
          gameState.texture = new me.TextureAtlas(
            me.loader.getJSON('lulu'),
            me.loader.getImage('lulu')
          )
          me.state.change(me.state.PLAY, false)
          //  me.state.change(me.state.USER + 2, false)
        })


      });
    };

    setTimeout(initGame, 1000);
  });

  onCleanup(async () => {
    // Nettoyer melonJS si nécessaire (uniquement côté client)
    if (typeof window !== 'undefined') {
      try {
        const me = await import('melonjs');
        if (me.state) {
          me.state.change(me.state.DEFAULT, true);
        }
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }
    }
  });

  return (
    <div
      id="mini-game-container"
      ref={containerRef}
      class="w-full h-full relative overflow-hidden"
      style={{ "max-height": "100%", "max-width": "100%" }}
    />
  );
};
