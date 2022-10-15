import './styles.scss'
import React, { useState } from 'react'
import { getQueryParams } from '@ff0000-ad-tech/ad-global'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Ad from '../Ad'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/material/styles'

function Main() {
	// Get todays date and time
	const now = Date.now()
	const today = new Date(now).toISOString()

	// Set picker default to today's date and time
	const [dateValue, setDateValue] = useState(dayjs(today))
	const [timeValue, setTimeValue] = useState(dayjs(today))
	const [tzValue, setTzValue] = useState('US/Eastern')
	const [urlParams, setUrlParams] = useState(null)
	const [targets, setTargets] = useState([])

	useEffect(() => {
		const date = dateValue.format('DD-MM-YYYY')
		const time = timeValue.format('HH:mm:ss')
		setUrlParams(`?date=${date} ${time}&tz=${tzValue}`)
	}, [dateValue, timeValue, tzValue])

	useEffect(() => {
		const query = getQueryParams()
		if (query.targets) {
			// Get the query params and parse it so we get proper obj
			const targetsObj = JSON.parse(query.targets)
			// Populate the targets array
			for (let [key, value] of Object.entries(targetsObj)) {
				// Split the path to get the size
				const [profile, size, index] = key.split('/')
				// Split the size to get width and height
				const sizeArr = size.split('x')
				// Create new target obj
				setTargets(prev => [...prev, { width: sizeArr[0], height: sizeArr[1], path: value }])
			}
		}
	}, [])

	const applyDateTime = () => {
		const date = dateValue.format('YYYY-MM-DD')
		const time = dateValue.format('HH:mm:ss')
		setUrlParams(`?date=${date} ${time}&tz=${tzValue}`)
		// console.error(timeValue)
	}

	const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
		'& .MuiInputBase-root': {
			backgroundColor: 'white'
		}
	}))
	const StyledTimePicker = styled(DesktopTimePicker)(({ theme }) => ({
		'& .MuiInputBase-root': {
			backgroundColor: 'white'
		}
	}))

	return (
		<div className="main">
			<div className="main__header">CS Date Picker</div>
			<div className="main__pickercontainer">
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<StyledDatePicker
						value={dateValue}
						onChange={newValue => {
							setDateValue(newValue)
						}}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<StyledTimePicker
						value={timeValue}
						onChange={newValue => {
							setTimeValue(newValue)
						}}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
				<FormControl style={{ width: '170px' }}>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={tzValue}
						sx={{ backgroundColor: 'white' }}
						onChange={e => {
							setTzValue(e.target.value)
						}}
					>
						<MenuItem value="US/Eastern">US/Eastern</MenuItem>
						<MenuItem value="US/Central">US/Central</MenuItem>
						<MenuItem value="US/Mountain">US/Mountain</MenuItem>
						<MenuItem value="US/Pacific">US/Pacific</MenuItem>
						<MenuItem value="US/Hawaii">US/Hawaii</MenuItem>
					</Select>
				</FormControl>
			</div>
			<div className="main__adcontainer">
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

export default Main
