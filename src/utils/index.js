export default {
  getCssValue(str) {
    const matchResult = String(str).match(/[+-]?(0|([1-9]\d*))(\.\d+)?/)
    return Number(matchResult[0])
  },
  getCssUnit(str) {
    const matchResult = String(str).match(/([a-z]+)/)
    return matchResult[1]
  },
  getDomPropertyValue(dom, property) {
    return Number(window.getComputedStyle(dom).getPropertyValue(property).replace('px', ''));
  }
}
