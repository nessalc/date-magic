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
	get offset() {
		return this._offset;
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
		var monthlen=[31,28+this.leapYear,31,30,31,30,31,31,30,31,30,31];
		if (Number.isInteger(day) && day>0) {
			while (day>monthlen[this._month-1]) {
				day-=monthlen[this._month-1];
				this.month+=1;
				if (this._month==1) {
					monthlen[1]=28+this.leapYear;
				}
			}
			this._day=day;
		} else if (Number.isInteger(day) && day<=0) {
			while (day<0) {
				day+=monthlen[mod(this._month-2,12)];
				this.month-=1;
				if (this._month==12) {
					monthlen[1]=28+this.leapYear;
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
	set hours(hours) {
		this.hour=hours;
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
	set minutes(minutes) {
		this.minute=minutes;
	}
	set offset(minutes) {
		this._offset=minutes;
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
	set seconds(seconds) {
		this.second=seconds;
	}
	set millisecond(millisecond) {
		this._hour=this._hour || 0;
		this._minute=this._minute || 0;
		this._second=this._second || 0;
		this.second+=Math.floor(millisecond/1000);
		this._millisecond=mod(millisecond,1);
	}
	set milliseconds(milliseconds) {
		this.millisecond=milliseconds;
	}
	set julian(julian) {
		this._julian=julian ? true : false;
	}
	set epoch(epoch) {
		r=/[BJ]\d+(?:\.\d+)?|JDN\s*\d+(?:\.\d+)/;
		this._epoch=r.exec(epoch)[0] || 'J2000';
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
	toNiceString() { //this one is mostly for me
		var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var nicestring;
		nicestring=dow[this.dayOfWeek%7]+' '+this.day+' '+months[this.month-1]+' '+this.year;
		return nicestring;
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
			this._epoch);
	}
	get leapYear() {
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
		var a,b,c,k,p,q,M,N,d,e,day,time,D;
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
		D=new DateMagic(year,3,22,...time,julian);
		D.day+=(d+e);
		return D;
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
			return this.clone();
		}
	}
	toJulian() {
		if (this._julian) {
			return this.clone();
		} else {
			return DateMagic.dateFromJulianDayNumber(this.toJulianDayNumber(),true);
		}
	}
	static getCurrent() {
		return new DateMagic(new Date());
	}
	static dateFromJulianDayNumber(jdn,julian) {
		var a,b,c,d,e,f,g,h,i,j,Y,M,D;
		a=Math.floor(jdn-1721425.5); //1721425.5 is Julian Day Number of 0000-01-01
		b=Math.floor(a/146097);
		c=mod(a,146097);
		d=Math.floor(c/36524);
		e=mod(c,36524);
		f=Math.floor(e/1461);
		g=mod(e,1461);
		h=Math.floor(g/365);
		Y=b*400+d*100+f*4+h;
		if(!((d==4)||(h==4))) Y++;
		i=new DateMagic(Y,1,1);
		j=i.toJulianDayNumber();
		i.day+=(Math.floor(jdn-0.5)+0.5-j);
		return i;
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
	get dayOfWeek() {
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
		var dow=this.dayOfWeek,dm;
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
		var dow=this.dayOfWeek,dm;
		dm=this.clone();
		excludeThis=excludeThis ? true : false;
		if (weekday!=dow) {
			dm.day-=mod(dow-weekday,7);
		} else if (excludeThis) {
			dm.day-=7;
		}
		return dm;
	}
	moonAge(referenceDate) { //decent baseline, want to implement ELP 2000-82 if possible
		var refJDN;
		var synodic_month_length=29.530588853;
		referenceDate=referenceDate || new DateMagic(2017,1,28,0,7);
		refJDN=referenceDate.toJulianDayNumber();
		return mod(this.toJulianDayNumber()-refJDN,synodic_month_length);
	}
	moonPhase(referenceDate) {
		var ma=this.moonAge(referenceDate),phase;
		var synodic_month_length=29.530588853;
		phase=ma/synodic_month_length*2;
		return phase;
	}
	moonPhaseName(referenceDate) {
		var ma=this.moonAge(referenceDate),phase;
		var synodic_month_length=29.530588853;
		if (ma>synodic_month_length-1.5 || ma<=1.5) {
			phase='new';
		} else if (ma>1.5 && ma<=synodic_month_length/4-1.5) {
			phase='waxing crecent';
		} else if (ma>synodic_month_length/4-1.5 && ma<=synodic_month_length/4+1.5) {
			phase='first quarter';
		} else if (ma>synodic_month_length/4+1.5 && ma<=synodic_month_length/2-1.5) {
			phase='waxing gibbous';
		} else if (ma>synodic_month_length/2-1.5 && ma<=synodic_month_length/2+1.5) {
			phase='full';
		} else if (ma>synodic_month_length/2+1.5 && ma<=3*synodic_month_length/2-1.5) {
			phase='waning gibbous';
		} else if (ma>3*synodic_month_length/4-1.5 && ma<=3*synodic_month_length/4+1.5) {
			phase='last quarter';
		} else if (ma>3*synodic_month_length/4+1.5 && ma<=3*synodic_month_length/4-1.5) {
			phase='waning crecent';
		}
		return phase;
	}
	moonPhaseAngle(referenceDate) {
		var ma=this.moonAge(referenceDate),phase;
		var synodic_month_length=29.530588853;
		return ma/synodic_month_length*360-180;
	}
	nextMolad(referenceDate) {
		var synodic_month_length=29.530594135802469135802469135802;
		referenceDate=referenceDate || new DateMagic(2017,1,28,0,7);
		var refJDN=referenceDate.toJulianDayNumber();
		var temp=this.clone();
		return temp.add(synodic_month_length-mod(this.toJulianDayNumber()-refJDN,synodic_month_length));
	}
	prevMolad(referenceDate) {
		var synodic_month_length=29.530594135802469135802469135802;
		referenceDate=referenceDate || new DateMagic(2017,1,28,0,7);
		var refJDN=referenceDate.toJulianDayNumber();
		var temp=this.clone();
		return temp.subtract(mod(this.toJulianDayNumber()-refJDN,synodic_month_length));
	}
	clearTime() {
		this._hour=null;
		this._minute=null;
		this._second=null;
		this._millisecond=null;
		return this;
	}
	static nthWeekdayOfMonth(year,month,n,weekday) {
		var temp=new DateMagic(year,month,1);
		if(n===0) n=1;
		if(n>0) {
			temp=temp.nextWeekday(weekday);
			temp.day+=(7*(n-1));
		} else if(n<0) {
			temp.month+=1;
			temp=temp.prevWeekday(weekday,true);
			temp.day+=(7*(n+1));
		}
		return temp;
	}
	nthWeekday(n,weekday) {
		temp=this.clone();
		if(n===0) n=1;
		if(n>0) {
			temp=temp.nextWeekday(weekday);
			temp.day+=(7*(n-1));
		} else if(n<0) {
			temp.month+=1;
			temp=temp.prevWeekday(weekday,true);
			temp.day+=(7*(n+1));
		}
		return temp;
	}
	ISOdayNumber() {
		var firstDay=DateMagic.nthWeekdayOfMonth(this.year,1,1,4).prevWeekday(1);
		return Math.floor(this.toJulianDayNumber()-firstDay.toJulianDayNumber()+1);
	}
	dayNumber() {
		return Math.floor(this.toJulianDayNumber()-(new DateMagic(this.year,1,1)).toJulianDayNumber()+1);
	}
	ISOweekNumber() { //iso week number, first week contains first Thursday
		var cleartime=[null,null,null,null,null,this.julian];
		var firstDay=DateMagic.nthWeekdayOfMonth(this.year,1,1,4).prevWeekday(1);
		var days=this.toJulianDayNumber()-firstDay.toJulianDayNumber()+1;
		var week=Math.sign(days)*Math.abs(Math.ceil(days/7));
		if(week===0) {
			return (new DateMagic(this.year-1,12,31,...cleartime)).weekNumber();
		} else if(week==53) {
			var lastweek=(new DateMagic(this.year,12,31,...cleartime)).weekNumber();
		}
		return week;
	}
	daysInMonth() {
		var monthlen=[31,28+this.leapYear,31,30,31,30,31,31,30,31,30,31];
		return monthlen[this.month-1];
	}
	add(date) {
		if(typeof(date)=='object' && date!==null) {
			this.millisecond+=date.millisecond;
			this.second+=date.second;
			this.minute+=date.minute;
			this.hour+=date.hour;
			this.day+=date.day;
			this.month+=date.month;
			this.year+=date.year;
		} else if(typeof(date)=='number' && !isNaN(date) && date != Infinity) {
			this.day+=date;
		} else {
			throw DMException(-1,"Incorrect object passed to function. Expected DateMagic or Number.");
		}
		return this;
	}
	subtract(date) {
		if(typeof(date)=='object' && date!==null) {
			this.year-=date.year;
			this.month-=date.month;
			this.day-=date.day;
			this.hour-=date.hour;
			this.minute-=date.minute;
			this.second-=date.second;
			this.millisecond-=date.millisecond;
		} else if(typeof(date)=='number' && !isNaN(date) && date != Infinity) {
			this.day-=date;
		} else {
			throw DMException(-1,"Incorrect object passed to function. Expected DateMagic or Number.");
		}
		return this;
	}
	compare(date) {
		var a,b;
		if (typeof(date)=='object' && date!==null) {
			a=this.toJulianDayNumber();
			b=date.toJulianDayNumber();
			if (a<b) {
				return 1;
			} else if (a==b) {
				return 0;
			} else {
				return -1;
			}
		} else {
			throw DMException(-1,"Incorrect object passed to function. Expected DateMagic.");
		}
	}
	isBetween(date1,date2) {
		var a,b,c;
		if (typeof(date1)=='object' && date1!==null && typeof(date2)=='object' && date2!==null) {
			a=date1.toJulianDayNumber();
			b=this.toJulianDayNumber();
			c=date2.toJulianDayNumber();
			if (a<=b && b<=c) {
				return true;
			} else {
				return false;
			}
		} else {
			throw DMException(-1,"Incorrect object(s) passed to function. Expected DateMagic.");
		}
	}
	toLocal() {
		var temp=this.clone();
		temp.minute+=this._offset;
		return temp;
	}
	static hebrewLeapYear(year) {
		return mod(((year*7)+1),19)<7;
	}
	/*
	static hebrewMonthLengths(year) {
		var monthlen=[30,29,30,29,30,29,30,29,30,29,30,29];
		if (hebrewLeapYear(year)) {
			monthlen[11]=30;
			monthlen[12]=29;
		}
		var months,days,parts,last,present,next;
		//delay1
		months=Math.floor(((235*year)-234)/19);
		parts=12084+(13753*months);
		day=(months*29)+Math.floor(parts/25920);
		if (mod((3*(day+1)),7)<3) day++;
		return day;
		//delay2
		last=delay1(year-1);
		present=delay1(year);
		next=delay1(year+1);
		if ((next-present)==356) {
			return 2;
		} else if ((present-last)==382) {
			return 1;
		} else {
			return 0;
		}
	}
	*/
	/*
	static hebrewToJulianDayNumber(year,month,day) {
		var monthlen=return hebrewMonthLengths();
		var jd,mon,months;
		months=hebrewLeapYear?13:12;
		jd=347995.5+hebrew_delay_1(year)+hebrew_delay2(year)+day+1;
		if (month<7) {
			for(mon=7;mon<=months;mon++) {
				jd+=hebrew_month_days(year,mon);
			}
			for(mon=1;mon<month;mon++) {
				jd+=hebrew_month_days(year,mon);
			}
		} else {
			for(mon=7;mon<month;mon++) {
				jd+=hebrew_month_days(year,mon);
			}
		}
		return jd;
	}
	*/
	//sunrise
	//sunset
	//solar noon
	//moonrise
	//moonset
	//lunar noon?
	//toString
	//between
	//dst
}
class DMException {
	constructor(number,message) {
		this.number=number;
		this.message=message;
	}
	toString() {
		return number + ' ' + message;
	}
}