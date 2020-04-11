const {app, globalShortcut, BrowserWindow, shell, clipboard, ipcMain} = require('electron')

function createWindow() {
    // 브라우저 창을 생성합니다.
    let googleTranslate = 'https://translate.google.co.kr/?hl=ko&tab=TT&authuser=0#view=home&op=translate&sl=auto&tl=ko&text='
    let googleTranslateEn = 'https://translate.google.co.kr/?hl=ko#view=home&op=translate&sl=auto&tl=en&text='

    let papagoTranslate = 'https://papago.naver.com/?sk=auto&tk=ko&st='
    let papagoTranslateEn = 'https://papago.naver.com/?sk=auto&tk=en&st='

    const top = new BrowserWindow({
        width: 700,
        // width: 450,
        height: 600,
        // height: 312,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        maximizable: false
    })

    let x = top.getPosition()[0]
    let y = top.getPosition()[1] + -300
    top.setPosition(x, y)
    top.loadFile('index.html')

    let googleStat = false
    let papagoStat = false

    let childGoogle
    let childPapago

    // 개발자 도구를 엽니다.
    // win.webContents.openDevTools()
    ipcMain.on('asynchronous-message', (event, arg) => {
        // console.log(arg) // 이벤트를 전달받는다 'google' or 'papago'
        // event.reply('asynchronous-reply', 'pong') // 이벤트 발생자에게 반환시 사용
        if (arg === 'google') {
            if (googleStat === false) {
                childGoogle = new BrowserWindow({
                    width: 600,
                    height: 400,
                    // parent: top,
                    // closable: false,
                    // show:false
                })
                childGoogle.on('close', function (e) { //   <---- Catch close event
                    // e.preventDefault()
                    // childPapago.minimize()
                    googleStat = false
                })
                childGoogle.loadURL(`${googleTranslate}`)

                googleStat = true
                // console.log(top.getPosition())
                let x = top.getPosition()[0] - 375
                let y = top.getPosition()[1] + 312
                childGoogle.setPosition(x, y)
                // childGoogle.show()
                return
            }
            googleStat = false
            childGoogle.close()
        }

        if (arg === 'papago') {
            if (papagoStat === false) {
                childPapago = new BrowserWindow({
                    width: 600,
                    height: 400,
                    // parent: top,
                    // closable: false,
                    // show:false
                })
                childPapago.on('close', function (e) { //   <---- Catch close event
                    // e.preventDefault()
                    // childPapago.minimize()
                    papagoStat = false
                })
                childPapago.loadURL(`${papagoTranslate}`)

                papagoStat = true
                // console.log(top.getPosition())
                let x = top.getPosition()[0] + 225
                let y = top.getPosition()[1] + 312
                childPapago.setPosition(x, y)
                // childPapago.show()
                return
            }
            papagoStat = false
            childPapago.close()
        }
    })

    app.whenReady().then(() => {
        globalShortcut.register('CommandOrControl+k', () => {
            // console.log('CommandOrControl+X is pressed')
            // 해당 콜백으로 사파리 브라우저를 오픈하고 쿼리스트링으로 크롬번역기를 호출한다
            // console.log(document.getElementById('foo'))
            // document.getElementById("foo").href = "http://www.address.com";


            let query = clipboard.readText()
            top.webContents.send('ping', `${googleTranslate}${query}`)
            // 마지막에 입력된 클립보드의 텍스트를 번역한다
            if (googleStat) { // 사용자가 stat을 비활성화시 동작하지 않음
                childGoogle.loadURL(`${googleTranslate}${query}`)
                childGoogle.restore() // 창이 최소
                childGoogle.setAlwaysOnTop(true)
                childGoogle.setAlwaysOnTop(false) // 최상단에 노출후 onTop 해제
            }

            if (papagoStat) {
                childPapago.loadURL(`${papagoTranslate}${query}`)
                childPapago.restore()
                childPapago.setAlwaysOnTop(true)
                childPapago.setAlwaysOnTop(false)
            }

            // shell.openExternal(`${googleTranslate}${query}`)
            // shell.openExternal(`${papagoTranslate}${query}`)
        })

        globalShortcut.register('CommandOrControl+e', () => {
            // console.log('CommandOrControl+X is pressed')
            // 해당 콜백으로 사파리 브라우저를 오픈하고 쿼리스트링으로 크롬번역기를 호출한다
            // console.log(document.getElementById('foo'))
            // document.getElementById("foo").href = "http://www.address.com";

            let query = clipboard.readText()
            // 마지막에 입력된 클립보드의 텍스트를 번역한다

            if (googleStat) {
                childGoogle.loadURL(`${googleTranslateEn}${query}`)
                childGoogle.restore()
                childGoogle.setAlwaysOnTop(true)
                childGoogle.setAlwaysOnTop(false)
            }

            if (papagoStat) {
                childPapago.loadURL(`${papagoTranslateEn}${query}`)
                childPapago.restore()
                childPapago.setAlwaysOnTop(true)
                childPapago.setAlwaysOnTop(false)
            }

            // shell.openExternal(`${googleTranslate}${query}`)
            // shell.openExternal(`${papagoTranslate}${query}`)
        })
    })
}

// 이 메소드는 Electron의 초기화가 완료되고
// 브라우저 윈도우가 생성될 준비가 되었을때 호출된다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.whenReady().then(createWindow)

// 모든 윈도우가 닫히면 종료된다.
app.on('window-all-closed', () => {
    // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
    // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
    // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// 이 파일에는 나머지 앱의 특정 주요 프로세스 코드를 포함시킬 수 있습니다. 별도의 파일에 추가할 수도 있으며 이 경우 require 구문이 필요합니다.
