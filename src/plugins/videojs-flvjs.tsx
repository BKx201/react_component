// 将 videojs 整合 flvjs,再输出整合后的  videojs
// copy and typescript it by  videojs-flvjs / src/plugin.js
import flvjs from 'flv.js';
import videojs from 'video.js';

// !!!!!!!!!!!!!!!!
interface PlayerOptions extends videojs.PlayerOptions {
  mediaDataSource: flvjs.MediaDataSource;
  config?: flvjs.Config;
  flvPlayer: flvjs.Player | undefined;
}

interface SourceObject {
  /**
   * The url to the source
   */
  src: string;

  /**
   * The mime type of the source
   */
  type: string;
}

const Html5 = videojs.getTech('Html5') as any; //videojs.Tech

const mergeOptions = videojs.mergeOptions;

const defaults = {
  mediaDataSource: {},
  config: {},
};

class Flvjs extends Html5 {
  // public  flvPlayer:flvjs.Player|undefined;
  /**
   * Flvjs supported mime types.
   *
   * @constant {Object}
   */
  // formats:{
  //     [key:string]:string;
  // };
  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} ready
   *        Callback function to call when the `Flvjs` Tech is ready.
   */

  constructor(options: PlayerOptions, ready: videojs.Component.ReadyCallback) {
    options = mergeOptions(defaults, options);
    super(options, ready);
  }

  /**
   * A getter/setter for the `Flvjs` Tech's source object.
   *
   * @param {Tech~SourceObject} [src]
   *        The source object you want to set on the `Flvjs` techs.
   *
   * @return {Tech~SourceObject|undefined}
   *         - The current source object when a source is not passed in.
   *         - undefined when setting
   */
  setSrc(src: videojs.Tech.SourceObject): void {
    if (this.flvPlayer !== undefined) {
      // Is this necessary to change source?
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
    }
    const mediaDataSource = this.options_.mediaDataSource;
    const config = this.options_.config;

    mediaDataSource.type =
      mediaDataSource.type === undefined ? 'flv' : mediaDataSource.type;
    mediaDataSource.url = src;
    this['flvPlayer'] = flvjs.createPlayer(mediaDataSource, config);
    this.flvPlayer.attachMediaElement(this.el_);
    this.flvPlayer.load();
  }

  /**
   * Dispose of flvjs.
   */
  dispose(): void {
    if (this.flvPlayer) {
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
    }
    super.dispose();
  }
}

/**
 * Check if the Flvjs tech is currently supported.
 *
 * @return {boolean}
 *          - True if the Flvjs tech is supported.
 *          - False otherwise.
 */
Flvjs.isSupported = function () {
  return flvjs && flvjs.isSupported();
};

/**
 * Flvjs supported mime types.
 *
 * @constant {Object}
 */
Flvjs.formats = {
  'video/flv': 'FLV',
  'video/x-flv': 'FLV',
};

/**
 * Check if the tech can support the given type
 *
 * @param {string} type
 *        The mimetype to check
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Flvjs.canPlayType = function (type: string) {
  if (Flvjs.isSupported() && type in Flvjs.formats) {
    return 'maybe';
  }

  return '';
};

/**
 * Check if the tech can support the given source
 * @param {Object} srcObj
 *        The source object
 * @param {Object} options
 *        The options passed to the tech
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Flvjs.canPlaySource = function (srcObj: SourceObject, options: Object) {
  return Flvjs.canPlayType(srcObj.type);
};

Flvjs.VERSION = '__VERSION__';

// ###############
// 注册 tech 模块
videojs.registerTech('Flvjs', Flvjs);

export default videojs;

// console.log(videojs.prototype);
