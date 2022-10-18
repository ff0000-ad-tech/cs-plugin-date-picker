import './styles.scss'
import React, { useMemo, useState } from 'react'
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
import axios from 'axios'

function Main() {
	// Get todays date and time
	const now = Date.now()
	const today = new Date(now).toISOString()

	// Set picker default to today's date and time
	const [dateValue, setDateValue] = useState(dayjs(today))
	const [timeValue, setTimeValue] = useState(dayjs(today))
	const [tzValue, setTzValue] = useState('US/Eastern')
	const [urlParams, setUrlParams] = useState(null)
	const [targets, setTargets] = useState({})
	const [deployFolder, setDeployFolder] = useState('default')

	// Session storage
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
				urlParams,
				profile: deployFolder,
				targets: targets[deployFolder]
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

	const getDebugPath = path => {
		const arr = path.split('/')
		const [slash, folder, profile, index, trailingSlash] = arr
		return `/2-debug/${index}/`
	}

	useEffect(() => {
		const targetsObj = {}
		let subscribed = true

		// axios.get('http://192.168.1.122:5200/api/get-profiles').then(res => {
		axios.get('/api/get-profiles').then(res => {
			if (res.data) {
				// Response is the profiles object
				const profilesObj = res.data
				console.error('GOT PROFILES', profilesObj)
				// Iterate profiles object
				for (let [profileKey, profileValue] of Object.entries(profilesObj)) {
					// Create new object to save in targets

					const targets = profileValue.targets.map(targetObj => {
						// Split the size to get width and height
						const size = targetObj.size
						const sizeArr = size.split('x')
						const width = sizeArr[0]
						const height = sizeArr[1]

						// Strip the .html off the index name we get
						const indexStripped = targetObj.index.substring(0, targetObj.index.lastIndexOf('.')) || targetObj.index
						// Replace the "index_" with "size+__" so we get 300x250__v1
						const indexFolder = indexStripped.replace('index_', `${size}__`)

						// Create path obj
						targetObj.debugPath = `/2-debug/${indexFolder}/`
						targetObj.trafficPath = `/3-traffic/${profileKey}/${indexFolder}/`
						targetObj.width = width
						targetObj.height = height
						return targetObj
					})

					targetsObj[profileKey] = targets
				}
			}
		})
		if (subscribed) {
			console.error('SET TARGETS TO: ', targetsObj)
			setTargets(targetsObj)
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

	const tabPanel = useMemo(() => {
		return <TabPanel savedDates={savedDates} onDelete={deleteSavedDate} />
	}, [savedDates])

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
				<FormControl style={{ width: '170px' }}>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={deployFolder}
						sx={{ backgroundColor: 'white' }}
						onChange={e => {
							setDeployFolder(e.target.value)
						}}
					>
						{Object.keys(targets).map(key => {
							return <MenuItem value={key}>{key}</MenuItem>
						})}
					</Select>
				</FormControl>
				<Button variant="contained" onClick={saveDate}>
					Save Date
				</Button>
			</div>
			{savedDates.length > 0 ? (
				tabPanel
			) : Object.entries(targets).length > 0 ? (
				<AdDisplay targets={targets[deployFolder]} urlParams={urlParams} deployFolder={deployFolder} />
			) : null}
		</div>
	)
}

export default Main
