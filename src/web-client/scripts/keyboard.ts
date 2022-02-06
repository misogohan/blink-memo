import { useEffect } from "react"

type SpecialValue
  = 'Unidentified'
type Printable
  = '!' | '"' | '#' | '$' | '%' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '[' | '\\' | ']' | '^' | '_' | '`' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '{' | '|' | '}' | '~'
type ModifierKey
  = 'Alt'
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
type WhitespaceKey
  = 'Enter'
  | 'Tab'
  | ' '
type NavigationKey
  = 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'End'
  | 'Home'
  | 'PageDown'
  | 'PageUp'
type EditingKey
  = 'Backspace'
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
type UiKey
  = 'Accept'
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
type DeviceKey
  = 'BrightnessDown'
  | 'BrightnessUp'
  | 'Eject'
  | 'LogOff'
  | 'Power'
  | 'PowerOff'
  | 'PrintScreen'
  | 'Hibernate'
  | 'Standby'
  | 'WakeUp'
type ImeAndCompositionKey
  = 'AllCandidates'
  | 'Alphanumeric'
  | 'CodeInput'
  | 'Compose'
  | 'Convert'
  | 'Dead'
  | 'FinalMode'
  | 'GroupFirst'
  | 'GroupLast'
  | 'GroupNext'
  | 'GroupPrevious'
  | 'ModeChange'
  | 'NextCandidate'
  | 'NonConvert'
  | 'PreviousCandidate'
  | 'Process'
  | 'SingleCandidate'
type FunctionKey
  = `F${ 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 }`
  | `Soft${ 1 | 2 | 3 | 4 }`
type PhoneKey
  = 'AppSwitch'
  | 'Call'
  | 'Camera'
  | 'CameraFocus'
  | 'EndCall'
  | 'GoBack'
  | 'GoHome'
  | 'HeadsetHook'
  | 'LastNumberRedial'
  | 'Notification'
  | 'MannerMode'
  | 'VoiceDial'
type MultimediaKey
  = 'ChannelDown'
  | 'ChannelUp'
  | 'MediaFastForward'
  | 'MediaPause'
  | 'MediaPlay'
  | 'MediaPlayPause'
  | 'MediaRecord'
  | 'MediaRewind'
  | 'MediaStop'
  | 'MediaTrackNext'
  | 'MediaTrackPrevious'
type AudioControlKey
  = 'AudioBalanceLeft'
  | 'AudioBalanceRight'
  | 'AudioBassDown'
  | 'AudioBassBoostDown'
  | 'AudioBassBoostToggle'
  | 'AudioBassBoostUp'
  | 'AudioBassUp'
  | 'AudioFaderFront'
  | 'AudioFaderRear'
  | 'AudioSurroundModeNext'
  | 'AudioTrebleDown'
  | 'AudioTrebleUp'
  | 'AudioVolumeDown'
  | 'AudioVolumeMute'
  | 'AudioVolumeUp'
  | 'MicrophoneToggle'
  | 'MicrophoneVolumeDown'
  | 'MicrophoneVolumeMute'
  | 'MicrophoneVolumeUp'
type TvControlKey
  = 'TV'
  | 'TV3DMode'
  | 'TVAntennaCable'
  | 'TVAudioDescription'
  | 'TVAudioDescriptionMixDown'
  | 'TVAudioDescriptionMixUp'
  | 'TVContentsMenu'
  | 'TVDataService'
  | 'TVInput'
  | 'TVInputComponent1'
  | 'TVInputComponent2'
  | 'TVInputComposite1'
  | 'TVInputComposite2'
  | `TVInputHDMI${ 1 | 2 | 3 | 4 }`
  | 'TVInputVGA1'
  | 'TVMediaContext'
  | 'TVNetwork'
  | 'TVNumberEntry'
  | 'TVPower'
  | 'TVRadioService'
  | 'TVSatellite'
  | 'TVSatelliteBS'
  | 'TVSatelliteCS'
  | 'TVSatelliteToggle'
  | 'TVTerrestrialAnalog'
  | 'TVTerrestrialDigital'
  | 'TVTimer'
