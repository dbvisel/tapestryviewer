# Tapestry interactions

## Mouse/touch

- canvas itself
  - when an item is focused
    - clicking on background unfocuses item, doesn't change zoom
- individual item
  - titlebar
    - titlebar itself (if it exists)
      - **double-click** this sets focus to the item
    - **full-screen icon**
      - **click** sets full screen if not full screen; otherwise, exits full screen
    - **focus icon**
      - **click** sets focus to the item; if already focused, unfocuses and returns to original zoom
    - **info icon** 
      - **click** opens info window
    - 
  - body
    - (clicking inside sets focus to the item rather than canvas)

## Keyboard
	- item
  	- when item is not focused
      - when not focused but item is hovered: **return** focuses item
      - when focused and hovered if item has not been interacted with, **return** unfocuses item

## Other