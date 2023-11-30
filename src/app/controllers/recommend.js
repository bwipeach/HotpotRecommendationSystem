class Recommend {
    
    computeSimilarity(s1, s2) {
        // Tách các từ trong chuỗi s1 và s2
        const words1 = s1.split(' ');
        const words2 = s2.split(' ');

        // Tạo một tập hợp chứa các từ có thể có nhất trong hai chuỗi
        const uniqueWords = Array.from(new Set([...words1, ...words2]));

        // Tạo vector tần suất từ cho hai chuỗi
        const freqVector1 = {};
        for (const word of words1) {
            freqVector1[word] = (freqVector1[word] || 0) + 1;
        }

        const freqVector2 = {};
        for (const word of words2) {
            freqVector2[word] = (freqVector2[word] || 0) + 1;
        }

        // Tính toán độ tương đồng dựa trên Cosine Similarity
        let dotProduct = 0.0;
        let magnitude1 = 0.0;
        let magnitude2 = 0.0;

        for (const word of uniqueWords) {
            const freq1 = freqVector1[word] || 0;
            const freq2 = freqVector2[word] || 0;

            dotProduct += freq1 * freq2;
            magnitude1 += Math.pow(freq1, 2);
            magnitude2 += Math.pow(freq2, 2);
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        const similarity = dotProduct / (magnitude1 * magnitude2);

        return similarity;
    }
}
module.exports = new Recommend();
