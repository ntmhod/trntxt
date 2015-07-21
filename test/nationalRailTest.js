var chai = require('chai');
var expect = chai.expect;

var nr = require('../src/nationalrail.js');

describe('Valid inputs for findStation()', function() {
	var tests = {
		'clifton':'CLI', // Clifton (Manchester), not Clifton Down
		'did':'DID',
		'didcot':'DID',
		'didcot parkway':'DID',
		'didcotparkway':'DID',
		'hayeskent':'HYS', // Hayes (Kent)
		'hayes':'HYS',
		'hayesandharlington':'HAY', // Hayes & Harlington
		'hayesharlington':'HAY',
		'hayes&harlington':'HAY',
		'harrowhill':'HOH', // Harrow-on-the-Hill
		'Heathrow Airport Terminals 1, 2 and 3':'HXX',
		'heathrow1':'HXX',
		'heathrow2':'HXX',
		'heathrow3':'HXX',
		'heathrow4':'HAF',
		'heathrowairportterminal4':'HAF',
		'heathrow5':'HWV',
		'heathrowairportterminal5':'HWV',
		'heathrow123':'HXX', // "Heathrow Airport Terminals 1, 2 and 3"
		'waterloo':'WLO',
		'lonwat':'WAT',
		'waterlooeast':'WAE'
	};
	Object.keys(tests).forEach(function(key) {
		it('should return "' + tests[key] + '" with input "' + key + '"', function() {
			var result = nr.findStation(key);
			expect(result).to.be.an('array').and.have.length.above(0);
			expect(result[0]).to.have.property('stationCode').that.equals(tests[key]);
		});
	});
});

describe('Invalid inputs for findStation()', function() {
	// All the following inputs should return an empty array
	it('should return an empty array for an undefined input', function() {
		expect(nr.findStation()).to.be.an('array').and.to.be.empty;
	});
	it('should return an empty array for a null input', function() {
		expect(nr.findStation('')).to.be.an('array').and.to.be.empty;
	});
	it('should return an empty array for an empty input', function() {
		expect(nr.findStation(null)).to.be.an('array').and.to.be.empty;
	});
	it('should return an empty array for an input of less than 3 characters', function() {
		expect(nr.findStation('d')).to.be.an('array').and.to.be.empty;
		expect(nr.findStation('di')).to.be.an('array').and.to.be.empty;
	});
	it('should return an empty array for an input that clearly isn\'t a name of a station', function() {
		expect(nr.findStation('ClearlyNotARealStationName')).to.be.an('array').and.to.be.empty;
	});
});

describe('Testing sanitiseText()', function() {
	var tests = {
		'did':'DID',
		'':'',
		'didcot parkway':'DIDCOTPARKWAY',
		'Weston-Super-Mare':'WESTONSUPERMARE',
		' odd9 typ0o  ':'ODD9TYP0O'
	};
	Object.keys(tests).forEach(function(key) {
		it('should return "' + tests[key] + '" with input "' + key + '"', function() {
			expect(nr.sanitise(key)).to.equal(tests[key]);
		});
	});
	it('should return null when entering null', function() {
		expect(nr.sanitise(null)).to.be.null;
	});
	it('should return null when the input is undefined', function() {
		expect(nr.sanitise()).to.be.null;
	});
});