/**
 * Created by huimin on 2017/7/17.
 */
export default {
  exportJson: function (filename, content) {
    var eleLink = document.createElement('a')
    var blob = new Blob([content])
    eleLink.download = filename
    eleLink.style.display = 'none'
    eleLink.href = URL.createObjectURL(blob)
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  }
}
