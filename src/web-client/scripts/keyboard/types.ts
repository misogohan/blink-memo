export type SpecialValue = 'Unidentified'
export type Printable =
  | '!' | '"' | '#' | '$' | '%' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | ':' | ';' | '<' | '=' | '>' | '?' | '@'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  | '[' | '\\' | ']' | '^' | '_' | '`'
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | '{' | '|' | '}' | '~'
export type ModifierKey =
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Control'
  | 'Fn'
  | 'FnLock'
  | 'Hyper'
  | 'Meta'
  | 'NumLock'
  | 'ScrollLock'
  | 'Shift'
  | 'Super'
  | 'Symbol'
  | 'SymbolLock'
export type WhitespaceKey = 'Enter' | 'Tab' | ' '
export type NavigationKey =
  | `Arrow${ 'Down' | 'Left' | 'Right' | 'Up' }`
  | 'End' | 'Home'
  | `Page${ 'Down' | 'Up' }`
export type EditingKey =
  | 'Backspace'
  | 'Clear'
  | 'Copy'
  | 'CrSel'
  | 'Cut'
  | 'Delete'
  | 'EraseEof'
  | 'ExSel'
  | 'Insert'
  | 'Paste'
  | 'Redo'
  | 'Undo'
export type UiKey =
  | 'Accept'
  | 'Again'
  | 'Attn'
  | 'Cancel'
  | 'ContextMenu'
  | 'Escape'
  | 'Execute'
  | 'Find'
  | 'Finish'
  | 'Help'
  | 'Pause'
  | 'Play'
  | 'Props'
  | 'Select'
  | 'ZoomIn'
  | 'ZoomOut'
export type DeviceKey =
  | `Brightness${ 'Down' | 'Up' }`
  | 'Eject'
  | 'LogOff'
  | 'Power'
  | 'PowerOff'
  | 'PrintScreen'
  | 'Hibernate'
  | 'Standby'
  | 'WakeUp'
export type ImeAndCompositionKey =
  | 'AllCandidates'
  | 'Alphanumeric'
  | 'CodeInput'
  | 'Compose'
  | 'Convert'
  | 'Dead'
  | 'FinalMode'
  | `Group${ 'First' | 'Last' | 'Next' | 'Previous' }`
  | 'ModeChange'
  | 'NextCandidate'
  | 'NonConvert'
  | 'PreviousCandidate'
  | 'Process'
  | 'SingleCandidate'
export type FunctionKey =
  | `F${ 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 }`
  | `Soft${ 1 | 2 | 3 | 4 }`
export type PhoneKey =
  | 'AppSwitch'
  | 'Call'
  | 'Camera'
  | 'CameraFocus'
  | 'EndCall'
  | `Go${ 'Back' | 'Home' }`
  | 'HeadsetHook'
  | 'LastNumberRedial'
  | 'Notification'
  | 'MannerMode'
  | 'VoiceDial'
export type MultimediaKey =
  | `Channel${ 'Down' | 'Up' }`
  | `Media${
    | 'Pause'
    | 'Play'
    | 'PlayPause'
    | 'Record'
    | 'Rewind'
    | 'Stop'
    | `Track${ 'Next' | 'Previous' }`
  }`
export type AudioControlKey =
  | `Audio${
    | `Balance${ 'Left' | 'Right' }`
    | `Bass${ 'Down' | `Boost${ 'Down' | 'Toggle' | 'Up' }` | 'Up' }`
    | `Fader${ 'Front' | 'Rear' }`
    | 'SurroundModeNext'
    | `Treble${ 'Down' | 'Up' }`
    | `Volume${ 'Down' | 'Mute' | 'Up' }`
  }`
  | `Microphone${ 'Toggle' | `Volume${ 'Down' | 'Mute' | 'Up' }` }`
