// I really don't care about quality of the code, but you can fork it to make it better
const finishMsgs = ["Done!", "You got it!", "Shufffffled!", "Is that all?", "My job here is done", "Gotcha!", "It wasn't hard", "Got it! What's next?"];
let notification;
let count;
let selection;
let working;
figma.on("currentpagechange", escape);
// Main + Elements Check
const nodes = [];
working = true;
selection = figma.currentPage.selection;
if (selection) {
    count = selection.length;
    if (count > 1) {
        shuffle(selection);
        working = false;
        finish();
    }
    else {
        if (count === 1) {
            if (selection[0].type === "GROUP") {
                shuffle(selection[0].children);
            }
            else
                notify("1 layer is succesfully shuffled with itself");
        }
        if (count < 1)
            notify("You need some layers selected to shuffle them");
        figma.closePlugin();
    }
}
function shuffle(s) {
    let res = s.map(el => ({ x: el.x, y: el.y }));
    for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
        [s[i].x, s[i].y] = [res[i].x, res[i].y];
    }
    [s[0].x, s[0].y] = [res[0].x, res[0].y];
}
function notify(text) {
    if (notification != null)
        notification.cancel();
    notification = figma.notify(text);
}
function escape() {
    if (notification != null)
        notification.cancel();
    if (working) {
        notify("Plugin work have been interrupted");
    }
}
function finish() {
    working = false;
    notify(finishMsgs[Math.floor(Math.random() * finishMsgs.length)]);
    //figma.viewport.scrollAndZoomIntoView(selection)
    figma.closePlugin();
}
