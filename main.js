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
        height: 810, // 윈도우는 870으로 해야 화살표 안생김 맥은 810으로 빌드 해야 영역이 적당함
        // height: 312,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        maximizable: false
    })

    top.loadFile('index.html')

    // 개발자 도구를 엽니다.
    // win.webContents.openDevTools()
    ipcMain.on('asynchronous-message', (event, arg) => {
    })

    app.whenReady().then(() => {
        globalShortcut.register('CommandOrControl+k', () => {
            // 해당 콜백으로 사파리 브라우저를 오픈하고 쿼리스트링으로 크롬번역기를 호출한다
            let query = clipboard.readText()
            top.webContents.send('pingGoogleKor', `${googleTranslate}${query}`)
            top.webContents.send("pingPapagoKor", `${papagoTranslate}${query}`)
            top.restore() // 창이 최소
            top.setAlwaysOnTop(true)
            top.setAlwaysOnTop(false) // 최상단에 노출후 onTop 해제
            // 마지막에 입력된 클립보드의 텍스트를 번역한다
        })

        globalShortcut.register('CommandOrControl+e', () => {
            let query = clipboard.readText()
            // 마지막에 입력된 클립보드의 텍스트를 번역한다

            top.webContents.send('pingGoogleKor', `${googleTranslateEn}${query}`)
            top.webContents.send("pingPapagoKor", `${papagoTranslateEn}${query}`)
            top.restore() // 창이 최소화시 돌려준다
            top.setAlwaysOnTop(true)
            top.setAlwaysOnTop(false) // 최상단에 노출후 onTop 해제
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
