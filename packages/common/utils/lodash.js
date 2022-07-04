import throttle from 'lodash.throttle'

function isNumber(obj){
  return typeof obj==='number' && !isNaN(obj)
}

export default {
  isNumber,
  throttle,
}
