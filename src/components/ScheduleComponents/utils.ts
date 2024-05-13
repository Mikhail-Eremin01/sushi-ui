export function getCalendarCellColor(value: number): "red" | "green" | "yellow" {
    switch (true) {
        case value >= 5:
            return "green";
        case value <= 0:
            return "red";
        default:
            return "yellow";
    }
}