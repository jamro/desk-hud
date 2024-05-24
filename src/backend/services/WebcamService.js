const Service = require('./Service.js')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

class WebcamService extends Service {

  constructor(config, io, webApp) {
    super(config, io, webApp, 'webcam')
    this.isReady = false
    this.timemark = ''
    this.ffmpegProcess = null;
    this.setupShutdownHandlers();
  }

  async start() {
    // Ensure the HLS output directory exists
    const hlsOutputPath = path.resolve(__dirname, '..', 'www', 'hls');
    this.logger.log('HLS path:', hlsOutputPath);
    
    if (fs.existsSync(hlsOutputPath)) {
      fs.rmdirSync(hlsOutputPath, { recursive: true });
    }
    fs.mkdirSync(hlsOutputPath, { recursive: true });

    const rtspUrl = this.config.getProp('webcam.stream.rtsp')
    const segmentSize = this.config.getProp('webcam.stream.segmentSize') || 1
    const segmentCount = this.config.getProp('webcam.stream.segmentCount') || 3
    
    setTimeout(async () => {
      while(true) {
        try {
          await this.connnectStream(rtspUrl, hlsOutputPath, segmentSize, segmentCount)
        } catch(err) {
          this.logger.error('Error connecting to stream:', err)
        }
        this.logger.log('Reconnecting to stream in 1 second')
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    })
  }

  async connnectStream(url, hlsOutputPath, segmentSize, segmentCount) {
    return await new Promise((resolve, reject) => {
      this.ffmpegProcess = ffmpeg(url)
        .addOptions([
            '-codec: copy',
            '-start_number 0',
            `-hls_time ${segmentSize}`,
            `-hls_list_size ${segmentCount}`,
            '-hls_flags delete_segments', // Automatically delete old segments
            '-f hls',
            '-fflags nobuffer',       // Reduce buffer for live input
            '-flags low_delay',       // Enable low-latency decoding
            '-strict experimental',   // Allow experimental settings
            '-tune zerolatency'       // Tune for low-latency encoding
        ])
        .output(path.join(hlsOutputPath, 'stream.m3u8'))
        .on('end', () => {
          this.logger.log('FFmpeg process finished');
          this.isReady = false
          this.timemark = ''
          this.emitStatus()
          reject('FFmpeg process finished')
        })
        .on('start', (cmd) => {
          this.logger.log('FFmpeg process started: ', cmd);
        })
        .on('progress', (progress) => {
          this.timemark = progress.timemark
          const gotReady = !this.isReady
          this.isReady = true
          if(gotReady) {
            this.emitStatus()
          }
        })
        .on('error', (err, stdout, stderr) => {
          this.logger.error('Error in FFmpeg process:', err);
          this.logger.error('stdout:', stdout);
          this.logger.error('stderr:', stderr);
          this.isReady = false
          this.timemark = ''
          this.emitStatus()
          reject('Error in FFmpeg process')
        })
        .run();
    })
  }

  setupShutdownHandlers() {
    const shutdown = () => {
      if (this.ffmpegProcess) {
        this.ffmpegProcess.kill('SIGINT');
        this.ffmpegProcess = null;
      }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('exit', shutdown);
  }

  async welcomeClient(socket) {
    this.emitStatus(socket)
  }

  emitStatus(socket=null) {
    this.emit({ ready: this.isReady, timemark: this.timemark }, socket)
  }
}

module.exports = WebcamService