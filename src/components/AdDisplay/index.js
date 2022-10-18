import Ad from '../Ad'
import { v4 as uuidv4 } from 'uuid'

import './styles.scss'

function AdDisplay({ targets, urlParams }) {
	return (
		<div className="addisplay">
			{targets.map(target => {
				return <Ad key={uuidv4()} target={target} urlParams={urlParams} />
			})}
		</div>
	)
}

export default AdDisplay
