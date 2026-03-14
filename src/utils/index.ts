// utils

export function debounce(fn: Function, timeout = 250) {
  let timeoutID: ReturnType<typeof setTimeout>
  return (...args: unknown[]) => {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => fn(...args), timeout)
  }
}
