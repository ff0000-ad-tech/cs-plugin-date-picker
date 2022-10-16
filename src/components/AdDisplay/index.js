import './styles.scss'
import React, { useState } from 'react'

import Ad from '../Ad'
import { v4 as uuidv4 } from 'uuid'

function AdDisplay({ targets, urlParams }) {
	return (
		<div className="addisplay">
			<div className="props__adcontainer">
				{targets.map(target => {
					return (
						<Ad key={uuidv4()} data={target} urlParams={urlParams}>
							{target.width}
						</Ad>
					)
				})}
			</div>
		</div>
	)
}

export default AdDisplay
