export function score_color(score: number) {
    return score < 0
        ? `rgba(var(--red-rgb), ${Math.abs(score) * 0.75})`
        : `rgba(var(--green-rgb), ${Math.abs(score) * 0.75})`
}
