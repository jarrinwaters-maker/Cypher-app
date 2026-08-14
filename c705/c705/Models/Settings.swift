//
//  Settings.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

// MARK: - Settings Model (matches backend JSON structure)
struct UserSettings: Codable {
    var notifications: NotificationSettings
    var privacy: PrivacySettings
    var playback: PlaybackSettings
    var artist: ArtistSettings?
    var producer: ProducerSettings?
    var engineer: EngineerSettings?
    var journalist: JournalistSettings?
    var freestyleArena: FreestyleArenaSettings?
    
    init() {
        self.notifications = NotificationSettings()
        self.privacy = PrivacySettings()
        self.playback = PlaybackSettings()
    }
}

// MARK: - Base Settings

struct NotificationSettings: Codable {
    var likes: Bool = true
    var comments: Bool = true
    var followers: Bool = true
    var mentions: Bool = true
    var events: Bool = true
}

struct PrivacySettings: Codable {
    var privateProfile: Bool = false
    var whoCanComment: CommentPermission = .everyone
    var whoCanMessage: MessagePermission = .everyone
    var blockedUsers: [String] = []
}

enum CommentPermission: String, Codable {
    case everyone = "everyone"
    case followers = "followers"
}

enum MessagePermission: String, Codable {
    case everyone = "everyone"
    case followers = "followers"
    case none = "none"
}

struct PlaybackSettings: Codable {
    var autoplayNext: Bool = true
    var streamOverCellular: Bool = false
    var audioQuality: AudioQuality = .medium
    var downloadOverWiFiOnly: Bool = true
}

enum AudioQuality: String, Codable {
    case low = "low"
    case medium = "medium"
    case high = "high"
}

// MARK: - Artist Settings

struct ArtistSettings: Codable {
    var displayName: String?
    var bio: String?
    var location: String?
    var instagram: String?
    var twitter: String?
    var youtube: String?
    var allowDuets: Bool = true
    var allowFreestyleChallenges: Bool = true
    var pinnedTrackId: String?
    var hideOldTracks: Bool = false
}

// MARK: - Producer Settings

struct ProducerSettings: Codable {
    var producerName: String?
    var tags: [String] = []
    var equipment: [String] = []
    var defaultBeatPrice: Double?
    var offerLease: Bool = true
    var offerExclusive: Bool = true
    var autoDelivery: Bool = true
    var showInSearch: Bool = true
    var allowPreviews: Bool = true
    var allowFreeDownloads: Bool = false
}

// MARK: - Engineer Settings

struct EngineerSettings: Codable {
    var studioName: String?
    var location: String?
    var equipment: [String] = []
    var availableDays: [String] = []
    var sessionLengths: [Int] = []
    var cancellationPolicy: String?
    var bufferTime: Int = 30 // minutes
    var enableReviews: Bool = true
}

// MARK: - Journalist Settings

struct JournalistSettings: Codable {
    var citiesCovered: [String] = []
    var genresCovered: [String] = []
}

// MARK: - Freestyle Arena Settings

struct FreestyleArenaSettings: Codable {
    var countdownTimer: Bool = true
    var autoTrimSilence: Bool = true
    var saveDrafts: Bool = true
    var allowBattleInvites: Bool = true
    var showRanking: Bool = true
    var notifyLeaderboardUpdates: Bool = true
}

