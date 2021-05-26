class DataHandler {

    constructor(data){
        this.data = data;
        this.totalAvgHR = null;
        this.totalAvgSDNN = null;
        this.totalAvgRMSSD = null;
        this.totalAvgPNN50 = null;
        this.totalAvgDuration = this.getTotalAvgDuration();
    }

    calculateAvgSDNN(){
        let sdnn = 0;
        for(let i = 0; i < this.data.length; i++){
            sdnn += this.data[i].hrvAnalysis.sdnn();
        }
        return sdnn / this.data.length;
    }

    calculateAvgSDRR(){
        let sdrr = 0;
        for(let i = 0; i < this.data.length; i++){
            sdrr += this.data[i].hrvAnalysis.sdrr();
        }
        return sdrr / this.data.length;
    }

    calculateAvgRMSSD(){
        let rmssd = 0;
        for(let i = 0; i < this.data.length; i++){
            rmssd += this.data[i].hrvAnalysis.rmssd();
        }
        return rmssd / this.data.length;
    }

    calculateAvgPNN50(){
        let pnn50 = 0;
        for(let i = 0; i < this.data.length; i++){
            pnn50 += this.data[i].hrvAnalysis.pnn50();
        }
        return pnn50 / this.data.length;
    }

    msToTime(duration) {
        let milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    getTotalAvgDuration(){
        let timediff = 0;
        for(let i = 0; i < this.data.length; i++){
            timediff += this.data[i].unixTimeDiff;
        }
        return this.msToTime(timediff/this.data.length);
    }

    getTotalAvgHR(){
        return this.totalAvgHR;
    }

    getTotalAvgSDNN(){
        return this.totalAvgSDNN;
    }

    getTotalAvgRMSSD(){
        return this.totalAvgRMSSD;
    }

    getTotalAvgPNN50(){
        return this.totalAvgPNN50;
    }

    getHRVAnalysis(){
        let hrvItems = [];
        for (let i = 0; i < this.data.length; i++){
            hrvItems[i] = this.data[i].getHRVAnalysis();
        }
        return hrvItems;
    }

    getDurations(){
        let durations = [];
        for (let i = 0; i < this.data.length; i++){
            durations[i] = this.data[i].getDuration();
        }
        return durations;
    }

    getAvgHR(){
        let totAvg = 0;
        let avgHR = [];
        for (let i = 0; i < this.data.length; i++){
            let itemAvg = this.data[i].getAvgHR();
            totAvg += itemAvg;
            avgHR[i] = this.data[i].getAvgHR();
        }
        this.totalAvgHR = Math.round(((totAvg/avgHR.length) + Number.EPSILON) * 100) / 100;
        return avgHR;
    }

    getDataMean(responseIndex, listItemIndex){
        let mean = 0;
        for (let i = 0; i < this.data.length; i++){
            let entry = this.data[i].data.self[listItemIndex];
            mean += entry.value;
        }
        return mean / this.data.length;
    }

    getDataItemArray(responseIndex, listItemIndex){
        if(typeof this.data[responseIndex] == "undefined") return null;
        let temp = [];
        for (let i = 0; i < this.data.length; i++){
            let entry = this.data[i].data.self[listItemIndex];
            temp[i] = entry.value;
        }
        return temp;
    }

    getTimestamp(index){
        return this.data[index].getTimeString();
    }

    getTimestringArray(index){
        let temp = [];

        for (let i = 0; i < this.data.length; i++){
            temp[i] = this.getTimestamp(i);
        }

        return temp;
    }

}