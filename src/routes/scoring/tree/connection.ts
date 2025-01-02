export type ConnectionPoint = {
    id: string,
    side: Side
}

export type Side = "top" | "bottom" | "left" | "right"

export type Connection = {
    from: ConnectionPoint,
    to: ConnectionPoint,
}


export function getNodePosition(point: ConnectionPoint, svg?: SVGElement): { x: number, y: number } {
    const element = document.getElementById(point.id)
    if (!element) {
        return { x: 0, y: 0 }
    }

    let { left, top, right, bottom, width, height } = element.getBoundingClientRect()

    if (svg) {
        const svgRect = svg.getBoundingClientRect()

        left -= svgRect.left
        top -= svgRect.top
        right -= svgRect.left
        bottom -= svgRect.top
        width = right - left
        height = bottom - top
    }
    
    const x = left + width / 2
    const y = top + height / 2
    

    // Adjust position based on which side the connection is on
    switch (point.side) {
        case "left":
            return { x: left, y }
        case "right": 
            return { x: right, y }
        case "top":
            return { x, y: top }
        case "bottom":
            return { x, y: bottom }
    }
}

export function svg_connection(connection: Connection, svg?: SVGElement): string {
    const start = getNodePosition(connection.from, svg)
    const end = getNodePosition(connection.to, svg)

    // Determine if we're dealing with horizontal or vertical connections
    const isStartHorizontal = connection.from.side === "left" || connection.from.side === "right"
    const isEndHorizontal = connection.to.side === "left" || connection.to.side === "right"

    let path: string

    if (isStartHorizontal && isEndHorizontal) {
        // Horizontal to horizontal - use existing midpoint logic
        const midX = (start.x + end.x) / 2
        path = [
            `M ${start.x},${start.y}`,
            `L ${midX},${start.y}`,
            `L ${midX},${end.y}`,
            `L ${end.x},${end.y}`
        ].join(" ")
    }
    else if (!isStartHorizontal && !isEndHorizontal) {
        // Vertical to vertical - similar to horizontal but with midY
        const midY = (start.y + end.y) / 2
        path = [
            `M ${start.x},${start.y}`,
            `L ${start.x},${midY}`,
            `L ${end.x},${midY}`,
            `L ${end.x},${end.y}`
        ].join(" ")
    }
    else {
        // Vertical to horizontal or horizontal to vertical - use L shape
        if (isStartHorizontal) {
            // From horizontal to vertical
            path = [
                `M ${start.x},${start.y}`,
                `L ${end.x},${start.y}`,
                `L ${end.x},${end.y}`
            ].join(" ")
        } else {
            // From vertical to horizontal
            path = [
                `M ${start.x},${start.y}`,
                `L ${start.x},${end.y}`,
                `L ${end.x},${end.y}`
            ].join(" ")
        }
    }

    return roundPathCorners(path, 16, false)
}

type Point = {
    x: number
    y: number
}

type Command = (string|number)[] & Partial<{ origPoint: Point }>

export function roundPathCorners(pathString: string, radius: number, useFractionalRadius: boolean) {
    function moveTowardsLength(movingPoint: Point, targetPoint: Point , amount: number) {
        const width = (targetPoint.x - movingPoint.x)
        const height = (targetPoint.y - movingPoint.y)

        const distance = Math.sqrt(width * width + height * height)

        return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance))
    }
    function moveTowardsFractional(movingPoint: Point, targetPoint: Point, fraction: number) {
        return {
            x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
            y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
        }
    }

    // Adjusts the ending position of a command
    function adjustCommand(cmd: Command, newPoint: Point) {
        if (cmd.length > 2) {
            cmd[cmd.length - 2] = newPoint.x
            cmd[cmd.length - 1] = newPoint.y
        }
    }

    // Gives an {x, y} object for a command's ending position
    function pointForCommand(cmd: Command): Point {
        return {
            x: parseFloat(cmd[cmd.length - 2] as string),
            y: parseFloat(cmd[cmd.length - 1] as string),
        }
    }

    // Split apart the path, handing concatonated letters and numbers
    const pathParts: string[] = pathString
        .split(/[,\s]/)
        .reduce(function (parts, part) {
            const match = part.match("([a-zA-Z])(.+)")
            if (match) {
                parts.push(match[1])
                parts.push(match[2])
            } else {
                parts.push(part)
            }

            return parts
        }, [] as string[])

    // Group the commands with their arguments for easier handling
    const commands = pathParts.reduce(function (commands, part) {
        // if (parseFloat(part) == part && commands.length) {
        if (!isNaN(parseFloat(part)) && commands.length) {
            commands[commands.length - 1].push(part)
        } else {
            commands.push([part])
        }

        return commands
    }, [] as Command[])

    // The resulting commands, also grouped
    let resultCommands = []

    if (commands.length > 1) {
        const startPoint = pointForCommand(commands[0])

        // Handle the close path case with a "virtual" closing line
        let virtualCloseLine = null
        if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
            virtualCloseLine = ["L", startPoint.x, startPoint.y]
            commands[commands.length - 1] = virtualCloseLine
        }

        // We always use the first command (but it may be mutated)
        resultCommands.push(commands[0])

        for (let cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
            const prevCmd = resultCommands[resultCommands.length - 1]

            const curCmd = commands[cmdIndex]

            // Handle closing case
            const nextCmd = (curCmd == virtualCloseLine)
                ? commands[1]
                : commands[cmdIndex + 1]

            // Nasty logic to decide if this path is a candidite.
            if (nextCmd && prevCmd && (prevCmd.length > 2) && curCmd[0] == "L" && nextCmd.length > 2 && nextCmd[0] == "L") {
                // Calc the points we're dealing with
                const prevPoint = pointForCommand(prevCmd)
                const curPoint = pointForCommand(curCmd)
                const nextPoint = pointForCommand(nextCmd)

                // The start and end of the cuve are just our point moved
                // towards the previous and next points, respectivly
                let curveStart, curveEnd

                if (useFractionalRadius) {
                    curveStart = moveTowardsFractional(curPoint, prevCmd.origPoint || prevPoint, radius)
                    curveEnd = moveTowardsFractional(curPoint, nextCmd.origPoint || nextPoint, radius)
                } else {
                    curveStart = moveTowardsLength(curPoint, prevPoint, radius)
                    curveEnd = moveTowardsLength(curPoint, nextPoint, radius)
                }

                // Adjust the current command and add it
                adjustCommand(curCmd, curveStart)
                curCmd.origPoint = curPoint
                resultCommands.push(curCmd)

                // The curve control points are halfway between the start/end of the curve and
                // the original point
                const startControl = moveTowardsFractional(curveStart, curPoint, .5)
                const endControl = moveTowardsFractional(curPoint, curveEnd, .5)

                // Create the curve
                const curveCmd = ["C", startControl.x, startControl.y, endControl.x, endControl.y, curveEnd.x, curveEnd.y] as Command
                // Save the original point for fractional calculations
                curveCmd.origPoint = curPoint
                resultCommands.push(curveCmd)
            } else {
                // Pass through commands that don't qualify
                resultCommands.push(curCmd)
            }
        }

        // Fix up the starting point and restore the close path if the path was orignally closed
        if (virtualCloseLine) {
            const newStartPoint = pointForCommand(resultCommands[resultCommands.length - 1])
            resultCommands.push(["Z"])
            adjustCommand(resultCommands[0], newStartPoint)
        }
    } else {
        resultCommands = commands
    }

    return resultCommands.reduce(function (str, c) { return str + c.join(" ") + " " }, "")
}
