import { useEffect, useRef, useState } from "react";
import "../styles/Visualizer.css"
import Dropdown from "./Dropdown"
import Switcher from "./Switcher"

function Visualizer () {
    const [algorithm, setAlgorithm] = useState("Bubble Sort")
    const [speed, setSpeed] = useState("1x")
    const [size, setSize] = useState(100)
    const [reverse, setReverse] = useState(false)

    const algorithms = ["Bubble Sort", "Quick Sort", "Merge Sort"]
    const speeds = [".5x", "1x", "2x", "4x"]

    const canv = useRef()
    const [startArray, setStartArray] = useState()

    const [statePlaying, setStatePlaying] = useState(false)
    const playing = useRef(false)
    const position = useRef(0)

    const increment = .00100

    useEffect(() => {
        setStartArray(randomArray(size))
    }, [size])

    useEffect(() => {
        if(startArray)
        {
            drawArrayToCanvas(canv, startArray)
            setReverse(false)
            position.current = 0
        }
    }, [startArray, algorithm])

    const play = async callback => {
        while(playing.current) {
            const inc = !reverse ? increment : -increment

            position.current += (inc * Number(speed.slice(0, speed.length - 1)))

            if(position.current >= 1 || position.current <= 0) {
                playing.current = false
                setStatePlaying(false)
            }

            if(position.current > 1) {
                position.current = 1
            } else if(position.current < 0) {
                position.current = 0
            }

            let [array, selected] = callback(startArray, position.current)

            drawArrayToCanvas(canv, array, position.current === 0 || position.current === 1 ? [] : selected)

            await new Promise(r => {setTimeout(r, 10)})
        }
    }

    return (
        <div className="visualizer">
            <div className={`controls ${statePlaying ? "playing" : ""}`}>
                <h1>Controls</h1>
                <div className="grouped">
                    <Dropdown disabled={statePlaying} options={algorithms} selected={algorithm} setter={setAlgorithm} extra="" />
                    <Dropdown disabled={statePlaying} options={speeds} selected={speed} setter={setSpeed} extra="Speed" />
                </div>
                <div className="grouped">
                    <div className="range_container">
                        <p>Array Size</p>
                        <input disabled={statePlaying} type="range" min={10} max={300} value={size} onChange={e => {setSize(e.target.value)}} />
                        <p>{size}</p>
                    </div>
                    <div className="direction_container">
                        <p>{`Rewind: ${reverse ? "Active" : "Inactive"}`}</p>
                        <Switcher disabled={statePlaying} on={reverse} setter={setReverse}/>
                    </div>
                </div>
                <div className="grouped">
                    <button onClick={() => {
                        setStatePlaying(!playing.current)
                        playing.current = !playing.current

                        if(algorithm === "Bubble Sort") {
                            play(bubbleSort)
                        } else if (algorithm === "Quick Sort") {
                            play(quickSort)
                        } else if (algorithm === "Merge Sort") {
                            play(mergeSort)
                        }
                        }}>{statePlaying ? "Pause" : "Play"}</button>
                </div>
            </div>
            <div className="array_container">
                <canvas ref={canv} id="canvas" width={1000} height={1000}/>
            </div>
        </div>
    );
}

function drawArrayToCanvas(canvRef, array, selected=[]) {
    const ctx = canvRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvRef.current.width, canvRef.current.height)
    const width = canvRef.current.width
    const lineWidth = width / array.length * .75
    const spacing = width / array.length * .25
    let x = spacing / 2

    let i = 0;
    for(const ele of array) {
        if(selected.includes(i)) {
            ctx.fillStyle = "#FF00FF"
        } else {
            ctx.fillStyle = "#000000"
        }
        ctx.fillRect(x, canvRef.current.height, lineWidth, -ele * 95)
        x += lineWidth + spacing
        i += 1
    }
}

function randomArray(size) {
    let arr = []
    for(let i = 0; i < size; i++) {
        arr.push(Math.random() * 10)
    }
    return arr
}

