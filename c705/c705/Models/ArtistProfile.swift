//
//  ArtistProfile.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

struct ArtistProfile: Codable, Identifiable {
    let id: String
    let name: String
    let bio: String?
    let email: String
    let role: String
    let city: String?
    let avatarUrl: String?
    let instagramUrl: String?
    let youtubeUrl: String?
    let xUrl: String?
    let tiktokUrl: String?
    let followersCount: Int
    let tracksCount: Int
    let tracks: [Track]?
    let isFollowing: Bool?
    let createdAt: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case bio
        case email
        case role
        case city
        case avatarUrl
        case instagramUrl
        case youtubeUrl
        case xUrl
        case tiktokUrl
        case followersCount
        case tracksCount
        case tracks
        case isFollowing
        case createdAt
    }
}

struct ArtistTracksResponse: Codable {
    let tracks: [Track]
    let pagination: Pagination
}

struct FollowResponse: Codable {
    let message: String
    let artistId: String
}

struct FollowersResponse: Codable {
    let followers: [Follower]
    let pagination: Pagination
}

struct Follower: Codable, Identifiable {
    let id: String
    let email: String
    let role: String
    let followedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case role
        case followedAt
    }
}

