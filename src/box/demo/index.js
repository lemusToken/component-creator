import Box from '../box'

const box = new Box({
  template: `
    <div data-box="container">
      <div data-box="body">
        <p>浮层</p>
      </div>
    </div>`,
  style: {
    'background-color': 'red'
  }
})
const box1 = box.clone({
  style: {
    'background-color': 'yellow'
  },
  show (box) {
    box.style.opacity = 1
  },
  hidden (box) {
    box.style.opacity = 0
  }
})
document.getElementById('normal').addEventListener('click', function () {
  box.create()
  box.open()
})
document.getElementById('center').addEventListener('click', function () {
  box1.setCenter().open()
})
document.getElementById('close').addEventListener('click', function () {
  box.close()
  box1.close()
  box.destroy()
})

//  浏览器不刷新，直接显示结果需要添加
if (module.hot) {
  module.hot.accept()
}