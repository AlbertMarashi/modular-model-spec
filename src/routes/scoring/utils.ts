export function score_color(score: number) {
    const abs_score = Math.abs(score) * 1

    return score < 0
        ? `rgba(var(--red-rgb),${abs_score})`
        : `rgba(var(--green-rgb),${abs_score})`
}
