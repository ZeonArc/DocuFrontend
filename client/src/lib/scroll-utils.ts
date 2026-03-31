let _isNavScrolling = false

export const setNavScrolling = (v: boolean) => {
  _isNavScrolling = v
}

export const getNavScrolling = () => _isNavScrolling
