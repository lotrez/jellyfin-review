export interface AuthenticateByNameResponse {
	User: User;
	SessionInfo: SessionInfo;
	AccessToken: string;
	ServerId: string;
}

interface SessionInfo {
	PlayState: PlayState;
	AdditionalUsers: any[];
	Capabilities: Capabilities;
	RemoteEndPoint: string;
	PlayableMediaTypes: any[];
	Id: string;
	UserId: string;
	UserName: string;
	Client: string;
	LastActivityDate: string;
	LastPlaybackCheckIn: string;
	DeviceName: string;
	DeviceId: string;
	ApplicationVersion: string;
	IsActive: boolean;
	SupportsMediaControl: boolean;
	SupportsRemoteControl: boolean;
	NowPlayingQueue: any[];
	NowPlayingQueueFullItems: any[];
	HasCustomDeviceName: boolean;
	ServerId: string;
	UserPrimaryImageTag: string;
	SupportedCommands: any[];
}

interface Capabilities {
	PlayableMediaTypes: any[];
	SupportedCommands: any[];
	SupportsMediaControl: boolean;
	SupportsPersistentIdentifier: boolean;
}

interface PlayState {
	CanSeek: boolean;
	IsPaused: boolean;
	IsMuted: boolean;
	RepeatMode: string;
	PlaybackOrder: string;
}

interface User {
	Name: string;
	ServerId: string;
	Id: string;
	PrimaryImageTag: string;
	HasPassword: boolean;
	HasConfiguredPassword: boolean;
	HasConfiguredEasyPassword: boolean;
	EnableAutoLogin: boolean;
	LastLoginDate: string;
	LastActivityDate: string;
	Configuration: Configuration;
	Policy: Policy;
}

interface Policy {
	IsAdministrator: boolean;
	IsHidden: boolean;
	EnableCollectionManagement: boolean;
	EnableSubtitleManagement: boolean;
	EnableLyricManagement: boolean;
	IsDisabled: boolean;
	BlockedTags: any[];
	AllowedTags: any[];
	EnableUserPreferenceAccess: boolean;
	AccessSchedules: any[];
	BlockUnratedItems: any[];
	EnableRemoteControlOfOtherUsers: boolean;
	EnableSharedDeviceControl: boolean;
	EnableRemoteAccess: boolean;
	EnableLiveTvManagement: boolean;
	EnableLiveTvAccess: boolean;
	EnableMediaPlayback: boolean;
	EnableAudioPlaybackTranscoding: boolean;
	EnableVideoPlaybackTranscoding: boolean;
	EnablePlaybackRemuxing: boolean;
	ForceRemoteSourceTranscoding: boolean;
	EnableContentDeletion: boolean;
	EnableContentDeletionFromFolders: any[];
	EnableContentDownloading: boolean;
	EnableSyncTranscoding: boolean;
	EnableMediaConversion: boolean;
	EnabledDevices: any[];
	EnableAllDevices: boolean;
	EnabledChannels: any[];
	EnableAllChannels: boolean;
	EnabledFolders: any[];
	EnableAllFolders: boolean;
	InvalidLoginAttemptCount: number;
	LoginAttemptsBeforeLockout: number;
	MaxActiveSessions: number;
	EnablePublicSharing: boolean;
	BlockedMediaFolders: any[];
	BlockedChannels: any[];
	RemoteClientBitrateLimit: number;
	AuthenticationProviderId: string;
	PasswordResetProviderId: string;
	SyncPlayAccess: string;
}

interface Configuration {
	AudioLanguagePreference: string;
	PlayDefaultAudioTrack: boolean;
	SubtitleLanguagePreference: string;
	DisplayMissingEpisodes: boolean;
	GroupedFolders: any[];
	SubtitleMode: string;
	DisplayCollectionsView: boolean;
	EnableLocalPassword: boolean;
	OrderedViews: string[];
	LatestItemsExcludes: string[];
	MyMediaExcludes: any[];
	HidePlayedInLatest: boolean;
	RememberAudioSelections: boolean;
	RememberSubtitleSelections: boolean;
	EnableNextEpisodeAutoPlay: boolean;
	CastReceiverId: string;
}

export interface UsageRankQuery {
	colums: string[];
	results: string[][];
	message: string;
}
