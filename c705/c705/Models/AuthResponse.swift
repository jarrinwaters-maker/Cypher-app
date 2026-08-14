//
//  AuthResponse.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation

struct AuthResponse: Codable {
    let accessToken: String
    let user: AppUser
    let isNewUser: Bool? // Optional: indicates if user was just created (for OAuth flows)
    
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case user
        case isNewUser
    }
    
    // Let Codable automatically synthesize the decoder using CodingKeys
    // This ensures proper mapping from "access_token" to accessToken
}

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct SignupRequest: Codable {
    let username: String?
    let email: String
    let password: String
    let role: String
    let accessCode: String?
    
    enum CodingKeys: String, CodingKey {
        case username
        case email
        case password
        case role
        case accessCode
    }
    
    init(username: String?, email: String, password: String, role: String, accessCode: String? = nil) {
        self.username = username
        self.email = email
        self.password = password
        self.role = role
        self.accessCode = accessCode
    }
}

