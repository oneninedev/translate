const { app, globalShortcut, BrowserWindow, shell, clipboard } = require('electron')

function createWindow () {
    // 브라우저 창을 생성합니다.
    let googleTranslate = 'https://translate.google.co.kr/?hl=ko&tab=TT&authuser=0#view=home&op=translate&sl=auto&tl=ko&text='
    let papagoTranslate = 'https://papago.naver.com/?sk=auto&tk=ko&st='

    const top = new BrowserWindow({
        width: 600,
        height: 500,
        x:500
    })

    const childGoogle = new BrowserWindow({
        width: 600,
        height: 500,
        parent: top,
        closable: false
    })

    const childPapago = new BrowserWindow({
        width: 600,
        height: 500,
        parent: top,
        closable: false
    })

    childGoogle.close = () => {
        top.close()
    }
    childPapago.close = () => {
        top.close()
    }
    
    // const win = new BrowserWindow({
    //     width: 600,
    //     height: 400,
    //     webPreferences: {
    //         nodeIntegration: true,
    //         webviewTag: true,
    //         zoomFactor: 1.0
    //     },
    //     parent: top
    // })
    // win.show()
    // top.show()

    // and load the index.html of the app.
    // win.loadFile('index.html')
    childGoogle.loadURL(`${googleTranslate}`)
    childPapago.loadURL(`${papagoTranslate}`)

    // 개발자 도구를 엽니다.
    // win.webContents.openDevTools()

    app.whenReady().then(() => {
        globalShortcut.register('CommandOrControl+X', () => {
            // console.log('CommandOrControl+X is pressed')
            // 해당 콜백으로 사파리 브라우저를 오픈하고 쿼리스트링으로 크롬번역기를 호출한다
            // console.log(document.getElementById('foo'))
            // document.getElementById("foo").href = "http://www.address.com";

            let query = clipboard.readText()
            // 마지막에 입력된 클립보드의 텍스트를 번역한다

            childGoogle.loadURL(`${googleTranslate}${query}`)
            childPapago.loadURL(`${papagoTranslate}${query}`)
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
