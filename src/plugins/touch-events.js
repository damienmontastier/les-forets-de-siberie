class TouchEvents {
  constructor() {
    // document.addEventListener('touchmove', process_touchmove, false)
    // document.addEventListener('touchcancel', process_touchcancel, false)
    // document.addEventListener('touchend', process_touchend, false)
  }
  handleTouchStart = e => {
    console.log('start')
  }
  get test() {
    return 'coucou'
    document.addEventListener('touchstart', e => {
      return e
    })
  }
}

export default new TouchEvents()
