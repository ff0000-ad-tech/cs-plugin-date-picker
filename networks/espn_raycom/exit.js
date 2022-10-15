this.exit = function(url) {
	var clickUrl = this.appendMacro('%%CLICK_URL_UNESC%%', url)
	console.log('Network -> ESPN EXIT (Raycom)')
	window.open(clickUrl, '_blank')
}
