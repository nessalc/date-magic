var DateMagic = (function() {
	function DateMagic() {
	};
	function DateMagic(milliseconds) {
	};
	DateMagic.prototype.computus=function(year,eastern=false){
		var a,b,c,k,p,q,M,N,d,e,day;
		a=year%19;
		b=year%4;
		c=year%7;
		if (!eastern) {
			k=Math.floor(year/100);
			p=Math.floor((13+8*k)/25);
			q=Math.floor(k/4);
			M=(15-p+k-q)%30;
			N=(4+k-q)%7;
		} else {
			M=15;
			N=6;
		}
		d=(19*a+M)%30
		e=(2*b+4*c+6*d+N)%7;
		if (d==29 && e==6) {
			return new Date(year,3,19);
		}
		if (d==28 && e==6 && (11*M+11)%30<19) {
			return new Date(year,3,18);
		}
		day=22+d+e;
		return new Date(year,2,22+d+e);
	}
	DateMagic.prototype.to_julianDayNumber=function(date,includeTime=false,modified=false){
		var gregorian_start;
		gregorian_start=new Date(1582,9,15);
		if (date>gregorian_start) {
			return this.gregorian_to_julianDayNumber(date,includeTime,modified);
		}
		return this.julian_to_julianDayNumber(date,includeTime,modified);
	}
	DateMagic.prototype.gregorian_to_julianDayNumber=function(date,includeTime=false,modified=false){
		var UT,Y,M,D,JD;
		date=this.date_object(date,includeTime);
		if (!includeTime){
			UT=0;
		} else {
			UT=(date.hours+(date.minutes+date.seconds/60)/60)/24;
		}
		Y=date.year;
		M=date.month;
		D=date.day;
		JD=367*Y-Math.floor(7*(Y+Math.floor((M+9)/12))/4)-Math.floor(3*(Math.floor((Y+(M-9)/7)/100)+1)/4)+Math.floor(275*M/9)+D+1721028.5;
		if (!modified) {
			return JD+UT;
		}
		return JD+UT-2400000.5;
	}
	DateMagic.prototype.julian_to_julianDayNumber=function(date,includeTime=false,modified=false){
		var UT,Y,M,D,JD;
		date=this.date_object(date,includeTime);
		if (!includeTime){
			UT=0;
		} else {
			UT=(date.hours+(date.minutes+date.seconds/60)/60)/24;
		}
		Y=date.year;
		M=date.month;
		D=date.day;
		JD=367*Y-Math.floor(7*(Y+5001+Math.floor((M-9)/7))/4)+Math.floor(275*M/9)+D+1729776.5+UT;
		if (!modified) {
			return JD+UT;
		}
		return JD+UT-2400000.5;
	}
	DateMagic.prototype.jdn_to_gregorian_date=function(jdn,includeTime=false,modified=false){
		var hours,minutes,seconds,wjd,depoch,quadricent,dqc,cent,dcent,quad,dquad,yindex,year,yearday,leapadj,month,day,d,tzoffset;
		if (!includeTime) {
			hours=0;
			minutes=0;
			seconds=0;
		} else {
			hours=(jdn-0.5-Math.floor(jdn-0.5))*24;
			minutes=(hours-Math.floor(hours))*60;
			seconds=(minutes-Math.floor(minutes))*60;
			hours=Math.floor(hours);
			minutes=Math.floor(minutes);
			seconds=Math.floor(seconds);
		}
		if (modified) {
			jdn+=2400000.5;
		}
		wjd=Math.floor(jdn-0.5)+0.5;
		depoch=wjd-1721425.5;
		quadricent=Math.floor(depoch/146097);
		dqc=depoch%146097;
		cent=Math.floor(dqc/36524);
		dcent=dqc%36524;
		quad=Math.floor(dcent/1461);
		dquad=dcent%1461;
		yindex=Math.floor(dquad/365);
		year=(quadricent*400)+(cent*100)+(quad*4)+yindex;
		if (!((cent==4)||(yindex==4))){
			year++;
		}
		yearday=wjd-this.gregorian_to_julianDayNumber(new Date(year,0,1));
		leapadj=((wjd<this.gregorian_to_julianDayNumber(new Date(year,2,1))) ? 0 : (((year%4)==0)&&(!(((year%100)==0)&&((year%400)!=0))) ? 1 : 2));
		month=Math.floor((((yearday+leapadj)*12)+373)/367);
		day=(wjd-this.gregorian_to_julianDayNumber(new Date(year,month-1,1)))+1;
		d=new Date(year,month-1,day,hours,minutes,seconds);
		tzoffset=d.getTimezoneOffset();
		d.setUTCMinutes(minutes-tzoffset)
		if (d.getUTCFullYear()!=year) {
			d.setUTCFullYear(year);
		}
		return d;
	}
	DateMagic.prototype.jdn_to_julian_date=function(jdn,includeTime=false,modified=false){
		var hours,minutes,seconds,z,a,b,c,d,e,month,year,day,tzoffset,d;
		if (!includeTime) {
			hours=0;
			minutes=0;
			seconds=0;
		} else {
			hours=(jdn-0.5-Math.floor(jdn-0.5))*24;
			minutes=(hours-Math.floor(hours))*60;
			seconds=(minutes-Math.floor(minutes))*60;
			hours=Math.floor(hours);
			minutes=Math.floor(minutes);
			seconds=Math.floor(seconds);
		}
		if (modified) {
			jdn+=2400000.5;
		}
		z=Math.floor(jdn+0.5);
		a=z;
		b=a+1524;
		c=Math.floor((b-122.1)/365.25);
		d=Math.floor(365.25*c);
		e=Math.floor((b-d)/30.6001);
		month=(e-1)%12;
		year=c-4716;
		year+=(month>2);
		day=b-d-Math.floor(30.6001*e);
		d=new Date(year,month-1,day,hours,minutes,seconds);
		tzoffset=d.getTimezoneOffset();
		d.setUTCMinutes(minutes-tzoffset)
		if (d.getUTCFullYear()!=year) {
			d.setUTCFullYear(year);
		}
		return d;
	}
	DateMagic.prototype.julian_to_gregorian=function(date){
	}
	DateMagic.prototype.gregorian_to_julian=function(date){
		return new Date(this.jdn_to_julian_date(this.gregorian_to_julianDayNumber(date)));
	}
	DateMagic.prototype.date_map=function(date,includeTime=false){
		if (!includeTime){
			return new Map([['year',date.getUTCFullYear()],['month',date.getUTCMonth()+1],['day',date.getUTCDate()]]);
		}
		return new Map([['year',date.getUTCFullYear()],['month',date.getUTCMonth()+1],['day',date.getUTCDate()],['hours',date.getUTCHours()],['minutes',date.getUTCMinutes()],['seconds',date.getUTCSeconds()],['milliseconds',date.getUTCMilliseconds()]]);
	}
	DateMagic.prototype.date_object=function(date,includeTime=false){
		if (!includeTime){
			return {year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate()};
		}
		return {year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate(),hours:date.getUTCHours(),minutes:date.getUTCMinutes(),seconds:date.getUTCSeconds(),milliseconds:date.getUTCMilliseconds()}
	}
	DateMagic.prototype.date_array=function(date,includeTime=false){
		if (!includeTime){
			return [date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate()];
		}
		return [date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds(),date.getUTCMilliseconds()];
	}
	DateMagic.prototype.map_date=function(datemap){
		var d;
		d=new Date(datemap.get('year'),datemap.get('month')-1,datemap.get('day'),datemap.get('hours'),datemap.get('minutes'),datemap.get('seconds'),datemap.get('milliseconds'))
		if (d.getUTCFullYear()!=datemap.get('year')){
			d.setUTCFullYear(datemap.get('year'));
		}
		return d;
	}
	DateMagic.prototype.object_date=function(dobj){
		var d;
		d=new Date(dobj.year,dobj.month,dobj.day,dobj.hours,dobj.minutes,dobj.seconds,dobj.milliseconds);
		if (d.getUTCFullYear()!=dobj.year){
			d.setUTCFullYear(dobj.year);
		}
		return d;
	}
	DateMagic.prototype.array_date=function(darr){
		var d;
		d=new Date(0,0,0,0,0,0,0,0);
		d.setUTCFullYear(darr[0]);
		d.setUTCMonth(darr[1]-1);
		d.setUTCDate(darr[2]);
		d.setUTCHours(darr[3] ? darr[3] : 0);
		d.setUTCMinutes(darr[4] ? darr[4] : 0);
		d.setUTCSeconds(darr[5] ? darr[5] : 0);
		d.setUTCMilliseconds(darr[6] ? darr[6] : 0);
		return d;
	}
	//DateMagic.prototype.add=function(date,args){
	//	return new Date(date.valueOf()+this.interval(args));
	//}
	DateMagic.prototype.add=function(date1,args){
		var dobj;
		args=this.__dict_to_map(args);
		dobj=this.date_map(date1,true);
		for (var [k,v] of dobj.entries()){
			if (args.get(k)){
				dobj.set(k,v+args.get(k));
			}
		}
		return dobj;
	}
	DateMagic.prototype.__dict_to_map=function(dict){
		try{
			dict.entries(); //dict is already a map
		} catch(e){
			dict=new Map(Object.entries(dict)); //make dict a map
		}
		return dict
	}
	DateMagic.prototype.nth_weekday=function(n,weekday,month,year){
		var d,temp;
		d=new Date(0);
		d.setUTCDate(1);
		d.setUTCMonth(month);
		d.setUTCFullYear(year);
		temp=(weekday-d.getUTCDay())%7;
		if (temp<0){
			temp+=7;
		}
		d.setUTCDate(d.getUTCDate()+temp+7*n);
		if (d.getUTCMonth()!=month){
			d-=7;
		}
		return d;
	}
	/*
		Need functions to do the following:
			*date of nth weekday of month (e.g. last Thursday, second Tuesday)
			*date of weekday before/after date (e.g. first Friday after Ash Wednesday)
	*/
	return DateMagic;
})();