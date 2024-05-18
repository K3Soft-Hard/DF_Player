function pause2 () {
    pause3 = 1 - pause3
    if (pause3 == 1) {
        makerbit.runMp3Command(Mp3Command.PAUSE)
        bluetooth.uartWriteLine("pause")
        basic.showLeds(`
            . # . # .
            . # . # .
            . # . # .
            . # . # .
            . # . # .
            `)
        kitronik_VIEW128x64.show("pause", 4, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
        basic.pause(showTime)
        kitronik_VIEW128x64.clear()
    } else {
        makerbit.runMp3Command(Mp3Command.RESUME)
        bluetooth.uartWriteLine("play")
        basic.showLeds(`
            . # . . .
            . # # . .
            . # # # .
            . # # . .
            . # . . .
            `)
        kitronik_VIEW128x64.show("play", 4, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
        basic.pause(showTime)
        kitronik_VIEW128x64.clear()
    }
    basic.pause(showTime)
    basic.clearScreen()
}
function previous () {
    pause3 = 0
    if (trackNum > 1) {
        trackNum += -1
    } else {
        trackNum = maxTrackNum
    }
    makerbit.playMp3TrackSimple(trackNum)
    bluetooth.uartWriteValue("track", trackNum)
    kitronik_VIEW128x64.show("previous", 4, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    basic.pause(showTime)
    kitronik_VIEW128x64.clear()
    descriptionRecognition()
}
bluetooth.onBluetoothConnected(function () {
    kitronik_VIEW128x64.show("Bluetooth", 2, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    kitronik_VIEW128x64.show("Connected", 3, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    makerbit.playMp3TrackSimple(79)
    basic.pause(1000)
    kitronik_VIEW128x64.clear()
})
bluetooth.onBluetoothDisconnected(function () {
    kitronik_VIEW128x64.show("Bluetooth", 2, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    kitronik_VIEW128x64.show("Disconnected", 3, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    makerbit.playMp3TrackSimple(80)
    basic.pause(1000)
    kitronik_VIEW128x64.clear()
})
function clearDisplay () {
    basic.showNumber(2500)
}
input.onButtonPressed(Button.A, function () {
    previous()
})
function initSongArray () {
    songs = [
    "",
    "Kino",
    "Indianer",
    "Vollmond",
    "Nur Getraeumt",
    "Tanz Auf Dem Vulkan",
    "99 Luftballons",
    "Zaubertrick",
    "Einmal Ist Keinmal",
    "Leuchtturm",
    "Ich Bleib' Im Bett",
    "Noch Einmal",
    "Satellitenstadt",
    "My Cosmos Is Mine",
    "Wagging Tongue",
    "Ghosts Again",
    "Don't Say You Love Me",
    "My Favourite Stranger",
    "Soul With Me",
    "Caroline's Monkey",
    "Before We Drown",
    "People Are Good",
    "Always You",
    "Never Let Me Go",
    "Speak to Me",
    "Welcome to Scatland",
    "Scatman's World",
    "Only You",
    "Quiet Desperation",
    "Scatman (Ski-Ba-Bop-Ba-Dop-Bop)",
    "Sing Now!",
    "Popstar",
    "Take Your Time",
    "Mambo Jambo",
    "Everything Changes",
    "Song of Scatland",
    "Hi, Louis",
    "Game Over Jazz"
    ]
}
function artistRecognition () {
    if (trackNum >= 38) {
        artistName = "Unknown"
    } else if (trackNum >= 25) {
        artistName = "Scatman"
    } else if (trackNum >= 13) {
        artistName = "Depeche Mode"
    } else if (trackNum >= 1) {
        artistName = "Nena"
    }
    bluetooth.uartWriteLine("artist: " + artistName)
    kitronik_VIEW128x64.show("artist: " + artistName, 3)
}
makerbit.onMp3TrackCompleted(function () {
    if (autoplayNext == 1) {
        if (trackNum < myTrackNum) {
            next()
        }
    }
})
function songRecognition () {
    bluetooth.uartWriteLine("song: " + songs[trackNum])
    if (songs[trackNum].length > 15) {
        kitronik_VIEW128x64.show("song: " + ("" + songs[trackNum].substr(0, 15) + "..."), 2)
    } else {
        kitronik_VIEW128x64.show("song: " + songs[trackNum], 2)
    }
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    btCmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    if (btCmd == "/") {
        pause2()
    } else if (btCmd == ">") {
        next()
    } else if (btCmd == "<") {
        previous()
    } else if (btCmd == "+") {
        if (volume < 30) {
            volume += 5
            bluetooth.uartWriteValue("volume", volume)
            makerbit.setMp3Volume(volume)
        } else {
            bluetooth.uartWriteString("max. volume")
        }
    } else if (btCmd == "-") {
        if (volume > 0) {
            volume += -5
            bluetooth.uartWriteValue("volume", volume)
            makerbit.setMp3Volume(volume)
        } else {
            bluetooth.uartWriteString("min. volume")
        }
    } else if (btCmd == "?play") {
        descriptionRecognition()
    } else {
        myTrackNum = parseFloat(btCmd)
        trackNum = myTrackNum
        makerbit.playMp3TrackSimple(myTrackNum)
        descriptionRecognition()
    }
})
input.onButtonPressed(Button.AB, function () {
    pause2()
})
input.onButtonPressed(Button.B, function () {
    next()
})
function descriptionRecognition () {
    bluetooth.uartWriteValue("track", trackNum)
    kitronik_VIEW128x64.show("track:" + trackNum, 1)
    artistRecognition()
    songRecognition()
    clearDisplay()
}
function next () {
    pause3 = 0
    if (trackNum < maxTrackNum) {
        trackNum += 1
    } else {
        trackNum = 1
    }
    makerbit.playMp3TrackSimple(trackNum)
    bluetooth.uartWriteValue("track", trackNum)
    kitronik_VIEW128x64.show("next", 4, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    basic.pause(showTime)
    kitronik_VIEW128x64.clear()
    descriptionRecognition()
}
function playTrackNum (num: number) {
    if (num == 3578) {
        makerbit.runMp3Command(Mp3Command.STOP)
        makerbit.setMp3Volume(5)
        kitronik_VIEW128x64.clear()
        alarmMode = true
        kitronik_VIEW128x64.show("mode: alarm", 1, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
    } else {
        alarmMode = false
        kitronik_VIEW128x64.clear()
        if (num <= maxTrackNum) {
            trackNum = num
            makerbit.playMp3TrackSimple(num)
            descriptionRecognition()
        }
    }
}
let stringKey = ""
let anKey = ""
let btCmd = ""
let myTrackNum = 0
let artistName = ""
let songs: string[] = []
let pause3 = 0
let showTime = 0
let maxTrackNum = 0
let volume = 0
let trackNum = 0
let autoplayNext = 0
let alarmMode = false
alarmMode = false
let str = ""
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
let clearDysplay = pins.digitalReadPin(DigitalPin.P14)
autoplayNext = pins.digitalReadPin(DigitalPin.P13)
analogkeypad.setAnalogKeyPad(
AnalogPin.P0
)
makerbit.connectSerialMp3(DigitalPin.P8, DigitalPin.P2)
bluetooth.startUartService()
trackNum = 1
volume = 15
makerbit.setMp3Volume(volume)
maxTrackNum = 78
showTime = 1000
pause3 = 1
initSongArray()
kitronik_VIEW128x64.show("Bluetooth MP3 Player", 1, kitronik_VIEW128x64.ShowAlign.Right)
kitronik_VIEW128x64.show("auto next:" + autoplayNext, 2, kitronik_VIEW128x64.ShowAlign.Left)
kitronik_VIEW128x64.show("clear display:" + clearDysplay, 3, kitronik_VIEW128x64.ShowAlign.Left)
kitronik_VIEW128x64.show("sequencer:" + pins.digitalReadPin(DigitalPin.P15), 4, kitronik_VIEW128x64.ShowAlign.Left)
basic.pause(1500)
kitronik_VIEW128x64.clear()
basic.forever(function () {
    if (makerbit.mp3IsPlaying()) {
        if (pins.digitalReadPin(DigitalPin.P15) == 1) {
            for (let index = 0; index <= 4; index++) {
                K3LedControl.plotLedGraph(index, randint(1, 5))
            }
        } else {
            basic.clearScreen()
        }
    } else {
        basic.clearScreen()
    }
    basic.pause(100)
})
basic.forever(function () {
    if (alarmMode) {
        kitronik_VIEW128x64.show("alarm pin: " + pins.digitalReadPin(DigitalPin.P1), 2, kitronik_VIEW128x64.ShowAlign.Left, kitronik_VIEW128x64.FontSelection.Normal)
        if (!(makerbit.mp3IsPlaying())) {
            if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                makerbit.playMp3TrackSimple(81)
            }
        }
    }
    basic.pause(300)
})
loops.everyInterval(200, function () {
    anKey = analogkeypad.getKeyString()
    if (anKey != "") {
        if (anKey == "#") {
            playTrackNum(parseFloat(stringKey))
            stringKey = ""
        } else if (anKey == "*") {
            stringKey = ""
            kitronik_VIEW128x64.clear()
            descriptionRecognition()
        } else {
            stringKey = "" + stringKey + anKey
        }
        kitronik_VIEW128x64.show(stringKey, 4, kitronik_VIEW128x64.ShowAlign.Centre, kitronik_VIEW128x64.FontSelection.Big)
    }
})
