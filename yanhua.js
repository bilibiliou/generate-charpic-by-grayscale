const { createCanvas, loadImage } = require('canvas');

/** handle Image */
const ctxRadius = 80
const wctxRadius = 80
const canvas = createCanvas(wctxRadius, ctxRadius)
const ctx = canvas.getContext('2d')
const stack = [] /** 80 * 80 */
const threshold = 130

loadImage('./yanhua.png')
  .then((image) => {
    console.log(image)
    const tempCanvas = createCanvas(wctxRadius, ctxRadius)
    const tctx = tempCanvas.getContext('2d')
    tctx.drawImage(image, 0, 0, wctxRadius, ctxRadius)
    const cannaImageDataes = tctx.getImageData(0, 0, wctxRadius, ctxRadius)
    for (var i = 0; i < cannaImageDataes.data.length; i += 4) {
      let r = cannaImageDataes.data[i]
      let g = cannaImageDataes.data[i + 1]
      let b = cannaImageDataes.data[i + 2]

      // 0.2126 * r + 0.7152 * g + 0.0722 * b
      let gray = 0.2126 * (255 - r) + 0.7152 * (255 - g) + 0.0722 * (255 - b)
      cannaImageDataes.data[i] = gray
      cannaImageDataes.data[i + 1] = gray
      cannaImageDataes.data[i + 2] = gray
      if (gray <= threshold) {
        stack.push(gray)
      } else {
        stack.push(0)
      }
    }

    const surePrint = (x, y) => {
      let index = y * ctxRadius + x
      if (stack[index]) {
        return true
      }
      return false
    }

    const sleep = (ms) => new Promise((resolve) => {setTimeout(() => {resolve()}, ms)});
    const print = async (x, y) => {await process.stdout.write(surePrint(x, y) ? ' #' : '  ');};

    let y = 0
    const render = async () => {
      for (let x = 0; x < wctxRadius; x+=1) {
        await print(x, y);
        await sleep(0);
      }
      process.stdout.write('\n');
      if (y < ctxRadius) {
        y++;
        render();
      }
    };
    render();
  })


