//
//  Article.swift
//  c705
//
//  Created for Article models
//

import Foundation

struct ArticlesResponse: Codable {
    let articles: [Article]
    let pagination: Pagination
    
    struct Pagination: Codable {
        let page: Int
        let limit: Int
        let total: Int
        let totalPages: Int
    }
}

struct Article: Codable, Identifiable {
    let id: String
    let title: String
    let content: String
    let city: String
    let author: ArticleAuthor
    let createdAt: String
}

struct ArticleAuthor: Codable {
    let id: String
    let email: String
    let username: String?
}
