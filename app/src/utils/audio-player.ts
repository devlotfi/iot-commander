import { Constants } from "../constants";

/**
 * Schedules PCM chunks back-to-back on a single AudioContext.
 * An AnalyserNode sits on the output so callers can poll real playback amplitude.
 */
export class AudioPlayer {
  private ctx: AudioContext;
  private analyser: AnalyserNode;
  private analyserBuf: Float32Array;
  private nextStartTime = 0;

  constructor() {
    this.ctx = new AudioContext({
      sampleRate: Constants.LIVE_CHAT_AI_SAMPLE_RATE,
    });

    // Insert an AnalyserNode between sources and destination.
    // fftSize 256 → 128-bin time-domain buffer, low overhead.
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0; // we do our own smoothing in the orb
    this.analyser.connect(this.ctx.destination);

    this.analyserBuf = new Float32Array(this.analyser.fftSize);
  }

  enqueue(samples: Float32Array<ArrayBuffer>) {
    const buffer = this.ctx.createBuffer(
      1,
      samples.length,
      Constants.LIVE_CHAT_AI_SAMPLE_RATE,
    );
    buffer.copyToChannel(samples, 0);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    // Route through the analyser instead of directly to destination
    source.connect(this.analyser);
    const startAt = Math.max(this.ctx.currentTime, this.nextStartTime);
    source.start(startAt);
    this.nextStartTime = startAt + buffer.duration;
  }

  /**
   * Returns the current RMS amplitude of whatever is actually playing right now.
   * Call this from a requestAnimationFrame loop; it reads the live analyser buffer.
   * Returns a value in 0..1 (un-smoothed).
   */
  getPlaybackLevel(): number {
    this.analyser.getFloatTimeDomainData(
      this.analyserBuf as Float32Array<ArrayBuffer>,
    );
    let sum = 0;
    for (let i = 0; i < this.analyserBuf.length; i++)
      sum += this.analyserBuf[i] * this.analyserBuf[i];
    return Math.min(1, Math.sqrt(sum / this.analyserBuf.length) * 14);
  }

  close() {
    this.ctx.close();
  }
}