export type TvControlKey = `TV${
  | ''
  | '3DMode'
  | 'AntennaCable'
  | `AudioDescription${ '' | 'MixDown' | 'MixUp' }`
  | 'ContentsMenu'
  | 'DataService'
  | 'Input'
  | `Input${ 'Component' | 'Composite' }${ 1 | 2 }`
  | `Input${ `HDMI${ 1 | 2 | 3 | 4 }` | 'VGA1' }`
  | 'MediaContext'
  | 'Network'
  | 'NumberEntry'
  | 'Power'
  | 'RadioService'
  | `Satellite${ '' | 'BS' | 'CS' }`
  | 'SatelliteToggle'
  | `Terrestrial${ 'Analog' | 'Digital' }`
  | 'Timer'
}`
export type MediaControllerKey =
  | `AVR${ 'Input' | 'Power' }`
  | `Color${ 'F0Red' | 'F1Green' | 'F2Yellow' | 'F3Blue' | 'F4Grey' | 'F5Brown' }`
  | 'ClosedCaptionToggle'
  | 'Dimmer'
  | 'DisplaySwap'
  | 'DVR'
  | 'Exit'
  | `Favorite${ 'Clear' | 'Recall' | 'Store' }${ 0 | 1 | 2 | 3 }`
  | `Guide${ '' | 'NextDay' | 'PreviousDay' }`
  | 'Info'
  | 'InstantReplay'
  | `Ling${ '' | 'Program' | 'Content' }`
  | 'Lock'
  | `Media${ 'Apps' | 'AudioTrack' | 'Last' | `${ 'Skip' | 'Step' }${ 'Backward' | 'Forward' }` | 'TopMenu' }`
  | `Navigate${ 'In' | 'Next' | 'Out' | 'Previous' }`
  | `Next${ 'FavoriteChannel' | 'UserProfile' }`
  | 'OnDemand'
  | 'Pairing'
  | `PinP${ 'Down' | 'Move' | 'Toggle' | 'Up' }`
  | `PlaySpeed${ 'Down' | 'Reset' | 'Up' }`
  | 'RandomToggle'
  | 'RcLowBattery'
  | 'RecordSpeedNext'
  | 'RfBypass'
  | 'ScanChannelsToggle'
  | 'ScreenModeNext'
  | 'Settings'
  | 'SplitScreenToggle'
  | `STB${ 'Input' | 'Power' }`
  | 'Subtitle'
  | 'Teletext'
  | 'VideoModeNext'
  | 'Wink'
  | 'ZoomToggle'
export type SpeechRecognitionKey = `Speech${ 'CorrectionList' | 'InputToggle' }`
export type DocumentKey =
  | 'Close'
  | 'New'
  | 'Open'
  | 'Print'
  | 'Save'
  | 'SpellCheck'
  | `Mail${ 'Forward' | 'Reply' | 'Send' }`
export type ApplicationSelectorKey = `Launch${
  | 'Calculator'
  | 'Calendar'
  | 'Contacts'
  | 'Mail'
  | `${ 'Media' | 'Music' }Player`
  | 'MyComputer'
  | 'Phone'
  | 'ScreenSaver'
  | 'Spreadsheet'
  | 'WebBrowser'
  | 'WebCam'
  | 'WordProcessor'
  | `Application${ 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 }`
}`
export type BrowserControlKey = `Browser${
  | 'Back'
  | 'Favorites'
  | 'Forward'
  | 'Home'
  | 'Refresh'
  | 'Search'
  | 'Stop'
}`
export type NumericKeypadKey =
  | 'Decimal'
  | 'Key11'
  | 'Key12'
  | 'Multiply'
  | 'Add'
  | 'Clear'
  | 'Divide'
  | 'Subtract'
  | 'Separator'
  | '0'
  | '9'

export type Key =
  | SpecialValue
  | Printable
  | ModifierKey
  | WhitespaceKey
  | NavigationKey
  | EditingKey
  | UiKey
  | DeviceKey
  | ImeAndCompositionKey
  | FunctionKey
  | PhoneKey
  | MultimediaKey
  | AudioControlKey
  | TvControlKey
  | MediaControllerKey
  | SpeechRecognitionKey
  | DocumentKey
  | ApplicationSelectorKey
  | BrowserControlKey
  | NumericKeypadKey;

export enum Location {
  DOM_KEY_LOCATION_STANDARD,
  DOM_KEY_LOCATION_LEFT,
  DOM_KEY_LOCATION_RIGHT,
  DOM_KEY_LOCATION_NUMPAD,
}

export type EventType = 'keydown' | 'keypress' | 'keyup';

