var mod=function(a,b) {
	r=a%b;
	if (r<0) r+=b;
	return r;
};
class DateMagic {
	constructor(date_or_year,month,day,hour,minute,second,millisecond,offset,julian,epoch){
		if(typeof date_or_year=='object'){
			this._year=date_or_year.getUTCFullYear();
			this._month=date_or_year.getUTCMonth()+1;
			this._day=date_or_year.getUTCDate();
			this._hour=date_or_year.getUTCHours();
			this._minute=date_or_year.getUTCMinutes();
			this._second=date_or_year.getUTCSeconds();
			this._millisecond=date_or_year.getUTCMilliseconds();
			this._offset=0;
			this._julian=julian || false;
			this._epoch=epoch || 'J2000.0';
		} else {
			this._year=date_or_year;
			this._month=month;
			this._day=day;
			this._hour=hour || null;
			this._minute=minute || null;
			this._second=second || null;
			this._millisecond=millisecond || null;
			this._offset=offset || 0;
			this._julian=julian || false;
			this._epoch=epoch || 'J2000.0';
		}
	}
	// getters
	get year() {
		return this._year;
	}
	get fullyear() {
		return this._year;
	}
	get month() {
		return this._month;
	}
	get day() {
		return this._day;
	}
	get date() {
		return this._day;
	}
	get hour() {
		return this._hour;
	}
	get hours() {
		return this._hour;
	}
	get minute() {
		return this._minute;
	}
	get minutes() {
		return this._minute;
	}
	get second() {
		return this._second;
	}
	get seconds() {
		return this._second;
	}
	get millisecond() {
		return this._millisecond;
	}
	get milliseconds() {
		return this._millisecond;
	}
	get julian() {
		return this._julian;
	}
	get epoch() {
		return this._epoch;
	}
	// setters
	set year(year) {
		if (Number.isInteger(year)) {
			this._year=year;
		}
	}
	set fullyear(year) {
		if (Number.isInteger(year)) {
			this._year=year;
		}
	}
	set month(month) {
		if (Number.isInteger(month)) {
			this._month=mod(month-1,12)+1;
			this._year+=Math.floor((month-1)/12);
		}
	}
	set day(day) {
		var monthlen=[31,28+this.leapYear(),31,30,31,30,31,31,30,31,30,31];
		if (Number.isInteger(day) && day>0) {
			while (day>monthlen[this._month-1]) {
				day-=monthlen[this._month-1];
				this.month+=1;
				if (this._month==1) {
					monthlen[1]=28+this.leapYear();
				}
			}
			this._day=day;
		} else if (Number.isInteger(day) && day<=0) {
			while (day<0) {
				day+=monthlen[mod(this._month-2,12)];
				this.month-=1;
				if (this._month==12) {
					monthlen[1]=28+this.leapYear();
				}
			}
			this._day=day;
		} else {
			this.day=Math.floor(day);
			this.hour+=24*mod(day,1);
		}
	}
	set date(day) {
		this.day=day;
	}
	set hour(hour) {
		if (Number.isInteger(hour)) {
			this.day+=Math.floor(hour/24);
			this._hour=mod(hour,24);
			this._minute=this._minute || 0;
			this._second=this._second || 0;
		} else {
			this.hour=Math.floor(hour);
			this.minute+=60*mod(hour,1);
		}
	}
	set minute(minute) {
		if (Number.isInteger(minute)) {
			this._hour=this._hour || 0;
			this.hour+=Math.floor(minute/60);
			this._minute=mod(minute,60);
			this._second=this._second || 0;
		} else {
			this.minute=Math.floor(minute);
			this.second=60*mod(minute,1);
		}
	}
	set second(second) {
		if (Number.isInteger(second)) {
			this._hour=this._hour || 0;
			this._minute=this._minute || 0;
			this.minute+=Math.floor(second/60);
			this._second=mod(second,60);
		} else {
			this.second=Math.floor(second);
			this.millisecond=1000*mod(second,1);
		}
	}
	set millisecond(millisecond) {
		this._hour=this._hour || 0;
		this._minute=this._minute || 0;
		this._second=this._second || 0;
		this.second+=Math.floor(millisecond/1000);
		this._millisecond=mod(millisecond,1);
	}
	set julian(julian) {
		this._julian=julian ? true : false;
	}
	set epoch(epoch) {
		r=/[BJ]\d+(?:\.\d+)?|JDN\s*\d+(?:\.\d+)/;
		this.epoch=r.exec(epoch)[0] || 'J2000';
	}
	//representation
	toISOString() { //goal is ISO8601 string
		var isostring;
		isostring = this._year+'-'+this._month+'-'+this._day;
		if(this._hour!==null && this._minute!==null) {
			isostring += 'T'+this._hour+':'+this._minute;
		}
		if(this._hour!==null && this._minute!==null && this._second!==null) {
			isostring += ':'+this._second;
		}
		if(this._hour!==null && this._minute!==null && this._second!==null && this._millisecond!==null) {
			isostring += '.'+this._millisecond;
		}
		if(this._hour!==null && this._minute!==null && this._offset===0) {
			isostring += 'Z';
		}
		return isostring;
	}
	toString() {
		return this.toISOString();
	}
	//methods
	clone() {
		return new DateMagic(
			this._year,
			this._month,
			this._day,
			this._hour,
			this._minute,
			this._second,
			this._millisecond,
			this._offset,
			this._julian,
			this.epoch);
	}
	leapYear() {
		var calcyear,ly;
		calcyear=Math.floor(this.year)+(this.year<0);
		if (this._julian) {
			ly = ((calcyear%4)===0);
		} else {
			ly = ((calcyear%4)===0 && ((calcyear%100)!==0 || (calcyear%400)===0));
		}
		return ly;
	}
	static isLeapYear(year,julian) {
		var calcyear,ly;
		julian=julian ? true : false;
		calcyear=Math.floor(this.year)+(this.year<0);
		if (julian) {
			ly = ((calcyear%4)===0);
		} else {
			ly = ((calcyear%4)===0 && ((calcyear%100)!==0 || (calcyear%400)===0));
		}
		return ly;
	}
	static computus(year, julian = false) {
		var a,b,c,k,p,q,M,N,d,e,day,time;
		time=[null,null,null,null,0];
		a=mod(year,19);
		b=mod(year,4);
		c=mod(year,7);
		if (!julian) {
			k=Math.floor(year/100);
			p=Math.floor((13+8*k)/25);
			q=Math.floor(k/4);
			M=mod(15-p+k-q,30);
			N=mod(4+k-q,7);
		} else {
			M=15;
			N=6;
		}
		d=mod(19*a+M,30);
		e=mod(2*b+4*c+6*d+N,7);
		if (d==29 && e==6) {
			return new DateMagic(year,4,19,...time,julian);
		}
		if (d==28 && e==6 && mod(11 * M + 11, 30) < 19) {
			return new DateMagic(year,4,18,...time,julian);
		}
		day=22+d+e;
		if (day<=31) {
			return new DateMagic(year,3,22+d+e,...time,julian);
		} else {
			return new DateMagic(year,4,d+e-9,...time,julian);
		}
	}
	toJulianDayNumber() {
		var jdn,a,y,m;
		a=Math.floor((14-this.month)/12);
		y=this.year+4800-a;
		m=this.month+12*a-3;
		jdn=this.day+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4);
		if (this._julian) { // if already a Julian calendar date
			jdn+=-32083.5;
		} else {
			jdn+=-Math.floor(y/100)+Math.floor(y/400)-32045.5;
		}
		// add in fractional parts of the day as necessary
		if (this.hour) {
			jdn+=this.hour/24;
		}
		if (this.minute) {
			jdn+=this.minute/1440;
		}
		if (this.second) {
			jdn+=this.second/86400;
		}
		if (this.millisecond) {
			jdn+=this.millisecond/86400000;
		}
		return jdn;
	}
	toGregorian() {
		if (this._julian) {
			return DateMagic.dateFromJulianDayNumber(this.toJulianDayNumber());
		} else {
			return this;
		}
	}
	toJulian() {
		if (this._julian) {
			return this;
		} else {
			return DateMagic.dateFromJulianDayNumber(this.toJulianDayNumber(),true);
		}
	}
	static dateFromJulianDayNumber(jdn,julian) {
		julian=julian || false;
		var y=4716,j=1401,m=2,n=12,r=4,p=1461,v=3,u=5,s=153,w=2,B=274277,C=-38;
		var time=mod(jdn,1);
		var e,g,h,D,M,Y,dm;
		if (julian) {
			f=jdn+j;
		} else {
			f=jdn+j+Math.floor((Math.floor((4*jdn+B)/146097)*3)/4)+C;
		}
		e=r*f+v;
		g=Math.floor(mod(e,p)/r);
		h=u*g+w;
		D=Math.floor(mod(h,s)/u)+1;
		M=mod(Math.floor(h/s)+m,n)+1;
		Y=Math.floor(e/p)-y+Math.floor((n+m-M)/n);
		dm=new DateMagic(Y,M,D);
		dm.hour+=time*24;
		return dm;
	}
	static getEpochFromJulianDayNumber(jdn,type) {
		var e;
		if (type=='B') {
			e=1900.0+(jdn-2415020.31352)/365.242198781;
		} else if (type=='J') {
			e=2000.0+(jdn-2451545.0)/365.25;
		}
		return e;
	}
	dayOfWeek() {
		//implements Zeller's congruence
		//ISO weekday: 1=Monday, 7=Sunday
		var h,q,m,Y,dow;
		q=this.day;
		m=this.month+12*(this.month<3);
		Y=this.year-(this.month<3);
		if (this._julian) {
			h=mod(q+Math.floor(13*(m+1)/5)+Y+Math.floor(Y/4)+5,7);
		} else {
			h=mod(q+Math.floor(13*(m+1)/5)+Y+Math.floor(Y/4)-Math.floor(Y/100)+Math.floor(Y/400),7);
		}
		return mod(h+5,7)+1;
	}
	nextWeekday(weekday,excludeThis) {
		var dow=this.dayOfWeek(),dm;
		dm=this.clone();
		excludeThis=excludeThis ? true : false;
		if (weekday!=dow) {
			dm.day+=mod(weekday-dow,7);
		} else if (excludeThis) {
			dm.day-=7;
		}
		return dm;
	}
	prevWeekday(weekday,excludeThis) {
		var dow=this.dayOfWeek(),dm;
		dm=this.clone();
		excludeThis=excludeThis ? true : false;
		if (weekday!=dow) {
			dm.day-=mod(dow-weekday,7);
		} else if (excludeThis) {
			dm.day-=7;
		}
		return dm;
	}
}
