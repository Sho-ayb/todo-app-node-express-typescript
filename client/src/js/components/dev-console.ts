import { Component } from './abstract-component';

export class DevConsole extends Component<HTMLDivElement, HTMLDivElement> {
  private messageParaEl!: HTMLParagraphElement;

  constructor() {
    super('console__template', 'app', false, 'response__console');

    this.configure();
  }

  public configure(): void {
    this.messageParaEl = this.element.querySelector(
      '.console__display'
    )! as HTMLParagraphElement;
  }

  public displayMessage(message: string | null): void {
    this.messageParaEl.textContent = '';
    this.messageParaEl.textContent = message;
  }

  // eslint-disable-next-line class-methods-use-this
  renderContent(): void {}
}
