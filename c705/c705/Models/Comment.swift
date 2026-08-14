//
//  Comment.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

struct Comment: Codable, Identifiable {
    let id: String
    let content: String
    let trackId: String?
    let userId: String
    let createdAt: String
    let user: AppUser?
    let track: Track?
    
    enum CodingKeys: String, CodingKey {
        case id
        case content
        case trackId
        case userId
        case createdAt
        case user
        case track
    }
}

struct CreateCommentRequest: Codable {
    let content: String
    let trackId: String
}

struct CommentsResponse: Codable {
    let comments: [Comment]
    let pagination: Pagination
}

