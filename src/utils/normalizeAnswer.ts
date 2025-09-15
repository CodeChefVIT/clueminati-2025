export function normalizeAnswer(answer :String){
    return answer.trim().replace(/\s+/g, " ").toLowerCase()
}