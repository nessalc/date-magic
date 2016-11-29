var DateMagic = (function() {
	function DateMagic() {
	};
	DateMagic.prototype.computus=function(year,eastern=false){
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
	DateMagic.prototype.julian_to_gregorian=function(date){
	}
	DateMagic.prototype.gregorian_to_julian=function(date){
	}
	/*
		Need functions to do the following:
			*date of nth weekday of month (e.g. last Thursday, second Tuesday)
			*date of weekday before/after date (e.g. first Friday after Ash Wednesday)
	*/
	return DateMagic;
})();