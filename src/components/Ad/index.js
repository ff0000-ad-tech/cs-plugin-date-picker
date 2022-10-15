import './styles.scss'
import ReplayIcon from '@mui/icons-material/Replay'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
function Ad({ data, urlParams }) {
	const { width, height, path } = data
	const [replayKey, setReplayKey] = useState(1)

	const replayAd = () => {
		setReplayKey(Math.random())
	}

	return (
		<div className="ad">
			<div className="ad__header" style={{ width: `${width}px` }}>
				{`${width}x${height}`}
				<IconButton aria-label="delete" onClick={replayAd}>
					<ReplayIcon />
				</IconButton>
			</div>
			<iframe src={`${path}${urlParams}`} width={width} height={height} title="Iframe Example" key={replayKey}></iframe>
		</div>
	)
}

export default Ad
