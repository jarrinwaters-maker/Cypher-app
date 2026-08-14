//
//  Cypher.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

enum CypherType: String, Codable {
    case open = "OPEN"
    case competitive = "COMPETITIVE"
    case beatLocked = "BEAT_LOCKED"
}

enum CypherVisibility: String, Codable {
    case `public` = "PUBLIC"
    case inviteOnly = "INVITE_ONLY"
}

enum CypherStatus: String, Codable {
    case open = "OPEN"
    case closed = "CLOSED"
}

struct Cypher: Codable, Identifiable {
    let id: String
    let title: String
    let description: String?
    let beatUrl: String?
    let isActive: Bool
    let cypherType: CypherType
    let startDate: String
    let endDate: String?
    let createdAt: String
    let entryCount: Int?
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case description
        case beatUrl
        case isActive
        case cypherType
        case startDate
        case endDate
        case createdAt
        case _count
    }
    
    struct Count: Codable {
        let entries: Int
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        title = try container.decode(String.self, forKey: .title)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        beatUrl = try container.decodeIfPresent(String.self, forKey: .beatUrl)
        isActive = try container.decode(Bool.self, forKey: .isActive)
        cypherType = try container.decode(CypherType.self, forKey: .cypherType)
        startDate = try container.decode(String.self, forKey: .startDate)
        endDate = try container.decodeIfPresent(String.self, forKey: .endDate)
        createdAt = try container.decode(String.self, forKey: .createdAt)
        
        // Handle nested _count structure
        if let count = try? container.decode(Count.self, forKey: ._count) {
            entryCount = count.entries
        } else {
            entryCount = nil
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(title, forKey: .title)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(beatUrl, forKey: .beatUrl)
        try container.encode(isActive, forKey: .isActive)
        try container.encode(cypherType, forKey: .cypherType)
        try container.encode(startDate, forKey: .startDate)
        try container.encodeIfPresent(endDate, forKey: .endDate)
        try container.encode(createdAt, forKey: .createdAt)
        
        // Encode _count if entryCount is available
        if let entryCount = entryCount {
            let count = Count(entries: entryCount)
            try container.encode(count, forKey: ._count)
        }
    }
}

struct CypherResponse: Codable {
    let cyphers: [Cypher]
    let total: Int
    let page: Int
    let limit: Int
    let totalPages: Int
}

struct CypherEntry: Codable, Identifiable {
    let id: String
    let cypherId: String
    let userId: String
    let audioUrl: String
    let title: String?
    let createdAt: String
    let averageScore: Double?
    let voteCount: Int
    let user: CypherEntryUser?
    
    struct CypherEntryUser: Codable {
        let id: String
        let username: String?
        let email: String
    }
}

struct CypherEntriesResponse: Codable {
    let entries: [CypherEntry]
    let total: Int
    let page: Int
    let limit: Int
    let totalPages: Int
}

struct CypherDetail: Codable {
    let id: String
    let title: String
    let description: String?
    let beatUrl: String?
    let isActive: Bool
    let cypherType: CypherType
    let startDate: String
    let endDate: String?
    let createdAt: String
    let entries: [CypherEntry]
    let userEntry: CypherEntry?
}

struct LeaderboardEntry: Codable {
    let rank: Int
    let entry: CypherEntry
}

struct VoteRequest: Codable {
    let bars: Int
    let flow: Int
    let creativity: Int
}

struct VoteResponse: Codable {
    let message: String
    let averageScore: Double
    let voteCount: Int
}

// MARK: - Top Cyphers

struct TopCypher: Codable, Identifiable {
    let id: String
    let title: String
    let description: String?
    let beatUrl: String?
    let host: HostInfo
    let entryCount: Int
    let voteCount: Int
    let uniqueArtists: Int
    let score: Int
    let createdAt: String
    let startDate: String
    let endDate: String?
    
    struct HostInfo: Codable {
        let id: String
        let username: String?
        let email: String
    }
}

struct TopCyphersResponse: Codable {
    let cyphers: [TopCypher]
}

// MARK: - Cypher Invites

struct CypherInvite: Codable, Identifiable {
    let id: String
    let cypherId: String
    let invitedArtistId: String
    let invitedByArtistId: String
    let status: String // pending, accepted, declined
    let createdAt: String
    let respondedAt: String?
    let cypher: InviteCypherInfo
    let invitedBy: InviteUserInfo
    
    struct InviteCypherInfo: Codable {
        let id: String
        let title: String
        let host: HostInfo
        let entryCount: Int
    }
    
    struct InviteUserInfo: Codable {
        let id: String
        let username: String?
        let email: String
    }
    
    struct HostInfo: Codable {
        let id: String
        let username: String?
        let email: String
    }
}

struct InviteArtistRequest: Codable {
    let artistId: String
}

struct RespondToInviteRequest: Codable {
    let response: String // "accepted" or "declined"
}

