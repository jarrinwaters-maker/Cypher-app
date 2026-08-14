//
//  FeedItem.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

enum FeedItemType: String, Codable {
    case track
    case article
}

struct FeedItem: Codable, Identifiable {
    let id: String
    let type: FeedItemType
    let title: String
    let createdAt: String
    
    // Track-specific properties
    let audioUrl: String?
    let likeCount: Int?
    let isLiked: Bool?
    let artist: Artist?
    
    // Article-specific properties
    let content: String?
    let city: String?
    let author: AppUser?
    
    enum CodingKeys: String, CodingKey {
        case id
        case type
        case title
        case createdAt
        case audioUrl
        case likeCount
        case isLiked
        case artist
        case content
        case city
        case author
    }
}

struct FeedResponse: Codable {
    let feed: [FeedItem]
    let pagination: Pagination
}

struct Pagination: Codable {
    let page: Int
    let limit: Int
    let total: Int
    let totalPages: Int
}

