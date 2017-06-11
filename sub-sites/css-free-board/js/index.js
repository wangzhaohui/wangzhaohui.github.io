/* 主页js */

// url configuration
var conf = [
    'iqiyi-logo',
    'smile-ball'
];

var container = document.querySelector('#container');
var cssContainer = document.querySelector('#cssContainer');

conf.forEach(function(v, i) {
	request('stuffs/html/' + v + '.html', function(data) {
		container.innerHTML += '<li>' + data + '</li>';
		request('stuffs/css/' + v + '.css', function(data) {
			cssContainer.innerHTML += data;
		});
	});
});

function request(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}