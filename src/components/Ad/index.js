import './styles.scss'
import ReplayIcon from '@mui/icons-material/Replay'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
function Ad({ data, urlParams, deployFolder }) {
	const { width, height, debugPath, trafficPath } = data
	const [replayKey, setReplayKey] = useState(1)

	const replayAd = () => {
		setReplayKey(Math.random())
	}

	// Change path based on deployFolder
	const getPath = () => {
		return deployFolder == '2-debug' ? debugPath : trafficPath
	}

	return (
		<div className="ad">
			<div className="ad__header" style={{ width: `${width}px` }}>
				{`${width}x${height} - ${getPath()}`}
				<IconButton aria-label="delete" onClick={replayAd}>
					<ReplayIcon />
				</IconButton>
			</div>
			<iframe src={`${getPath()}index.html${urlParams}`} width={width} height={height} title="Iframe Example" key={replayKey}></iframe>
		</div>
	)
}

export default Ad
