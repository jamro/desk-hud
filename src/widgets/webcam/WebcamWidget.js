import Widget from '../../frontend/Widget.js'
import ArchText from '../../frontend/components/ArchText.js';
import IconButton from '../../frontend/components/IconButton.js'
import Hls from 'hls.js';
import StreamScreen from './StreamScreen.js';

export default class WebcamWidget extends Widget {
  constructor() {
    super('webcam', "Web Cam")
    this.initState({
      timemark: '',
      ready: false,
    })

    this.main.title = "Webcam"
    const streamPage = this.main.getPage(0)
  
    this._streamScreen = new StreamScreen()
    streamPage.addChild(this._streamScreen)

    this._videoLoaded = false
    this._videoPlaying = false

    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.loop = true;
    this.video.style.position = 'absolute';
    this.video.style.width = '800px';
    this.video.style.height = '600px';
    this.video.style.display = 'none';
    document.body.appendChild(this.video);

    this._videoContainer = new PIXI.Container()
    this.addChild(this._videoContainer)

    this.videoMask = new PIXI.Container();
    const mask = new PIXI.Graphics();
    mask.beginFill(0xFFFFFF);
    mask.drawCircle(0, 0, 90);
    mask.endFill();
    this.videoMask.addChild(mask);
    this.addChild(this.videoMask);
    this._videoContainer.mask = this.videoMask;

    this.hls = new Hls({
      lowLatencyMode: true,
      maxBufferLength: 2,
      maxMaxBufferLength: 2,
      liveSyncDurationCount: 1, 
      liveMaxLatencyDurationCount: 3,
      liveDurationInfinity: true,
      liveBackBufferLength: 0,   // No back-buffer to minimize latency
      maxBufferHole: 0.1,        // Reduce the acceptable buffer hole size
      enableWorker: true,
      startFragPrefetch: true,   // Prefetch the next fragment for smoother playback
    });
    this.hls.attachMedia(this.video);
    this.video.addEventListener('loadedmetadata', () => {
      setTimeout(() => {
        if(this._videoLoaded) {
          return
        }
        this._videoLoaded = true
        this._videoContainer.removeChildren()
        this.videoTexture = PIXI.Texture.from(this.video);
        this.videoTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR
        
        this.previewSprite = new PIXI.Sprite(this.videoTexture);
        this.previewSprite.anchor.set(0.5);
        this._videoContainer.addChild(this.previewSprite);
        this._streamScreen.updateVideoTexture(this.videoTexture)

        const videoScale = Math.max(200 / this.video.videoWidth, 200 / this.video.videoHeight)
        this.previewSprite.scale.set(videoScale*1.1)

      }, 1000)
    });

    this._statusLabel = new ArchText()
    this._statusLabel.positionOffset = 4.71
    this._statusLabel.alignOffset = 0
    this.addChild(this._statusLabel)

    this._playButton = new IconButton(0xe037)

    this.addChild(this._playButton)
    this._playButton.visible = false

    this._playButton.on('pointertap', (e) => {
      e.stopPropagation();

      // seek to live edge
      this._fastForwardVideo();
      this._videoPlaying = true
    })

    setInterval(() => {
      if(this._videoPlaying) {
        this._fastForwardVideo()
        this.video.play();
      }
    }, 10000)

  }

  _fastForwardVideo() {
    const buffered = this.video.buffered;
    const liveSyncPosition = this.hls.liveSyncPosition;
    if (liveSyncPosition !== undefined) {
      this.video.currentTime = liveSyncPosition;
    } else if (buffered.length > 0) {
      this.video.currentTime = buffered.end(buffered.length - 1);
    }
    this.video.play();
  }

  onConfig(config) {
    this.main.title = config.name
    this._streamScreen.areas = config.areas
  }

  onNotReady() {
    this.log('webcam_status Not ready')
  }

  onReady() {

    const loadSourceWithRetry = (hlsSource) => {
      this.hls.loadSource(hlsSource);
      //this.hls.attachMedia(video);

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.log(`Error when loading ${hlsSource}. Retrying...`);
          setTimeout(() => {
            this.hls.loadSource(hlsSource);
          }, 2000);
        }
      });
    } 
    loadSourceWithRetry('/hls/stream.m3u8')
  }

  msg2state(msg) {
    if(this.state.ready !== msg.ready && msg.ready ) {
      this.onReady()
    } else if(this.state.ready !== msg.ready && !msg.ready ) {
      this.onNotReady()
    }
    return {
      timemark: msg.timemark,
      ready: msg.ready
    }
  }

  render(renderer) {
    super.render(renderer)

    this._streamScreen.progress = this.main.progress

    this._playButton.x = 0
    this._playButton.y = 0
    this._playButton.alpha = this.progress
    this._playButton.visible = (!this._videoPlaying && this._videoLoaded)
    if(this.previewSprite) {
      this.previewSprite.alpha = this.progress
    }
    this._videoContainer.scale.set(this.size)
    this.videoMask.scale.set(this.size)

    this._statusLabel.radius = 110*this.size
    this._statusLabel.progress = this.progress
    this._statusLabel.fontSize = 12 * this.size
    this._statusLabel.visible = (this.size === 1)

    if(!this.state.ready) {
      this._statusLabel.text = 'connecting...'
    } else if(!this._videoLoaded) {
      this._statusLabel.text = 'buffering...'
    } else {
      this._statusLabel.text = 'on-line'
    }
  }
}