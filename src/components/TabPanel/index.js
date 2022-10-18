import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AdDisplay from '../AdDisplay'
import { v4 as uuidv4 } from 'uuid'
import Button from '@mui/material/Button'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import './styles.scss'

function TabPanel(props) {
	const { children, value, index, deployFolder, ...other } = props

	return (
		<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography component={'span'}>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	}
}

export default function BasicTabs(props) {
	const [value, setValue] = useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleDelete = useCallback((event, value) => {
		// stop event from propagating to the target element's parent
		event.stopPropagation()
		setValue(0)
	})

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					{props.savedDates.map((date, idx) => {
						return (
							<Tab
								label={
									<div className="tabpanel__tab-label">
										{date.label}
										<DeleteForeverIcon
											style={{ marginLeft: '20px' }}
											onClick={e => {
												handleDelete(e)
												props.onDelete(date.urlParams)
											}}
										/>
									</div>
								}
								{...a11yProps(idx)}
								key={uuidv4()}
							/>
						)
					})}
				</Tabs>
			</Box>
			{props.savedDates.map((date, idx) => {
				return (
					<TabPanel value={value} index={idx} key={uuidv4()}>
						<AdDisplay targets={date.targets} urlParams={date.urlParams} debugOrTraffic={date.debugOrTraffic} />
					</TabPanel>
				)
			})}
		</Box>
	)
}
