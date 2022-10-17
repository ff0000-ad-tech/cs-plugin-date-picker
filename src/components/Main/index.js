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
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import TabPanel from '../TabPanel'
import AdDisplay from '../AdDisplay'

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
	// Get any saved dates in session storage
	const sessionSavedDatesRaw = sessionStorage.getItem('savedDates')
	// If savedDates does not exist in session storage set it to empty array, else parse the array
	const sessionSavedDates = !sessionSavedDatesRaw ? [] : JSON.parse(sessionSavedDatesRaw)
	// const defaultSavedDates = sessionSavedDates.length > 0 ? sessionSavedDates : []
	const [savedDates, setSavedDates] = useState(sessionSavedDates)

	// Save a date
	const saveDate = () => {
		setSavedDates(prev => {
			// Create new saved date obj
			const date = {
				dateValue,
				timeValue,
				tzValue,
				urlParams
			}
			date.label = generateLabel(date)
			const newSavedDates = [...prev, date]
			sessionStorage.setItem('savedDates', JSON.stringify(newSavedDates))
			return newSavedDates
		})
	}

	// Generate readable label for tabs
	const generateLabel = ({ dateValue, timeValue, tzValue }) => {
		const date = dateValue.format('MM/DD/YYYY')
		const time = timeValue.format('h:mm A')
		return `${date} ${time} ${tzValue}`
	}

	// Deletes a saved date and tab
	const deleteSavedDate = urlParams => {
		const filtered = savedDates.filter(date => date.urlParams !== urlParams)
		sessionStorage.setItem('savedDates', JSON.stringify(filtered))
		setSavedDates(filtered)
	}

	// Set url params
	useEffect(() => {
		const date = dateValue.format('YYYY-MM-DD')
		const time = timeValue.format('HH:mm:ss')
		setUrlParams(`?date=${date} ${time}&tz=${tzValue}`)
	}, [dateValue, timeValue, tzValue])

	useEffect(() => {
		let subscribed = true
		const query = getQueryParams()
		const targetsArr = [...targets]
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
				targetsArr.push({ width: sizeArr[0], height: sizeArr[1], path: value })
			}
		}
		if (subscribed) {
			setTargets(targetsArr)
		}
		return () => {
			subscribed = false
		}
	}, [])

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
				<Button variant="contained" onClick={saveDate}>
					Save Date
				</Button>
			</div>
			{savedDates.length > 0 ? (
				<TabPanel savedDates={savedDates} targets={targets} onDelete={deleteSavedDate} />
			) : (
				<AdDisplay targets={targets} urlParams={urlParams} />
			)}
		</div>
	)
}

export default Main
