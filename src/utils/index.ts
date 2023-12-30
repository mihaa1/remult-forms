import { UI_LIB } from '../types'
import * as mui_v5 from './mui_v5.util'
import * as joy_ui from './joy_ui.util'

const UTILS = (uiLib: UI_LIB) => {
	switch (uiLib) {
		case 'mui_v5':
			return mui_v5
		case 'joy_ui':
			joy_ui
	}
}

export default UTILS
