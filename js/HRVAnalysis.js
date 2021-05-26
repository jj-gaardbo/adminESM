class HRVAnalysis {
    constructor(rrList) {
        this.config = {
            rrTimeFormat: 'ms',
            rmssdFactor: 20,
            sample: true // false (if population)
        }
        this.rrList = rrList;
    }

    // returns root mean square of successive rr interval differences
    rmssd() {
        let factor = 1
        if (this.config.rrTimeFormat === 's') factor = 1000
        let rmssdTotal = 0
        this.rrList.map((interval, index) => {
            if (index !== this.rrList.length - 1) rmssdTotal += Math.abs(interval * factor - this.rrList[index + 1] * factor)
        })
        let rmssd = Math.sqrt(rmssdTotal/this.rrList.length)

        return rmssd * this.config.rmssdFactor
    }

    // returns percentage of successive intervals that differ more than 50ms
    pnn50() {
        let factor = 1
        if (this.config.rrTimeFormat === 's') factor = 1000
        let nnLargerThan50 = 0
        this.rrList.map((interval, index) => {
            if (index !== this.rrList.length - 1 && Math.abs(interval - this.rrList[index + 1]) > 50 * (1/factor)) nnLargerThan50++
        })
        return nnLargerThan50 / this.rrList.length * 100
    }

    // returns standard deviation of rr intervals
    sdnn() {
        let rrTotal = 0
        this.rrList.map((interval, index) => {
            rrTotal += interval
        })
        const meanRR = rrTotal / this.rrList.length
        let sdnnTotal = 0
        this.rrList.map((interval, index) => {
            sdnnTotal += Math.pow(interval - meanRR, 2)
        })
        let n = this.config.sample ? (this.rrList.length-1) : (this.rrList.length)
        return Math.sqrt(sdnnTotal / n)
    }

    sdrr() {
        let arrayAverage = (arr, len) => arr.reduce((sum, x) => x + sum, 0) / len;

        //Calculate the mean RR
        let averageRR = arrayAverage(this.rrList, this.rrList.length);

        //Calculate the squared differences from the mean
        let squaredDifferences = this.rrList.map(x => x - averageRR).map(x => x * x);

        let n = this.config.sample ? (this.rrList.length-1) : (this.rrList.length)

        // Calculate the variance (Mean of all the squared differences)
        let variance = arrayAverage(squaredDifferences, n);

        // Return the square root of the variance / standard deviation
        return Math.sqrt(variance);
    }

}