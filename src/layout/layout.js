/**
 * 自适应布局
 * - 所有需要自适应的样式都需要转化成rem
 * - 默认设计尺寸1920px，当窗口在设计尺寸时，1rem = ratio px
 * - 其余尺寸自适应缩放
 * @param {number} [min=0] 自适应窗口宽度可缩小的最小尺寸
 * @param {number} [design=1920] 设计宽度尺寸，参考标准，其余尺寸根据此标准等比例进行缩放
 * @param {number} [ratio=100] 当窗口宽度在设计尺寸宽度时，1rem = ratio px
 * @author xule
 */
export default (min = 0, design = 1920, ratio = 100) => {
  const doc = document
  const win = window
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize'
  /**
   * 自适应样式控制
   */
  const recalcEM = function () {
    const clientWidth = docEl.clientWidth <= min ? min : docEl.clientWidth
    if (!clientWidth) return
    //  1rem = ratio * px
    const fontRem = ratio * (clientWidth / design)
    let css = docEl.getAttribute('style')
    if (css) {
      if (css.indexOf('font-size:') > -1) {
        css = css.replace(/font-size:.*?px( !important)?/, 'font-size:' + fontRem + 'px !important')
      }
      else {
        css += css.charAt(css.length - 1) !== ';' ? ';font-size:' + fontRem + 'px !important' : 'font-size:' + fontRem + 'px !important'
      }
    }
    docEl.setAttribute('style', css)
  }

  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalcEM, false)
  win.addEventListener('DOMContentLoad', recalcEM, false)
  recalcEM()
}