import './styles.scss'

function Ad({ data, urlParams }) {
	const { width, height, path } = data
	return (
		<div className="ad">
			{`${width}x${height}`}
			<iframe src={`${path}${urlParams}`} width={width} height={height} title="Iframe Example"></iframe>
		</div>
	)
}

export default Ad
