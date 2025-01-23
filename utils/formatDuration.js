function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const dayStr = days > 0 ? `${days} วัน ` : '';
    const hourStr = hours > 0 ? `${hours} ชั่วโมง ` : '';
    const minuteStr = minutes > 0 ? `${minutes} นาที ` : '';
    const secondStr = `${seconds} วินาที`;

    return `${dayStr}${hourStr}${minuteStr}${secondStr}`;
}

module.exports = formatDuration;
