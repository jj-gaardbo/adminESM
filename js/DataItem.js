class DataItem{

    constructor(id, timestamp, data) {
        this.id = id;
        this.timestamp = new Date(timestamp);
        this.data = data;
        this.avgHR = this.calculateAvgHR();
        this.duration = this.data.duration;
        this.hrvAnalysis = new HRVAnalysis(this.data.rr);
        this.timeDuration = this.timeDiff(this.data.start, this.data.end);
        this.unixTimeDiff = this.getUnixTimeDiff(this.data.start, this.data.end);
    }

    getTimeDuration(){
        return this.timeDuration;
    }

    getUnixTimeDiff(tstart, tend){
        return tend-tstart;
    }

    timeDiff( tstart, tend ) {
        let diff = Math.floor((tend - tstart) / 1000), units = [
            { d: 60, l: "seconds" },
            { d: 60, l: "minutes" },
            { d: 24, l: "hours" },
            { d: 7, l: "days" }
        ];

        let s = '';
        for (let i = 0; i < units.length; ++i) {
            let el = diff % units[i].d;
            if (el.toString().length < 2) el = '0' + el;
            s = (el) + ":" + s;
            diff = Math.floor(diff / units[i].d);
        }
        return s.slice(0, -1);
    }

    getHRVAnalysis(){
        return this.hrvAnalysis;
    }

    getDuration(){
        return this.duration;
    }

    getAvgHR(){
        return this.avgHR;
    }

    calculateAvgHR(){
        let avgHR = 0;
        let hr = this.data.hr;
        for (let i = 0; i < hr.length; i++){
            avgHR += hr[i];
        }
        let num = avgHR / hr.length;
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    getItem(index){
        return this.data.self[index];
    }

    formatDate() {
        let d = this.timestamp,
            minute = '' + (d.getMinutes()),
            hour = '' + (d.getHours()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (minute.length < 2) minute = '0' + minute;

        let clockString = hour+":"+minute;
        let dateString = day+"/"+month+"-"+year;
        return [dateString,clockString].join('-');
    }

    getTimeString(){
        return this.formatDate();
    }

}