var DateMagic = DateMagic || {};
DateMagic=function DateMagic(){
	if (arguments.length>=3 && typeof(arguments[0])=='number' && typeof(arguments[1])=='number' && typeof(arguments[2])=='number') {
		this.year=arguments[0];
		this.month=arguments[1];
		this.day=arguments[2];
		if (arguments.length>=4 && typeof(arguments[3])=='number')
			this.hour=arguments[3];
		if (arguments.length>=5 && typeof(arguments[4])=='number')
			this.minute=arguments[4];
		if (arguments.length>=6 && typeof(arguments[5])=='number')
			this.second=arguments[5];
		if (arguments.length>=7 && typeof(arguments[6])=='number')
			this.millisecond=arguments[6];
	} else if ((arguments.length==1) && typeof(arguments[0])=='number') {
		d=new Date(arguments[0]); //make date from milliseconds constructor
		this.year=d.getUTCFullYear();
		this.month=d.getUTCMonth();
		this.day=d.getUTCDate();
		this.hour=d.getUTCHours();
		this.minute=d.getUTCMinutes();
		this.second=d.getUTCSeconds();
		this.millisecond=d.getUTCMilliseconds();
	} else {
		d=new Date();
		this.year=d.getUTCFullYear();
		this.month=d.getUTCMonth();
		this.day=d.getUTCDate();
		this.hour=d.getUTCHours();
		this.minute=d.getUTCMinutes();
		this.second=d.getUTCSeconds();
		this.millisecond=d.getUTCMilliseconds();
	}
}
DateMagic.prototype={
	constructor:DateMagic
}
DateMagic.prototype.computus=function(year,eastern=false){
	var a,b,c,k,p,q,M,N,d,e,day;
	if (year==null)
		year=this.year
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
		M=15;e=
		N=6;
	}
	d=(19*a+M)%30
	e=(2*b+4*c+6*d+N)%7;
	if (d==29 && e==6) {
		return new DateMagic(year,4,19);
	}
	if (d==28 && e==6 && (11*M+11)%30<19) {
		return new DateMagic(year,4,18);
	}
	day=22+d+e;
	return new DateMagic(year,3,22+d+e);
}
DateMagic.prototype.to_jdn=function(includeTime=false,modified=false){
	var gregorian_start;
	gregorian_start=new DateMagic(1582,9,15);
	if (this>gregorian_start) {
		return this.gregorian_to_jdn(includeTime,modified);
	}
	return this.julian_to_jdn(includeTime,modified);
}
