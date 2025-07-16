// YT Global interface
declare global {
  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getPlayerState(): number;
      getCurrentTime(): number;
      setVolume(volume: number): void;
    }
    interface OnStateChangeEvent {
      data: number;
    }
    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5
    }
    var Player: {
      new (elementId: string, options: any): Player;
    };
  }
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}