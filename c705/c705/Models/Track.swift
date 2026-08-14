 //
//  Track.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

struct Track: Codable, Identifiable {
    let id: String
    let title: String
    let audioUrl: String
    let artistId: String
    let likeCount: Int
    let createdAt: String
    let artist: Artist?
    var isLiked: Bool?
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case audioUrl
        case artistId
        case likeCount
        case createdAt
        case artist
        case isLiked
    }
}

struct Artist: Codable, Identifiable {
    let id: String
    let bio: String?
    let user: AppUser?
    
    enum CodingKeys: String, CodingKey {
        case id
        case bio
        case user
    }
}

