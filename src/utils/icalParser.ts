export interface ParsedEvent {
  uid: string
  summary: string
  description?: string
  dtstart: string
  dtend: string
  location?: string
  created?: string
  lastModified?: string
  rrule?: string
  recurrenceId?: string
  exdates?: string[]
}

export interface ParsedCalendar {
  events: ParsedEvent[]
}

/**
 * Simple iCal parser for browser use
 */
export function parseICalendar(icalData: string): ParsedCalendar {
  const lines = icalData.split(/\r?\n/)
  const events: ParsedEvent[] = []
  let currentEvent: Partial<ParsedEvent> | null = null

  console.log('Parsing iCal data, total lines:', lines.length)

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]!.trim()

    // Handle line continuations (lines starting with space or tab)
    while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1]!)) {
      i++
      line += lines[i]!.substring(1)
    }

    if (line === 'BEGIN:VEVENT') {
      currentEvent = {}
      console.log('Found event start')
    } else if (line === 'END:VEVENT' && currentEvent) {
      // Be more lenient - only require UID or SUMMARY, not both
      if ((currentEvent.uid || currentEvent.summary) && currentEvent.dtstart) {
        events.push(currentEvent as ParsedEvent)
        console.log('Added event:', currentEvent.summary || currentEvent.uid)
      } else {
        console.log('Skipped invalid event:', currentEvent)
      }
      currentEvent = null
    } else if (currentEvent && line.includes(':')) {
      const colonIndex = line.indexOf(':')
      const fullProperty = line.substring(0, colonIndex)
      const property = fullProperty.split(';')[0]!.toUpperCase()
      const value = line.substring(colonIndex + 1)

      // Parse ALL properties, not just specific ones
      switch (property) {
        case 'UID':
          currentEvent.uid = value
          break
        case 'SUMMARY':
          currentEvent.summary = unescapeICalValue(value)
          break
        case 'DESCRIPTION':
          currentEvent.description = unescapeICalValue(value)
          break
        case 'DTSTART':
          currentEvent.dtstart = extractDateValue(fullProperty, value)
          break
        case 'DTEND':
          currentEvent.dtend = extractDateValue(fullProperty, value)
          break
        case 'LOCATION':
          currentEvent.location = unescapeICalValue(value)
          break
        case 'CREATED':
          currentEvent.created = value
          break
        case 'LAST-MODIFIED':
        case 'DTSTAMP':
          currentEvent.lastModified = value
          break
        case 'RRULE':
          currentEvent.rrule = value
          break
        case 'EXDATE':
          if (!currentEvent.exdates) currentEvent.exdates = []
          currentEvent.exdates.push(value)
          break
        case 'RECURRENCE-ID':
          currentEvent.recurrenceId = value
          break
        // Handle other common properties
        case 'STATUS':
        case 'CLASS':
        case 'TRANSP':
        case 'SEQUENCE':
        case 'ORGANIZER':
        case 'URL':
          // Store these but don't fail if missing
          break
        default:
          // Log unknown properties for debugging
          if (property && !['X-', 'RDATE'].some(prefix => property.startsWith(prefix))) {
            console.log('Unknown property:', property, '=', value.substring(0, 50))
          }
      }
    }
  }

  console.log('Total events parsed:', events.length)
  return { events }
}

/**
 * Extract date value handling timezone parameters
 */
function extractDateValue(property: string, value: string): string {
  // Handle DTSTART;VALUE=DATE:20241027 format
  // Handle DTSTART;TZID=America/Phoenix:20241027T190000 format
  // Just return the value part for now
  return value
}

/**
 * Parse iCal date/time format to JavaScript Date
 */
export function parseICalDate(icalDate: string): Date {
  // Handle different formats:
  // YYYYMMDD (date only)
  // YYYYMMDDTHHMMSS (local time)
  // YYYYMMDDTHHMMSSZ (UTC time)

  if (!icalDate) return new Date()

  console.log('Parsing date:', icalDate)

  // Extract just the date/time part (remove timezone info)
  let cleanDate = icalDate
  if (icalDate.includes('T')) {
    // Has time component
    const [datePart, timePart] = icalDate.split('T')
    cleanDate = datePart + 'T' + timePart!.replace(/Z$/, '') // Remove trailing Z
  }

  if (cleanDate.length === 8) {
    // Date only: YYYYMMDD
    const year = parseInt(cleanDate.substring(0, 4))
    const month = parseInt(cleanDate.substring(4, 6)) - 1 // JS months are 0-based
    const day = parseInt(cleanDate.substring(6, 8))
    const parsedDate = new Date(year, month, day)
    console.log(`Parsed date-only ${icalDate} -> ${parsedDate}`)
    return parsedDate
  } else if (cleanDate.includes('T')) {
    // DateTime: YYYYMMDDTHHMMSS
    const [datePart, timePart] = cleanDate.split('T')
    const year = parseInt(datePart!.substring(0, 4))
    const month = parseInt(datePart!.substring(4, 6)) - 1
    const day = parseInt(datePart!.substring(6, 8))

    const hour = parseInt(timePart!.substring(0, 2) || '0')
    const minute = parseInt(timePart!.substring(2, 4) || '0')
    const second = parseInt(timePart!.substring(4, 6) || '0')

    const date = new Date(year, month, day, hour, minute, second)

    // If original had 'Z', it's UTC time
    if (icalDate.endsWith('Z')) {
      const utcDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      console.log(`Parsed UTC ${icalDate} -> ${utcDate}`)
      return utcDate
    }

    console.log(`Parsed local ${icalDate} -> ${date}`)
    return date
  }

  // Fallback to current date
  console.log(`Could not parse ${icalDate}, using current date`)
  return new Date()
}

