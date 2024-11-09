// Type to require at least one of props on a type

export type HourInDay =
	| -1
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 23
	| 24

export const GET_WEEK_DAYS = (start: WeekStart) =>
	start === WeekStart.sun
		? DAYS
		: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export type Lang = 'en' | 'he'

export type UsagePlan = '' | 'plus_monthly' | 'plus_yearly' | 'enterprise'

export type ScheduleType = 'day' | 'week' | 'month'

export enum WeekStart {
	sun = 'sun',
	mon = 'mon',
}

export interface HasId {
	id: string
}

export type ShareCopyAction = 'share' | 'copy'
export type LoginAction = '' | 'login' | 'signup'

export type ShiftStateWarningReason = 'person_count' | 'attribute_count'

type CountState = { state: 'smaller' | 'larger' }

export type AttributesState = {
	[key: string]: {
		attr: string
		requiredCount: number
		count: number
	} & CountState
}

export type ShiftState = {
	reason: ShiftStateWarningReason
	details: CountState | AttributesState
}

export type RequestsToAPILimit = {
	day?: number
	hour?: number
	lastRequest?: Date
}
