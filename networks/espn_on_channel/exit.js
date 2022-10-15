this.exit = function(url) {
	var clickUrl = this.appendMacro('%%CLICK_URL_UNESC%%', url)
	var cachebuster = '%%CACHEBUSTER%%'
	if (cachebuster.search('^%%') > -1) {
		cachebuster = new Date().getTime()
	}

	switch (adParams.espnChannel) {
		case 'ESPN_FFL_APP':
			console.log('Network -> ESPN_FFL_APP EXIT (Fantasy App)')
			if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
				window.parent.app.ads.clickThrough(clickUrl + '?ord=' + cachebuster)
			} else {
				window.parent.app.ads.clickThrough(clickUrl)
			}
			break

		case 'MRAID': // backwards compatibility
		case 'MRAID_IOS':
			console.log('Network -> MRAID EXIT (ESPN App, iOS)')
			// do not append macro to the sportscenter deeplink
			if (url.search(/^sportscenter/) > -1) {
				mraid.open(url)
			} else {
				mraid.open(clickUrl)
			}
			break

		case 'MRAID_ANDROID':
			console.log('Network -> MRAID EXIT (ESPN App, Android)')
			mraid.open(clickUrl + '?ord=' + cachebuster)
			break

		case 'ESPN':
			console.log('Network -> ESPN EXIT (Dot com)')
			window.open(clickUrl, '_blank')
			break
	}
}