type MediaControllerKey
  = 'AVRInput'
  | 'AVRPower'
  | 'ColorF0Red'
  | 'ColorF1Green'
  | 'ColorF2Yellow'
  | 'ColorF3Blue'
  | 'ColorF4Grey'
  | 'ColorF5Brown'
  | 'ClosedCaptionToggle'
  | 'Dimmer'
  | 'DisplaySwap'
  | 'DVR'
  | 'Exit'
  | `FavoriteClear${ 0 | 1 | 2 | 3 }`
  | `FavoriteRecall${ 0 | 1 | 2 | 3 }`
  | `FavoriteStore${ 0 | 1 | 2 | 3 }`
  | 'Guide'
  | 'GuideNextDay'
  | 'GuidePreviousDay'
  | 'Info'
  | 'InstantReplay'
  | 'Link'
  | 'ListProgram'
  | 'LiveContent'
  | 'Lock'
  | 'MediaApps'
  | 'MediaAudioTrack'
  | 'MediaLast'
  | 'MediaSkipBackward'
  | 'MediaSkipForward'
  | 'MediaStepBackward'
  | 'MediaStepForward'
  | 'MediaTopMenu'
  | 'NavigateIn'
  | 'NavigateNext'
  | 'NavigateOut'
  | 'NavigatePrevious'
  | 'NextFavoriteChannel'
  | 'NextUserProfile'
  | 'OnDemand'
  | 'Pairing'
  | 'PinPDown'
  | 'PinPMove'
  | 'PinPToggle'
  | 'PinPUp'
  | 'PlaySpeedDown'
  | 'PlaySpeedReset'
  | 'PlaySpeedUp'
  | 'RandomToggle'
  | 'RcLowBattery'
  | 'RecordSpeedNext'
  | 'RfBypass'
  | 'ScanChannelsToggle'
  | 'ScreenModeNext'
  | 'Settings'
  | 'SplitScreenToggle'
  | 'STBInput'
  | 'STBPower'
  | 'Subtitle'
  | 'Teletext'
  | 'VideoModeNext'
  | 'Wink'
  | 'ZoomToggle'
type SpeechRecognitionKey
  = 'SpeechCorrectionList'
  | 'SpeechInputToggle'
type DocumentKey
  = 'Close'
  | 'New'
  | 'Open'
  | 'Print'
  | 'Save'
  | 'SpellCheck'
  | 'MailForward'
  | 'MailReply'
  | 'MailSend'
type ApplicationSelectorKey
  = 'LaunchCalculator'
  | 'LaunchCalendar'
  | 'LaunchContacts'
  | 'LaunchMail'
  | 'LaunchMediaPlayer'
  | 'LaunchMusicPlayer'
  | 'LaunchMyComputer'
  | 'LaunchPhone'
  | 'LaunchScreenSaver'
  | 'LaunchSpreadsheet'
  | 'LaunchWebBrowser'
  | 'LaunchWebCam'
  | 'LaunchWordProcessor'
  | `LaunchApplication${ 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 }`
type BrowserControlKey
  = 'BrowserBack'
  | 'BrowserFavorites'
  | 'BrowserForward'
  | 'BrowserHome'
  | 'BrowserRefresh'
  | 'BrowserSearch'
  | 'BrowserStop'
type NumericKeypadKey
  = 'Decimal'
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

type Key = Printable | ModifierKey | WhitespaceKey | NavigationKey | EditingKey | UiKey | DeviceKey | ImeAndCompositionKey | FunctionKey | PhoneKey | MultimediaKey | AudioControlKey | TvControlKey | MediaControllerKey | SpeechRecognitionKey | DocumentKey | ApplicationSelectorKey | BrowserControlKey | NumericKeypadKey;

enum Location {
  DOM_KEY_LOCATION_STANDARD,
  DOM_KEY_LOCATION_LEFT,
  DOM_KEY_LOCATION_RIGHT,
  DOM_KEY_LOCATION_NUMPAD,
}

type EventType = 'keydown' | 'keypress' | 'keyup';

type Foo = {
  type: EventType,
  key: Key | Key[],
  options?: {
    alt?: boolean,
    ctrl?: boolean,
    meta?: boolean,
    shift?: boolean,
    isComposing?: boolean,
    repeat?: boolean,
    location?: Location | Location[],
  },
}

export const useKeyboardEvent = (eventType: EventType, listener: (event: KeyboardEvent) => void) => {
    useEffect(() => {
        document.addEventListener(eventType, listener);
        return () => {
            document.removeEventListener(eventType, listener);
        }
    }, [eventType, listener]);
}