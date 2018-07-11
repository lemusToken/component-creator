class Guid {
  static generate () {
    return [Guid.randomInt(4) + '' + Guid.randomInt(4), Guid.randomStr(4), Guid.randomStr(4), Guid.randomStr(4), Guid.randomStr(4) + Guid.randomStr(4) + Guid.randomStr(4)].join('-')
  }

  static randomInt (n) {
    let rand = ''
    for (let i = 0; i < n; i++) {
      let v = Math.floor(Math.random() * 10)
      rand += i === 0 && v === 0 ? 1 : v
    }
    return rand - 0
  }

  static randomStr (n) {
    const map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
      'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
      'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const len = map.length - 1
    let rand = ''

    for (let i = 0; i < n; i++) {
      rand += map[Math.round(Math.random() * len)]
    }
    return rand
  }
}

export default Guid