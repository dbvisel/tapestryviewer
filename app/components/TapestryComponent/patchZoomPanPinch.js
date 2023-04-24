const MOUSE_EVENT_PROPS = ['bubbles', 'cancelable', 'composed',
  'detail', 'view', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey',
  'shiftKey', 'altKey', 'metaKey', 'button', 'buttons','relatedTarget'];

export function patchZoomPanPinch(zoomPanPinch) {
  attachWheelPanEvents(zoomPanPinch);
  handleSafariGestureEvents(zoomPanPinch);
}

function attachWheelPanEvents(zoomPanPinch) {
  zoomPanPinch.wrapperComponent.addEventListener('wheel', createWheelPanHandler(zoomPanPinch));
}

function createWheelPanHandler(zoomPanPinch) {
  return event => {
    if (event.ctrlKey) {
      // Assume the user is pinching on the trackpad. No panning in this case, only zooming.
      return;
    }

    zoomPanPinch.onPanningStart(event);
    const simulatedMouseEvent = new MouseEvent('mousemove', {
      ...pick(event, MOUSE_EVENT_PROPS),
      clientX: event.clientX - event.deltaX,
      clientY: event.clientY - event.deltaY,
    })
    zoomPanPinch.onPanning(simulatedMouseEvent);
    zoomPanPinch.onPanningStop(event);
  }
}

function pick(obj, props) {
  return props.reduce((acc, prop) => {
    if (prop in obj) {
      acc[prop] = obj[prop];
    }
    return acc;
  }, {});
}

function handleSafariGestureEvents(zoomPanPinch) {
  let scale;
  zoomPanPinch.wrapperComponent.addEventListener('gesturestart', event => {
    scale = 1;
    event.stopPropagation();
    event.preventDefault();
  });
  zoomPanPinch.wrapperComponent.addEventListener('gesturechange', event => {
    event.stopPropagation();
    event.preventDefault();

    const simulatedWheelEvent = new WheelEvent('wheel', {
      ...pick(event, MOUSE_EVENT_PROPS),
      // react-zoom-pan-pinch actually ignores this value,
      // it only matters if it's positive or negative
      deltaY: scale - event.scale,
      ctrlKey: true,
    });
    scale = event.scale;

    zoomPanPinch.wrapperComponent.dispatchEvent(simulatedWheelEvent);
  });
  zoomPanPinch.wrapperComponent.addEventListener('gestureend', event => {
    event.stopPropagation();
    event.preventDefault();
  });
}
