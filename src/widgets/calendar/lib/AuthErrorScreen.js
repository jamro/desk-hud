import ErrorScreen from "../../../frontend/ErrorScreen";
import IconButton from "../../../frontend/components/IconButton";

export default class AuthErrorScreen extends ErrorScreen {
  constructor(onRetry=null) {
    super();
    this.onRetry = onRetry || (() => {})
    this._retryButton = new IconButton(0xe73c)
    this.addChild(this._retryButton)
    this._retryButton.position.set(0, 60)
    this._retryButton.on('pointertap', () => this.onRetry())
  }

  set message(value) {
    if(value === 'token_expired') {
      super.message = "Token has expired or is invalid.\nPlease log in again.";
    } else {
      super.message = value;
    }
  }

  render(renderer) {
    super.render(renderer);
    this._retryButton.scale.set(this.progress);
  }
}