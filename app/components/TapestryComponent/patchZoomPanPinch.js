const MOUSE_EVENT_PROPS = ['bubbles', 'cancelable', 'composed',
  'detail', 'view', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey',
  'shiftKey', 'altKey', 'metaKey', 'button', 'buttons','relatedTarget'];

export function patchZoomPanPinch(zoomPanPinch) {
  attachWheelPanEvents(zoomPanPinch)
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
