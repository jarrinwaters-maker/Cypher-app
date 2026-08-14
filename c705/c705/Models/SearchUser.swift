//
//  SearchUser.swift
//  c705
//
//  Model for user search results
//

import Foundation

struct SearchUser: Identifiable, Codable {
    let id: String
    let username: String?
    let email: String
    let role: String
}
