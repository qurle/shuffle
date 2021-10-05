// I really don't care about quality of the code, but you can fork it to make it better

// Constants
const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"]
const renameMsgs = ["Shuffled", "Affected", "Made it with", "Jumbled"]

let notification: NotificationHandler
let count: number
let selection: ReadonlyArray<SceneNode>

let working: boolean

interface Position {
  x: number
  y: number
}

figma.on("currentpagechange", escape)

// Main + Elements Check
const nodes: SceneNode[] = [];
working = true
selection = figma.currentPage.selection
if (selection) {
  count = selection.length
  if (count > 1) {
    shuffle(selection)
  } else {
    if (count === 1) {
      if (selection[0].type === "GROUP" || selection[0].type === "FRAME") {
        selection[0].setRelaunchData({ relaunch: '' })
        shuffle(selection[0].children)
        count = selection[0].children.length
      } else
        notify("1 layer is not enough. Select 2 or more to shuffle them")
    }
    if (count < 1)
      notify("You need 2 or more layers selected to shuffle them")
  }
  finish()
}

function shuffle(s: ReadonlyArray<SceneNode>) {

  let res: Array<Position> = s.map(el => ({ x: el.x, y: el.y }))
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
    [s[i].x, s[i].y] = [res[i].x, res[i].y]
  }
  [s[0].x, s[0].y] = [res[0].x, res[0].y]
}

function notify(text: string) {
  if (notification != null)
    notification.cancel()
  notification = figma.notify(text)
}

function escape() {
  if (notification != null)
    notification.cancel()
  if (working) {
    notify("Plugin work have been interrupted")
  }
}

function finish() {
  working = false
  // Notification
  if (count > 1) {
    notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)] +
      " " + renameMsgs[Math.floor(Math.random() * renameMsgs.length)] +
      " " + count + " layers")
  }
  //figma.viewport.scrollAndZoomIntoView(selection)
  figma.closePlugin()
}