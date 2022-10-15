this.exit = function(url) {
	console.log('Network -> MRAID EXIT')
	mraid.open(this.appendMacro('%%CLICK_URL_UNESC%%', url))
}
