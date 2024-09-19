// Creating an abstract class that other class's inherit from

export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  // will be the template element in the DOM
  templateEl: HTMLTemplateElement;

  // will be the div element with id of app
  hostEl: T;

  // a class property to store the content of template element
  element: U;

  constructor(
    templateId: string,
    hostElementId: string | T,
    insertAtStart: boolean,
    newElementId?: string | boolean
  ) {
    // query selecting elements
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    if (typeof hostElementId === 'string') {
      this.hostEl = document.getElementById(hostElementId)! as T;
    } else {
      this.hostEl = hostElementId;
    }

    // returns a document fragment
    // it is more appropriate to use cloneNode then importNode since we are cloning in to the same document.
    const cloneNode = this.templateEl.content.cloneNode(
      true
    ) as DocumentFragment;

    this.element = cloneNode.firstElementChild as U;

    if (typeof newElementId === 'string') {
      // giving it a id
      this.element.id = newElementId;
    }

    // inserts the element to the host element
    this.attach(insertAtStart);
  }

  abstract configure(): void;

  abstract renderContent(): void;

  private attach(insertAtBeginning: boolean): void {
    this.hostEl.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
}
