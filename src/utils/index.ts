import { NodeObj } from '../index'

export function encodeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}

export const isMobile = (): boolean => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const rgbHex = rgb => {
  return rgb.replace(/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, function ($0, $1, $2, $3) {
    return '#' + ('0' + Number($1).toString(16)).substr(-2) + ('0' + Number($2).toString(16)).substr(-2) + ('0' + Number($3).toString(16)).substr(-2)
  })
}

export const getObjById = function (id: string, data: NodeObj) {
  data = data || this.nodeData
  if (data.id === id) {
    return data
  } else if (data.children && data.children.length) {
    for (let i = 0; i < data.children.length; i++) {
      const res = getObjById(id, data.children[i])
      if (res) return res
    }
  } else {
    return null
  }
}

export const addParentLink = (data: NodeObj, parent?: NodeObj) => {
  data.parent = parent
  if (data.children) {
    for (let i = 0; i < data.children.length; i++) {
      addParentLink(data.children[i], data)
    }
  }
}

export function refreshIds(data: NodeObj) {
  data.id = generateUUID()
  if (data.children) {
    for (let i = 0; i < data.children.length; i++) {
      refreshIds(data.children[i])
    }
  }
}

export const throttle = (fn: (any) => void, wait: number) => {
  let pre = Date.now()
  return function (...args) {
    const now = Date.now()
    if (now - pre >= wait) {
      fn.apply(this, args)
      pre = Date.now()
    }
  }
}

export function getArrowPoints(p3x: number, p3y: number, p4x: number, p4y: number) {
  const deltay = p4y - p3y
  const deltax = p3x - p4x
  let angle = (Math.atan(Math.abs(deltay) / Math.abs(deltax)) / 3.14) * 180
  if (deltax < 0 && deltay > 0) {
    angle = 180 - angle
  }
  if (deltax < 0 && deltay < 0) {
    angle = 180 + angle
  }
  if (deltax > 0 && deltay < 0) {
    angle = 360 - angle
  }
  const arrowLength = 20
  const arrowAngle = 30
  const a1 = angle + arrowAngle
  const a2 = angle - arrowAngle
  return {
    x1: p4x + Math.cos((Math.PI * a1) / 180) * arrowLength,
    y1: p4y - Math.sin((Math.PI * a1) / 180) * arrowLength,
    x2: p4x + Math.cos((Math.PI * a2) / 180) * arrowLength,
    y2: p4y - Math.sin((Math.PI * a2) / 180) * arrowLength,
  }
}

export function calcP1(fromData, p2x, p2y) {
  let x, y
  const k = (fromData.cy - p2y) / (p2x - fromData.cx)
  if (k > fromData.h / fromData.w || k < -fromData.h / fromData.w) {
    if (fromData.cy - p2y < 0) {
      x = fromData.cx - fromData.h / 2 / k
      y = fromData.cy + fromData.h / 2
    } else {
      x = fromData.cx + fromData.h / 2 / k
      y = fromData.cy - fromData.h / 2
    }
  } else {
    // console.log('斜率', k)
    // console.log('fromData.cx-x', fromData.cx - p2x)
    if (fromData.cx - p2x < 0) {
      x = fromData.cx + fromData.w / 2
      y = fromData.cy - (fromData.w * k) / 2
    } else {
      x = fromData.cx - fromData.w / 2
      y = fromData.cy + (fromData.w * k) / 2
    }
  }
  return {
    x,
    y,
  }
}

export function calcP4(toData, p3x, p3y) {
  let x, y
  const k = (toData.cy - p3y) / (p3x - toData.cx)
  if (k > toData.h / toData.w || k < -toData.h / toData.w) {
    if (toData.cy - p3y < 0) {
      x = toData.cx - toData.h / 2 / k
      y = toData.cy + toData.h / 2
    } else {
      x = toData.cx + toData.h / 2 / k
      y = toData.cy - toData.h / 2
    }
  } else {
    // console.log('斜率', k)
    // console.log('toData.cx-x', toData.cx - p3x)
    if (toData.cx - p3x < 0) {
      x = toData.cx + toData.w / 2
      y = toData.cy - (toData.w * k) / 2
    } else {
      x = toData.cx - toData.w / 2
      y = toData.cy + (toData.w * k) / 2
    }
  }
  return {
    x,
    y,
  }
}

export function generateUUID(): string {
  return (new Date().getTime().toString(16) + Math.random().toString(16).substr(2)).substr(2, 16)
}

export function generateNewObj(): NodeObj {
  const id = generateUUID()
  return {
    topic: this.newTopicName || 'new node',
    id,
  }
}

export function generateNewLink(from, to) {
  const id = generateUUID()
  return {
    id,
    name: '',
    from,
    to,
    delta1: { x: 0, y: -100 },
    delta2: { x: 0, y: -100 },
  }
}

export function checkMoveValid(from: NodeObj, to: NodeObj) {
  let valid = true
  while (to.parent) {
    if (to.parent === from) {
      valid = false
      break
    }
    to = to.parent
  }
  return valid
}

export function getObjSibling(obj: NodeObj): NodeObj {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  if (index + 1 >= childrenList.length) {
    // 最后一个
    return null
  } else {
    return childrenList[index + 1]
  }
}

export function moveUpObj(obj: NodeObj) {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  const t = childrenList[index]
  if (index === 0) {
    childrenList[index] = childrenList[childrenList.length - 1]
    childrenList[childrenList.length - 1] = t
  } else {
    childrenList[index] = childrenList[index - 1]
    childrenList[index - 1] = t
  }
}

export function moveDownObj(obj: NodeObj) {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  const t = childrenList[index]
  if (index === childrenList.length - 1) {
    childrenList[index] = childrenList[0]
    childrenList[0] = t
  } else {
    childrenList[index] = childrenList[index + 1]
    childrenList[index + 1] = t
  }
}

export function removeNodeObj(obj: NodeObj) {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  childrenList.splice(index, 1)
  return childrenList.length
}

export function insertNodeObj(obj: NodeObj, newObj: NodeObj) {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  childrenList.splice(index + 1, 0, newObj)
}

export function insertBeforeNodeObj(obj: NodeObj, newObj: NodeObj) {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  childrenList.splice(index, 0, newObj)
}

export function insertParentNodeObj(obj: NodeObj, newObj: NodeObj) {
  const childrenList = obj.parent.children
  const index = childrenList.indexOf(obj)
  childrenList[index] = newObj
  newObj.children = [obj]
}

export function moveNodeObj(from: NodeObj, to: NodeObj) {
  removeNodeObj(from)
  if (to.children) to.children.push(from)
  else to.children = [from]
}

export function moveNodeBeforeObj(from: NodeObj, to: NodeObj) {
  removeNodeObj(from)
  const childrenList = to.parent.children
  let toIndex = 0
  for (let i = 0; i < childrenList.length; i++) {
    if (childrenList[i] === to) {
      toIndex = i
      break
    }
  }
  childrenList.splice(toIndex, 0, from)
}

export function moveNodeAfterObj(from: NodeObj, to: NodeObj) {
  removeNodeObj(from)
  const childrenList = to.parent.children
  let toIndex = 0
  for (let i = 0; i < childrenList.length; i++) {
    if (childrenList[i] === to) {
      toIndex = i
      break
    }
  }
  childrenList.splice(toIndex + 1, 0, from)
}