function mergeSort(arr, percent, getSteps=false) {
    if(percent === 0) {
        return [arr, []]
    }

    let array = [...arr]
    let l = 1

    let steps = 0

    let max = !getSteps ? mergeSort(array, 1, true) : null

    while(l < array.length) {
        for(let i = 0; i < array.length; i += (l * 2)) {
            let left = array.slice(i, i + l)
            let right = (i + (l * 2)) >= array.length ? array.slice(i + l) : array.slice(i + l, i + (l * 2))

            let merged = []
            while(left.length > 0 && right.length > 0) {
                merged.push(left[0] < right[0] ? left.shift() : right.shift())
            }
            merged = merged.concat(left.length > 0 ? left : right)

            let mi = 0
            for(let j = i; j < Math.min(array.length, i + (l * 2)); j++) {
                let tmp = array.indexOf(merged[mi])
                array[tmp] = array[j]
                array[j] = merged[mi]

                mi += 1

                steps += 1
                if(getSteps === false && steps >= max * percent) {
                    return [array, [j, tmp]]
                }
            }
        }
        l *= 2
    }

    return steps
}

function quickSort(arr, percent, getSteps=false) {
    if(percent === 0) {
        return [arr, []]
    }

    let array = [...arr]
    let stack = [[0, array.length - 1]]

    let steps = 0

    let max = !getSteps ? quickSort(array, 1, true) : null

    while(stack.length > 0) {
        const bounds = stack.pop()

        if(bounds[1] - bounds[0] === 0) {
            continue
        } else if (bounds[1] - bounds[0] === 1) {
            if(array[bounds[1]] < array[bounds[0]]) {
                const tmp = array[bounds[1]]
                array[bounds[1]] = array[bounds[0]]
                array[bounds[0]] = tmp

                steps += 1
                if(getSteps === false && steps >= max * percent) {
                    return [array, [bounds[0], bounds[1]]]
                }
            }
            continue
        }

        const pivotChoices = [array[bounds[0]], array[bounds[1]], array[bounds[0] + (Math.round((bounds[1] - bounds[0]) / 2))]]
        pivotChoices.splice(pivotChoices.indexOf(Math.min(...pivotChoices)), 1)
        pivotChoices.splice(pivotChoices.indexOf(Math.max(...pivotChoices)), 1)

        const pivot = pivotChoices[0]
        const pi = array.indexOf(pivot)
        array[pi] = array[bounds[1]]
        array[bounds[1]] = pivot

        steps += 1
        if(getSteps === false && steps >= max * percent) {
            return [array, [bounds[1], pi]]
        }

        let itemFromLeft;
        let itemFromRight;

        do {
            itemFromLeft = null
            itemFromRight = null

            for(let i = bounds[0]; i < bounds[1]; i++) {
                if(itemFromLeft === null && array[i] > pivot) {
                    itemFromLeft = i
                } else if(array[i] < pivot) {
                    itemFromRight = i
                }
            }

            let selected = [itemFromLeft]
            if(itemFromLeft < itemFromRight) {
                const tmp = array[itemFromLeft]
                array[itemFromLeft] = array[itemFromRight]
                array[itemFromRight] = tmp
                selected.push(itemFromRight)
            } else
            {
                array[bounds[1]] = array[itemFromLeft]
                array[itemFromLeft] = pivot
                selected.push(bounds[1])
            }

            steps += 1
            if(getSteps === false && steps >= max * percent) {
                return [array, selected]
            }
        } while (itemFromLeft < itemFromRight)

        const pivotIndex = array.indexOf(pivot)
        stack.push([bounds[0], pivotIndex - 1])
        stack.push([pivotIndex + 1, bounds[1]])
    }

    return steps
}

function bubbleSort(arr, percent, getSteps=false) {
    if(percent === 0) {
        return [arr, []]
    }

    let array = [...arr]
    let sorted = false;

    let steps = 0
    let max = !getSteps ? bubbleSort(arr, 1, true) : null

    let buffer = 0
    while(!sorted) {
        sorted = true
        for(let i = 0; i < array.length - buffer - 1; i++) {
            // checking
            steps += 1
            if(getSteps === false && max * percent <= steps) {
                return [array, [i, i + 1]]
            }

            if(array[i] > array[i + 1]) {
                sorted = false
                const tmp = array[i]
                array[i] = array[i + 1]
                array[i + 1] = tmp

                // switching
                steps += 1
                if(getSteps === false && max * percent <= steps) {
                    return [array, [i, i + 1]]
                }
            }
        }
        buffer += 1
    }

    return steps
}

export default Visualizer;