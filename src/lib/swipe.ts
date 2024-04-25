import Observer from "./observer";

type SwiperData = {
  swipeOffset: number;
  isSwiping: boolean;
};

class Swiper {
  private element: HTMLElement;
  private observer: Observer<SwiperData>;
  private boundHandlePointerDown: (event: PointerEvent) => void;
  private boundHandlePointerMove: (event: PointerEvent) => void;
  private boundHandlePointerUp: (event: PointerEvent) => void;

  constructor(element: HTMLElement) {
    this.element = element;
    this.observer = new Observer<SwiperData>();

    this.boundHandlePointerDown = this.handlePointerDown.bind(this);
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);

    this.init();
  }

  subscribe(subscriber: (data: SwiperData) => void) {
    return this.observer.subscribe(subscriber);
  }

  unsubscribe(subscriber: (data: SwiperData) => void) {
    this.observer.unsubscribe(subscriber);
  }

  destroy() {
    this.element.removeEventListener(
      "pointerdown",
      this.boundHandlePointerDown,
    );
    window.removeEventListener("pointermove", this.boundHandlePointerMove);
    window.removeEventListener("pointerup", this.boundHandlePointerUp);
  }

  private init() {
    this.element.addEventListener("pointerdown", this.boundHandlePointerDown);
    window.addEventListener("pointermove", this.boundHandlePointerMove);
    window.addEventListener("pointerup", this.boundHandlePointerUp);
  }

  private handlePointerDown(event: PointerEvent) {
    const children = this.element.querySelectorAll("*");

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (!(child instanceof HTMLElement)) {
        continue;
      }

      child.setAttribute("draggable", "false");
      child.style.userSelect = "none";
      child.style.touchAction = "none";
    }

    this.observer.notify({
      swipeOffset: 0,
      isSwiping: true,
    });
  }
  private handlePointerMove(event: PointerEvent) {}
  private handlePointerUp(event: PointerEvent) {}
}

export default Swiper;
