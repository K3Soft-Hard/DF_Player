//% color=#5C2D91 icon="\uf205"
//%advanced=true weight=100 
namespace K3LedControl {
    export enum ScreenMode {
        ledOn = 0,
        ledOff = 1,
        chessboard = 2,
        invertedChessboard = 3
    }
    export enum Direction {
        horizontal = 0,
        vertical = 1
    }
    //%blockId="LCplotLedValue"
    //%block="plot led %ledNum value %value"
    //%group=Graphs
    //%ledNum.min=0 ledNum.max=4 value.min=0 value.max=5
    export function plotLedGraph(ledNum: number, value: number) {
        for (let i = 0; i < 5; i++) {
            if (i < value) {
                led.plot(ledNum, 4 - i)
            } else {
                led.unplot(ledNum, 4 - i)
            }
        }
    }
    //%blockId="LCsetPinLed"
    //%block="set %setpin to led x:%ledx y:%ledy"
    //%advanced=true
    //%group=Hardware
    //%ledx.min=0 ledx.max=4 ledy.min=0 ledy.max=4
    export function setPinLed(setpin: DigitalPin, ledx: number, ledy: number) {
        let pinboolean = 0
        if (led.point(ledx, ledy)) {
            pinboolean = 1
        } else {
            pinboolean = 0
        }
        pins.digitalWritePin(setpin, pinboolean)
    }
    //%blockId="LCtoggleRandomLed"
    //%block="toggle random led ||pause $time serial $write"
    //%group=Leds
    export function toggleRandomLed(time: number = 0, write: boolean = false) {
        time = time * 1000
        let x = randint(0, 4)
        let y = randint(0, 4)
        led.toggle(x, y)
        if (write) {
            serial.writeValue("x", x)
            serial.writeValue("y", y)
        }
        basic.pause(time)
    }
    //%blockId="LCreadLedGraph"
    //%block="read led graph on $ledNum"
    //%group="Graphs"
    //%ledNum.min=0 ledNum.max=4
    export function readLedGraph(ledNum: number) {
        let value = 0
        for (let _index = 0; _index <= 4; _index++) {
            if (led.point(ledNum, _index)) {
                value += 1
            }
        }
        return value
    }
    //%blockId="LClinearPlot"
    //%block="linear plot on $ledNum|| $direction "
    //%group="Leds"
    //%ledNum.min=0 ledNum.max=24
    export function linearPlot(ledNum: number, direction: Direction = Direction.horizontal) {
        let x, y
        switch (direction) {
            case Direction.horizontal:
                x = Math.floor(ledNum % 5)
                y = Math.floor(ledNum / 5)

                break
            case Direction.vertical:
                x = Math.floor(ledNum / 5)
                y = Math.floor(ledNum % 5)
                break
        }
        led.plot(x, y)

    }
    //%blockId="LCclearColumn"
    //%block="clear column $colNum"
    //%group="Leds"
    //%colNum.min=0 colNum.max=4 
    export function clearColumn(colNum: number) {
        for (let i = 0; i < 5; i++) {
            led.unplot(colNum, i)
        }
    }
    //%blockId="LCfillScreen"
    //%block="fill screen $screen"
    //%group="Leds"
    //%colNum.min=0 colNum.max=4 
    export function fillScreen(screen: ScreenMode) {
        switch (screen) {
            case ScreenMode.ledOn:
                basic.showLeds(`
                    # # # # #
                    # # # # #
                    # # # # #
                    # # # # #
                    # # # # #
                `)
                break
            case ScreenMode.ledOff:
                basic.clearScreen()
                break
            case ScreenMode.chessboard:
                basic.showLeds(`
                    # . # . #
                    . # . # .
                    # . # . #
                    . # . # .
                    # . # . #
                `)
                break
            case ScreenMode.invertedChessboard:
                basic.showLeds(`
                    . # . # .
                    # . # . #
                    . # . # .
                    # . # . #
                    . # . # .
                `)
                break
        }
    }
    //%blockId="LCshowText"
    //%block="show text $text"
    //%group="Show"
    //%colNum.min=0 colNum.max=4 
    export function showText(text: string) {
        for (let _index = 0; _index <= text.length; _index++) {
            basic.showString(text.charAt(_index))
        }
    }
    //%blockId="LCrepeatTextAndShow"
    //%block="repeat $text and show "
    //%group="Show"
    //%colNum.min=0 colNum.max=4 
    export function repeatTextAndShow(text: string) {
        for (let _index = 0; _index <= text.length; _index++) {
            basic.showString(text.substr(0, _index))
        }
    }
    //%blockId="LCplotRectangle"
    //%block="plot rectangle from x$ledx y$ledy to x$ledx2 y$ledy2"
    //%group="Plot"
    //%ledx.min=0 ledx.max=4 ledy.min=0 ledy.max=4 ledx2.min=0 ledx2.max=4 ledy2.min=0 ledy2.max=4 
    export function plotRectangle(ledx: number, ledy: number, ledx2: number, ledy2: number) {
        let x2 = ledx2 - 1
        let y2 = ledy2 - 1
        for (let index = 0; index <= x2; index++) {
            for (let index2 = 0; index2 <= y2; index2++) {
                led.plot(ledx + index, ledy + index2)
            }
        }
    }
    //%block="LCscrollText"
    //%block="scroll text $text|| interval $interval"
    //%group="Show"
    //%interval.min=50 interval.max=500
    export function scrollText(text: string, interval: number = 100) {
        basic.showString(text, interval)
    }
}