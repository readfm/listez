window.addEventListener('DOMContentLoaded', function () {
	var ws = window.ws = new WS({
		server: 'io.cx'
	});

	ws.on.session = ses => {
		console.log(ses);

		var hash = document.location.hash.substr(1);
		

		var filters = {
			default: {
				yid: {
					"$exists":true
				}
			},

			links: {"$or":[
				{"title":{"$exists":true},"path":{"$regex":"^http"}},
				{"text":{"$exists":true},"youtube_id":{"$exists":true}}
			]}
		}

		var filter = filters[hash || 'none'] || filters.default;

		ws.send({
			"cmd":"load",
			"collection":"pix8",
			filter,
			"sort":{
				"time":-1,
				"updated":-1,
				"created":-1
			},
			"limit":40000
		}, r => {
			(r.items || []).forEach(item => {
				if(!item.text) return;

				var a = document.createElement('a');
				a.target = '_blank'
				a.href = item.yid?
					('https://youtu.be/'+item.yid+'#t='+item.startTime):
					item.path;
				
				a.innerText = item.text;
				document.body.appendChild(a);
			});
		});
	};
});