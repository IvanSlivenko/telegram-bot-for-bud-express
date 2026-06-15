const userStats = new Map()

const getUserStats = (userId) => {
    if (!userStats.has(userId)) {
        userStats.set(userId, {
            total: 0,
            correct: 0,
            wrong: 0,
            topics: {}
        })
    }
    return userStats.get(userId)
}

const recordAnswer = ({ userId, topic, isCorrect }) => {
    const stats = getUserStats(userId)

    stats.total++

    if (isCorrect) stats.correct++
    else stats.wrong++

    if (!stats.topics[topic]) {
        stats.topics[topic] = { total: 0, correct: 0 }
    }

    stats.topics[topic].total++
    if (isCorrect) stats.topics[topic].correct++
}

module.exports = {
    getUserStats,
    recordAnswer
}
