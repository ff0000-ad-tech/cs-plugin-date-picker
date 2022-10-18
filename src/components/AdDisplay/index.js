import './styles.scss'
import React, { useEffect, useState } from 'react'

import Ad from '../Ad'
import { v4 as uuidv4 } from 'uuid'

function AdDisplay({ targets, urlParams, deployFolder }) {
	return (
		<div className="addisplay">
			<div className="props__adcontainer">
				{targets.map(target => {
					return <Ad key={uuidv4()} data={target} urlParams={urlParams} deployFolder={deployFolder} />
				})}
			</div>
		</div>
	)
}

export default AdDisplay
