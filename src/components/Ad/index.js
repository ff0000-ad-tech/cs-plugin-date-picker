import './styles.scss'
import ReplayIcon from '@mui/icons-material/Replay'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
function Ad({ target, urlParams }) {
	const { width, height, debugPath, trafficPath } = target
	const [replayKey, setReplayKey] = useState(1)

	const replayAd = () => {
		setReplayKey(Math.random())
	}

	// Change path based on profile
	const getPath = () => {
		return target.profile == 'default' ? debugPath : trafficPath
	}

	return (
		<div className="ad">
			<div className="ad__header" style={{ width: `${width}px` }}>
				<span>
					{`${width}x${height}`}
					<br></br>
					<span style={{ fontSize: '8px', fontWeight: 'normal' }}>{getPath()}</span>
				</span>
				<IconButton aria-label="delete" onClick={replayAd}>
					<ReplayIcon />
				</IconButton>
			</div>
			<iframe src={`${getPath()}${urlParams}`} width={width} height={height} title="Iframe Example" key={replayKey}></iframe>
		</div>
	)
}

export default Ad
