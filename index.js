// test 10000 times, 554ms, 0.0554ms per time

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const padA = (92).toString(2).padStart(8, '0') // 反斜杠
const padB = (117).toString(2).padStart(8, '0') // 字母u

function encode (input) {
  input = String(input)
  let inputLen = input.length
  const buf = new ArrayBuffer(inputLen * 2)
  const bufView = new Uint16Array(buf)
  for (var i = 0; i < inputLen; i++) {
    bufView[i] = input.charCodeAt(i);
  }
  // 转换成8位二进制码，以字符串数组形式存储
  const arr8 = []
  for (var i = 0; i < bufView.length; i++) {
    const charCode = bufView[i]
    if (charCode < 256) {
      arr8.push(bufView[i].toString(2).padStart(8, '0'))
    } else if (charCode < 65536) {
      arr8.push(padA, padB)
      const uCode = charCode.toString(16).split('').map(i => i.charCodeAt().toString(2).padStart(8, '0'))
      arr8.push(...uCode)
    }
  }
  // 分组，每三组8位二进制转为四组6位二进制并补齐8位
  let group6 = []
  // 先把每三组的8位二进制码拼成一个字符串
  while (arr8.length > 0) {
    group6.push(arr8.splice(0, 3).join(''))
  }
  // 重组为6位二进制码组
  group6 = group6.map(i => {
    var acc = []
    for (var j = 0; j < 4; j++) {
      var u = i.slice(j * 6, (j + 1) * 6)
      if (u.length > 0 && u.length <= 4) {
        u = u.padEnd(6, '0')
      } else if (u.length === 0) {
        u = '01000000'
      }
      u = u.padStart(8, '0')
      acc.push(u)
    }
    return acc
  }).flat()
  // 转换为base64字符数组并合并为字符串
  const base64Str = group6.map(s => chars.charAt(parseInt(s, 2))).join('')
  return base64Str
}

window.base64 = { encode }