/**
 * Unescape iCal text values
 */
function unescapeICalValue(value: string): string {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
}

/**
 * Check if an iCal date represents an all-day event
 */
export function isAllDayEvent(dtstart: string): boolean {
  return Boolean(dtstart && !dtstart.includes('T'))
}

/**
 * Expand recurring events for a date range
 */
export function expandRecurringEvents(events: ParsedEvent[], startDate: Date, endDate: Date, allowedFrequencies?: string[]): ParsedEvent[] {
  const expandedEvents: ParsedEvent[] = []

  for (const event of events) {
    if (!event.rrule) {
      // Non-recurring event, add as-is if it falls in range
      const eventStart = parseICalDate(event.dtstart)
      const eventEnd = parseICalDate(event.dtend || event.dtstart)

      if (eventStart >= startDate && eventStart <= endDate) {
        expandedEvents.push(event)
      }
      continue
    }

    // Parse RRULE
    const rrule = parseRRule(event.rrule)
    if (!rrule) {
      console.warn('Could not parse RRULE:', event.rrule)
      continue
    }

    // Filter by allowed frequencies if specified
    if (allowedFrequencies && !allowedFrequencies.includes(rrule.freq)) {
      console.log(`Skipping ${rrule.freq} event "${event.summary}" (not in allowed frequencies)`)
      continue
    }

    // Generate recurring instances
    const eventStart = parseICalDate(event.dtstart)
    const eventEnd = parseICalDate(event.dtend || event.dtstart)
    const duration = eventEnd.getTime() - eventStart.getTime()

    const instances = generateRecurringInstances(eventStart, rrule, startDate, endDate)

    // Filter out excluded dates
    const exdates = event.exdates?.map(exdate => parseICalDate(exdate)) || []

    for (const instanceStart of instances) {
      // Check if this instance is excluded
      const isExcluded = exdates.some(exdate =>
        Math.abs(exdate.getTime() - instanceStart.getTime()) < 24 * 60 * 60 * 1000 // Within 24 hours
      )

      if (!isExcluded) {
        const instanceEnd = new Date(instanceStart.getTime() + duration)

        expandedEvents.push({
          ...event,
          uid: `${event.uid}_${instanceStart.getTime()}`,
          dtstart: formatDateToICal(instanceStart),
          dtend: formatDateToICal(instanceEnd)
        })
      }
    }
  }

  return expandedEvents
}

/**
 * Parse RRULE string into components
 */
function parseRRule(rruleString: string): any {
  const parts = rruleString.split(';')
  const rrule: any = {}

  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key && value) {
      switch (key) {
        case 'FREQ':
          rrule.freq = value
          break
        case 'INTERVAL':
          rrule.interval = parseInt(value) || 1
          break
        case 'COUNT':
          rrule.count = parseInt(value)
          break
        case 'UNTIL':
          rrule.until = parseICalDate(value)
          break
        case 'BYDAY':
          rrule.byday = value.split(',')
          break
        case 'BYMONTHDAY':
          rrule.bymonthday = value.split(',').map(d => parseInt(d))
          break
        case 'BYMONTH':
          rrule.bymonth = value.split(',').map(m => parseInt(m))
          break
      }
    }
  }

  return rrule
}

/**
 * Generate recurring instances within date range
 */
function generateRecurringInstances(startDate: Date, rrule: any, rangeStart: Date, rangeEnd: Date): Date[] {
  const instances: Date[] = []
  const current = new Date(startDate)
  let count = 0
  const maxInstances = rrule.count || 1000 // Prevent infinite loops

  // If the event starts before our range, fast-forward to the range
  while (current < rangeStart && count < maxInstances) {
    switch (rrule.freq) {
      case 'DAILY':
        current.setDate(current.getDate() + (rrule.interval || 1))
        break
      case 'WEEKLY':
        current.setDate(current.getDate() + 7 * (rrule.interval || 1))
        break
      case 'MONTHLY':
        current.setMonth(current.getMonth() + (rrule.interval || 1))
        break
      case 'YEARLY':
        current.setFullYear(current.getFullYear() + (rrule.interval || 1))
        break
      default:
        console.warn('Unsupported FREQ:', rrule.freq)
        return instances
    }
    count++

    // Check UNTIL constraint
    if (rrule.until && current > rrule.until) {
      return instances
    }
  }

  // Now generate instances within the range
  while (count < maxInstances && current <= rangeEnd) {
    // If this instance is within our range, include it
    if (current >= rangeStart && current <= rangeEnd) {
      instances.push(new Date(current))
    }

    // Move to next occurrence based on frequency
    switch (rrule.freq) {
      case 'DAILY':
        current.setDate(current.getDate() + (rrule.interval || 1))
        break
      case 'WEEKLY':
        current.setDate(current.getDate() + 7 * (rrule.interval || 1))
        break
      case 'MONTHLY':
        current.setMonth(current.getMonth() + (rrule.interval || 1))
        break
      case 'YEARLY':
        current.setFullYear(current.getFullYear() + (rrule.interval || 1))
        break
      default:
        console.warn('Unsupported FREQ:', rrule.freq)
        break
    }

    count++

    // Check UNTIL constraint
    if (rrule.until && current > rrule.until) {
      break
    }
  }

  return instances
}

/**
 * Format Date back to iCal format
 */
function formatDateToICal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  if (hour === '00' && minute === '00' && second === '00') {
    return `${year}${month}${day}`
  }

  return `${year}${month}${day}T${hour}${minute}${second}`
}